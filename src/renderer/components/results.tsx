import * as React from 'react';
import useStayScrolled from 'react-stay-scrolled';
import { Card, Elevation, Icon, Button } from '@blueprintjs/core';

import { SuiteResult, Result, TestSuite, ItTestParams } from '../../interfaces';
import { chooseFolder } from './path-chooser';
import { runTest } from '../runner';
import { appendReport, writeReport, writeToFile } from '../../report';
import { appState } from '../state';
import { observer } from 'mobx-react';
import { getFailedTests } from '../../utils/get-failed-tests';

export interface ResultsProps {
  results: Array<SuiteResult>;
  done: boolean;
  testsDone: TestSuite[];
  slackClosed: boolean;
}

@observer
export class Results extends React.Component<ResultsProps, {}> {
  constructor(props: ResultsProps) {
    super(props);

    this.renderIndividualResult = this.renderIndividualResult.bind(this);
  }

  public render() {
    const listRef = React.useRef();
    const { stayScrolled } = useStayScrolled(listRef);
    const resultElements = this.renderResultElements();
    const doneElements = this.renderDoneElements();
    // Typically you will want to use stayScrolled or scrollBottom inside
    // useLayoutEffect, because it measures and changes DOM attributes (scrollTop) directly
    React.useLayoutEffect(() => {
      stayScrolled();
    }, [this.props.results.length]);

    return (
      <Card elevation={Elevation.ONE} className="result-card">
        {doneElements}
        <div ref={listRef as any}>{resultElements}</div>
      </Card>
    );
  }

  private renderResultElements() {
    return this.props.results.length > 0
      ? this.props.results.map(this.renderIndividualResult)
      : [
          this.props.done ? (
            <h5 key="did-not-run">Didn't run any tests, huh? You rascal!</h5>
          ) : null
        ];
  }

  private renderDoneElements() {
    return this.props.done ? (
      <Button
        text="Save Report"
        onClick={() => {
          writeReport(appState.results);
          chooseFolder();
          writeToFile();
        }}
      ></Button>
    ) : (
      <Button text="Waiting for tests to finish...." disabled={true}></Button>
    );
  }

  private renderIndividualResult({
    name: suiteName,
    results
  }: SuiteResult): Array<JSX.Element> {
    const { testsDone, slackClosed } = this.props;
    const noErrorSuite = <h5 key={suiteName}>{suiteName}</h5>;
    const suiteWithError = (
      <h5 key={suiteName}>
        {suiteName}{' '}
        <a style={{ color: '#D8000C' }}>
          <u
            onClick={() => {
              retrySuite(testsDone, suiteName, results);
            }}
          >
            try again?
          </u>
        </a>
      </h5>
    );
    const hasError = results.some(({ error }) => !!error);
    const suiteElement = hasError ? suiteWithError : noErrorSuite;
    return [
      suiteElement,
      ...results.map(result => {
        const { error, name } = result;
        const errorTextElement = error ? <pre>{error.toString()}</pre> : null;
        const retryElem = error ? (
          <Button
            className="bp3-button bp3-intent-primary"
            icon="outdated"
            id={name}
            disabled={appState.testRunning}
            intent="warning"
            onClick={() => {
              appState.testRunning = true;
              retryTest(name, suiteName, testsDone);
            }} // using a 'closure'
            title="Retry test"
            text={appState.testRunning ? 'Running...' : `Retry`}
          ></Button>
        ) : null;
        const errorElement = error ? <pre>{error.toString()}</pre> : null;
        return (
          <div className="result" key={result.name}>
            <p>
              {this.getIcon(result)} {name}
            </p>
            {retryElem}
            {errorElement}
          </div>
        );
      })
    ];

    function retrySuite(
      testsDone: TestSuite[],
      suiteName: string,
      results: Result[]
    ) {
      const foundSuiteMethodResults = testsDone.find(
        ({ name }) => name === suiteName
      ); // get the suit of tests we want.
      if (foundSuiteMethodResults === undefined) {
        throw new Error('undefined suite.');
      }

      let failedTestNames: string[] = getFailedTests(
        foundSuiteMethodResults,
        results
      );

      const failedTests: ItTestParams[] = findTests(
        failedTestNames,
        suiteName,
        testsDone
      );

      failedTests.forEach(failedTest => {
        runTest(failedTest, (succeeded: boolean) => {
          appendReport(failedTest, succeeded);
          appState.testPassed = succeeded;
        });
      });
    }

    // Retry a test
    function retryTest(
      testName: string,
      suiteName: string,
      testsDone: TestSuite[]
    ) {
      const indTest = findTest(testName, suiteName, testsDone);
      if (indTest) {
        runTest(indTest, (succeeded: boolean) => {
          appendReport(indTest, succeeded);
          appState.testPassed = succeeded;
        });
      } else {
        throw new Error(`Unable to find test ${testName}`);
      }
    }

    function findTest(
      testName: string,
      suiteName: string,
      testsDone: TestSuite[]
    ): ItTestParams | undefined {
      // Find the right suiteMethodResult
      const foundSuiteMethodResults = testsDone
        .filter(({ name }) => name === suiteName)
        .map(({ suiteMethodResults }) => suiteMethodResults)[0];

      // _Should_ never happen
      if (!foundSuiteMethodResults) {
        throw new Error(`Could not find ${suiteName}`);
      }

      // Find the right test
      return foundSuiteMethodResults.it.find(test => test.name === testName);
    }

    // find multiple tests within a suite
    function findTests(
      testNames: string[],
      suiteName: string,
      testsSuitesDone: TestSuite[]
    ): ItTestParams[] {
      // Find the right suiteMethodResult
      const foundSuiteMethodResults = testsSuitesDone
        .filter(({ name }) => name === suiteName)[0].suiteMethodResults.it;
      const itFailedTests:ItTestParams[] = [];
      foundSuiteMethodResults.forEach(
        (test) => testNames.includes(test.name) ? itFailedTests.push(test) : null
      )

      // _Should_ never happen
      if (!foundSuiteMethodResults) {
        throw new Error(`Could not find ${suiteName}`);
      }
      // Find the right test
      return itFailedTests;
    }
  }

  private getIcon({ skipped, ok }: Result): JSX.Element {
    if (skipped) {
      return <Icon icon="moon" htmlTitle="Test skipped (wrong platform)" />;
    }
    if (ok) {
      return <Icon icon="endorsed" htmlTitle="Test passed" />;
    }

    return <Icon icon="error" intent="danger" htmlTitle="Test failed" />;
  }
}
