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
import { getScreenshotDir } from '../../helpers/screenshot';
import { SuiteResult } from '../../interfaces';
import { Setup } from './setup';

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

    this.state = {
      startingIn: 0,
      hasStarted: false,
      hasCountdownStarted: false
    };
  }

  public render() {
    const { appState } = this.props;
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
        ? `Preparing for Lift-Off...`
        : `Start Smoke Tests`;

    return (
      <>
        <Setup appState={this.props.appState} />
        {this.state.startingIn > 0 ? (
          <Spinner value={this.state.startingIn / 3000} />
        ) : null}
        <Button
          icon="play"
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
        {this.renderResults()}
        <Card
          interactive={true}
          elevation={Elevation.TWO}
          className="progress-card"
          onClick={() => shell.showItemInFolder(getScreenshotDir())}
        >
          <Spinner value={percentageDone} />
          <div>
            <Icon icon="endorsed" /> Successful tests: {testsDone}
            <Divider />
            <Icon icon="error" /> Failed tests: {testsFailed}
            {done ? (
              <>
                <Divider />
                <span>
                  All done! Click here for screenshots <Icon icon="camera" />
                </span>
              </>
            ) : null}
          </div>
        </Card>
      </>
    );
  }

  public renderResults() {
    const { results } = this.props.appState;
    const resultElements =
      results.length > 0 ? (
        results.map(this.renderResult)
      ) : (
        <h5>Waiting for test results...</h5>
      );

    return (
      <Card elevation={Elevation.ONE} className="result-card">
        {resultElements}
      </Card>
    );
  }

  public renderResult(suiteResult: SuiteResult) {
    return (
      <>
        <h5>{suiteResult.name}</h5>
        {suiteResult.results.map(({ ok, name, error }) => {
          const icon = ok ? (
            <Icon icon="endorsed" />
          ) : (
            <Icon icon="error" intent="danger" />
          );

          const errorElement = error ? <pre>{error.toString()}</pre> : null;

          return (
            <div className="result">
              <p>
                {icon} {name}
              </p>
              {errorElement}
            </div>
          );
        })}
      </>
    );
  }

  public async run() {
    this.setState({ hasCountdownStarted: true });

    await clean();

    // Start the driver and the client
    const { appState } = this.props;

    if (!appState.appToTest) {
      throw new Error('Please select an app to test first!');
    }

    const driver = await spawnChromeDriver();
    const client = await getClient({ binary: appState.appToTest });

    // Okay, get ready to run this
    const countdownInterval = setInterval(() => {
      this.setState({ startingIn: this.state.startingIn - 50 });
    }, 50);

    setTimeout(async () => {
      clearInterval(countdownInterval);
      this.setState({ startingIn: 0 });

      await this.runTests(driver, client);
      await this.stopTests(driver, client);
    }, 3000);
  }

  public async runTests(_driver: ChildProcess, client: BrowserObject) {
    const { appState } = this.props;

    this.setState({ hasStarted: true });

    try {
      appState.tests = await readTests(client, appState.availableTestFiles);
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
          }
        );

        appState.results.push(fileResult);
      }

      appState.done = true;
    } catch (error) {
      console.warn(error);
    }
  }

  public async stopTests(driver: ChildProcess, client: BrowserObject) {
    if (this.props.appState.closeAppAtEnd) {
      try {
        // Kill driver and session
        await client.deleteSession();
        await driver.kill();

        // Restore a possible user data backup
        await restore();
      } catch (error) {
        console.warn(error);
      }
    }
  }
}
