import * as React from 'react';
import useStayScrolled from 'react-stay-scrolled';
import { Card, Elevation, Icon, Button } from '@blueprintjs/core';

import { SuiteResult, Result, TestSuite, ItTestParams } from '../../interfaces';
import { chooseFolder } from './path-chooser';
import { runTest } from '../runner';
import { appendReport, writeReport, writeToFile } from '../../report';
import { appState } from '../state';
import { observer } from 'mobx-react';

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

  private renderIndividualResult(suiteResult: SuiteResult): Array<JSX.Element> {
    const { testsDone, slackClosed } = this.props;
    return [
      <h5 key={suiteResult.name}>{suiteResult.name}</h5>,
      ...suiteResult.results.map(result => {
        const { error, name } = result;
        const errorTextElement = error ? <pre>{error.toString()}</pre> : null;
        const retryElem = (
          <Button
            className="bp3-button bp3-intent-primary"
            icon="outdated"
            id={name}
            disabled={appState.testRunning}
            intent="warning"
            onClick={() => {
              appState.testRunning = true;
              retryTest(name, suiteResult.name, testsDone);
            }} // using a 'closure'
            title="Retry test"
            text={appState.testRunning ? 'Running...' : `Retry`}
          ></Button>
        );
        const errorElement =
          error && !slackClosed ? retryElem : errorTextElement;
        return (
          <div className="result" key={result.name}>
            <p>
              {this.getIcon(result)} {name}
            </p>
            {errorTextElement}
            {errorElement}
          </div>
        );
      })
    ];

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
