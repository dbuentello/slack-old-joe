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
                value={this.state.startingIn / this.getExpectedLaunchTime()}
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
        <Results done={appState.done} results={appState.results} />
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
      startingIn: this.getExpectedLaunchTime()
    });

    // Okay, get ready to run this
    const countdownInterval = setInterval(() => {
      this.setState({ startingIn: this.state.startingIn - 50 });
    }, 50);

    await clean();

    // Should we seed a user data dir? We'll do so if
    // the sign-in test is disabled
    if (isSignInDisabled(appState)) {
      await seedUserDataDir();

      // Also, we'll disable the sign-out test
      const signOutTest = appState.availableTestFiles.find(
        ({ name }) => name === 'Sign out'
      );
      signOutTest!.disabled = true;
    }

    await this.startClientDriver(!isSignInDisabled(appState));

    clearInterval(countdownInterval);
    this.setNewExpectedLaunchTime();
    this.setState({ startingIn: 0 });

    await this.startTests();
    await this.stopTests();
  }

  /**
   * Start running the tests.
   */
  public async startTests() {
    this.setState({ hasStarted: true });

    try {
      await this.readTests();
      await this.runTests();
      await this.writeReportMaybe();
    } catch (error) {
      console.warn(`Failed to run tests`, error);
    }
  }

  /**
   * Runs all tests, restarting driver and client every four suites.
   */
  public async runTests() {
    const { appState } = this.props;

    for (const [index, test] of appState.tests.entries()) {
      // Every four tests we restart client and driver.
      // That increases stability, client and driver seem to
      // become less stable when you run tons of tests on them.
      if (index && index % 4 === 0) {
        await this.stopClientDriver();
        await this.startClientDriver(false);
      }

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
  }

  /**
   * Called once all tests have finished.
   */
  public async stopTests() {
    const { appState } = this.props;

    if (appState.closeAppAtEnd) {
      try {
        await this.stopClientDriver();

        // Restore a possible user data backup
        await wait(300);
        await restore();
      } catch (error) {
        console.warn(error);
      }
    }
  }

  /**
   * Start both client and driver.
   *
   * @param {boolean} expectSignIn
   */
  public async startClientDriver(expectSignIn: boolean) {
    const { appState } = this.props;

    // Kill a possibly still running Slack and Chromedriver
    await killSlack(appState);
    await killChromedriver();

    // Driver, then client
    await spawnChromeDriver();
    await getClient(appState);

    // Wait for the client to be ready
    await wait(1000);
    await waitUntilSlackReady(window.client, expectSignIn);
  }

  /**
   * Stop both client and driver.
   */
  public async stopClientDriver() {
    const { appState } = this.props;

    try {
      // Kill driver and session
      await window.client.deleteSession();
      await window.driver.kill();

      // Optional, but harder
      await killChromedriver();

      // Kill Slack, if still running
      await killSlack(appState);
    } catch (error) {
      console.warn(error);
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

  private getExpectedLaunchTime() {
    return parseInt(this.props.appState.expectedLaunchTime, 10);
  }

  private setNewExpectedLaunchTime() {
    const { startingIn } = this.state;
    const expectedLaunchTime = this.getExpectedLaunchTime();

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

  private async readTests() {
    const { appState } = this.props;

    appState.tests = await readTests(appState.availableTestFiles);
    appState.testsTotal = appState.tests.reduce((prev, test) => {
      return prev + test.suiteMethodResults.it.length;
    }, 0);
  }

  private async writeReportMaybe() {
    const { appState } = this.props;

    if (appState.generateReportAtEnd) {
      try {
        await writeReport(appState.results);
      } catch (error) {
        console.warn(`Failed to write report`, error);
      }
    }
  }
}
