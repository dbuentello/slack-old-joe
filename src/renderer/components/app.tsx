import { observer } from 'mobx-react';
import * as React from 'react';
import {
  Button,
  Spinner,
  Card,
  Elevation,
  Icon,
  Divider
} from '@blueprintjs/core';
import { shell } from 'electron';

import { AppState, appState } from '../state';
import { clean, restore } from '../../helpers/clean-restore';
import { spawnChromeDriver } from '../driver';
import { getClient } from '../client';
import { runTestFile, readTests } from '../runner';
import { ChildProcess } from 'child_process';
import { getReportDir, writeReport } from '../../report';
import { Setup } from './setup';
import { seedUserDataDir } from '../../helpers/seed-user-data-dir';
import { isSignInDisabled } from '../../utils/is-sign-in-disabled';
import { wait } from '../../helpers/wait';
import { killSlack } from '../../native-commands/kill';
import { Results } from './results';
import { waitUntilSlackReady } from '../../helpers/wait-until-slack-ready';
import { JoeBrowserObject } from '../../interfaces';
import { start } from 'repl';
interface AppProps {
  appState: AppState;
}

interface LocalAppState {
  startingIn: number;
  hasCountdownStarted: boolean;
  hasStarted: boolean;
}

@observer
export class App extends React.Component<AppProps, LocalAppState> {
  constructor(props: AppProps) {
    super(props);

    this.run = this.run.bind(this);
    this.showReportMaybe = this.showReportMaybe.bind(this);

    this.state = {
      startingIn: 0,
      hasStarted: false,
      hasCountdownStarted: false
    };
  }

  public render() {
    const { hasStarted, startingIn } = this.state;
    const progressOrStandby =
      hasStarted && !startingIn
        ? this.renderProgress()
        : this.renderStartingIn();

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'space-between',
          justifyContent: 'space-between',
          height: '100%'
        }}
      >
        <h2 style={{ textAlign: 'right', marginTop: 0 }}>🐪</h2>

        {progressOrStandby}
      </div>
    );
  }

  public renderStartingIn() {
    const { hasCountdownStarted, hasStarted } = this.state;
    const text =
      hasCountdownStarted && !hasStarted
        ? `Lift-Off expected in ${this.getStartingIn()}`
        : `Start Smoke Tests`;

    return (
      <>
        <Setup appState={this.props.appState} />
        <Button
          icon="play"
          rightIcon={
            this.state.startingIn > 0 ? (
              <Spinner
                value={this.state.startingIn / this.getExpectedLauchTime()}
                size={20}
              />
            ) : null
          }
          large={true}
          text={text}
          disabled={this.state.hasCountdownStarted}
          onClick={this.run}
        />
      </>
    );
  }

  public renderProgress() {
    const { testsDone, testsFailed, testsTotal, done } = this.props.appState;
    const percentageDone =
      testsTotal > 0 ? (testsFailed + testsDone) / testsTotal : 0;

    return (
      <>
        <Results appState={appState} />
        <Card
          interactive={appState.generateReportAtEnd}
          elevation={Elevation.TWO}
          className="progress-card"
          onClick={this.showReportMaybe}
        >
          <Spinner value={percentageDone} />
          <div style={{ height: '9rem' }}>
            <Icon icon="endorsed" /> Successful tests: {testsDone}
            <Divider />
            <Icon icon="error" /> Failed tests: {testsFailed}
            {this.renderDone()}
          </div>
        </Card>
      </>
    );
  }

  public renderDone() {
    const { appState } = this.props;
    const text = appState.generateReportAtEnd
      ? (<>All done! Click here for screenshots <Icon icon="camera" /></>)
      : 'All done!';

    return appState.done
     ? (
      <>
        <Divider />
        <span>{text}</span>
      </>
     )
     : null;
  }

  public async run() {
    const { appState } = this.props;

    this.setState({ hasCountdownStarted: true, startingIn: this.getExpectedLauchTime() });

    await clean();

    // Should we seed a user data dir? We'll do so if
    // the sign-in test is disabled
    if (isSignInDisabled(appState)) {
      await seedUserDataDir();
    }

    const driver = await spawnChromeDriver();
    const client = await getClient(appState);

    // Okay, get ready to run this
    const countdownInterval = setInterval(() => {
      this.setState({ startingIn: this.state.startingIn - 50 });
    }, 50);

    // Wait for the client to be ready
    await wait(1000);
    await waitUntilSlackReady(client);

    clearInterval(countdownInterval);
    this.setNewExpectedLaunchTime();
    this.setState({ startingIn: 0 });

    await this.runTests(driver);
    await this.stopTests(driver, client);
  }

  public async runTests(_driver: ChildProcess) {
    const { appState } = this.props;

    this.setState({ hasStarted: true });

    try {
      appState.tests = await readTests(appState.availableTestFiles);
      appState.testsTotal = appState.tests.reduce((prev, test) => {
        return prev + test.suiteMethodResults.it.length;
      }, 0);

      for (const test of appState.tests) {
        // Now run the suite, updating after each test
        const fileResult = await runTestFile(
          test.name,
          test.suiteMethodResults,
          success => {
            if (success) {
              appState.testsDone++;
            } else {
              appState.testsFailed++;
            }
          },
          appState
        );

        appState.results.push(fileResult);
      }

      appState.done = true;

      if (appState.generateReportAtEnd) {
        await writeReport(appState.results);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  public async stopTests(driver: ChildProcess, client: JoeBrowserObject) {
    if (this.props.appState.closeAppAtEnd) {
      try {
        // Kill driver and session
        await client.deleteSession();
        await driver.kill();

        // Kill Slack, if still running
        await killSlack();

        // Restore a possible user data backup
        await wait(300);
        await restore();
      } catch (error) {
        console.warn(error);
      }
    }
  }

  public showReportMaybe() {
    if (this.props.appState.generateReportAtEnd) {
      shell.showItemInFolder(getReportDir());
    }
  }

  private getExpectedLauchTime() {
    return parseInt(this.props.appState.expectedLaunchTime, 10);
  }

  private getStartingIn() {
    const { startingIn } = this.state;
    return `${(startingIn / 1000).toFixed(1)}s`;
  }

  private setNewExpectedLaunchTime() {
    const { startingIn } = this.state;
    const expectedLaunchTime = this.getExpectedLauchTime();

    this.props.appState.expectedLaunchTime = `${expectedLaunchTime - startingIn}`;
  }
}
