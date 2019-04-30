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

import { AppState } from '../state';
import { clean, restore } from '../../helpers/clean-restore';
import { spawnChromeDriver } from '../driver';
import { getClient } from '../client';
import { runTestFile, readTests } from '../runner';
import { ChildProcess } from 'child_process';
import { getReportDir, writeReport } from '../../report';
import { Setup } from './setup';
import { seedUserDataDir } from '../../helpers/seed-user-data-dir';
import { isSignInDisabled } from '../../utils/is-sign-in-disabled';
import { wait } from '../../utils/wait';
import { killSlack } from '../../native-commands/kill-slack';
import { Results } from './results';
import { waitUntilSlackReady } from '../../helpers/wait-until-slack-ready';
import { JoeBrowserObject } from '../../interfaces';
import { killChromedriver } from '../../native-commands/kill-chromedriver';

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
    this.testCallback = this.testCallback.bind(this);

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
      <div>
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
    const { appState } = this.props;
    const { testsDone, testsFailed } = appState;

    return (
      <>
        <Results appState={appState} />
        <Card
          interactive={appState.generateReportAtEnd}
          elevation={Elevation.TWO}
          className="progress-card"
          onClick={this.showReportMaybe}
        >
          <Spinner value={this.getPercentageDone()} />
          <div>
            <p>
              <Icon icon="endorsed" /> Successful tests: {testsDone}
            </p>
            <Divider />
            <p>
              <Icon icon="error" /> Failed tests: {testsFailed}
            </p>
            {this.renderDone()}
          </div>
        </Card>
      </>
    );
  }

  public renderDone() {
    const { appState } = this.props;
    const text = appState.generateReportAtEnd ? (
      <>
        All done! Click here for screenshots <Icon icon="camera" />
      </>
    ) : (
      'All done!'
    );

    return appState.done ? (
      <>
        <Divider />
        <p>{text}</p>
      </>
    ) : null;
  }

  public async run() {
    const { appState } = this.props;

    this.setState({
      hasCountdownStarted: true,
      startingIn: this.getExpectedLauchTime()
    });

    await killSlack();
    await killChromedriver();
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
    await waitUntilSlackReady(client, !isSignInDisabled(appState));

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
        try {
          appState.results.push(
            await runTestFile(
              test.name,
              test.suiteMethodResults,
              this.testCallback,
              appState
            )
          );
        } catch (error) {
          console.warn(`Failed to run test suite ${test.name}`, error);
        }
      }

      appState.done = true;

      if (appState.generateReportAtEnd) {
        try {
          await writeReport(appState.results);
        } catch (error) {
          console.warn(`Failed to write report`, error);
        }
      }
    } catch (error) {
      console.warn(`Failed to run tests`, error);
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

  /**
   * Callback for individual tests, counting successes and errors
   *
   * @param {boolean} success
   */
  public testCallback(success: boolean) {
    const { appState } = this.props;

    if (success) {
      appState.testsDone++;
    } else {
      appState.testsFailed++;
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

  private setNewExpectedLaunchTime() {
    const { startingIn } = this.state;
    const expectedLaunchTime = this.getExpectedLauchTime();

    this.props.appState.expectedLaunchTime = `${expectedLaunchTime -
      startingIn}`;
  }

  private getStartingIn() {
    const { startingIn } = this.state;
    return `${(startingIn / 1000).toFixed(1)}s`;
  }

  private getPercentageDone() {
    const { appState } = this.props;
    const { testsDone, testsFailed, testsTotal, done } = appState;

    if (done) return 1;
    return testsTotal > 0 ? (testsFailed + testsDone) / testsTotal : 0;
  }
}
