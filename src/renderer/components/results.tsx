import * as React from 'react';
import useStayScrolled from 'react-stay-scrolled';
import { Card, Elevation, Icon, Button, Popover, PopoverInteractionKind, Classes, Position } from '@blueprintjs/core';
import { write } from 'fs-extra';

import {
  SuiteResult,
  Result,
  ItTestParams,
  SuiteMethodResults,
  TestSuite
} from '../../interfaces';
import { chooseFolder } from './path-chooser';
import { runTest } from '../runner';
import { appendReport, writeReport, writeToFile } from '../../report';
import { appState } from '../state';
import { app } from 'electron';
import { observer } from 'mobx-react';

export interface ResultsProps {
  results: Array<SuiteResult>;
  done: boolean;
  testsDone: TestSuite[];
  slackClosed: boolean;
}

@observer
export class Results extends React.Component<ResultsProps, {}> {
  props: ResultsProps;

  constructor(props: ResultsProps) {
    super(props);
    this.props = props;
  }

  public render() {
    const listRef = React.useRef();
    const { stayScrolled } = useStayScrolled(listRef);
    const resultElements =
      this.props.results.length > 0
        ? this.props.results.map((suiteResult: SuiteResult) =>
            this.renderIndividualResult(suiteResult, this.props.testsDone, this.props.slackClosed)
          ) // pass in testsDone
        : [
            this.props.done ? (
              <h5 key="did-not-run">Didn't run any tests, huh? You rascal!</h5>
            ) : null
          ];

    const doneElements = this.props.done ? (
      <Button text="Save Report" onClick={ () => {writeReport(appState.results); chooseFolder(); writeToFile()}}></Button>
    ) : (
      <Button
        text="Waiting for tests to finish...."
        onClick={()=>{null} }
      ></Button>
    );
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
  
  private renderIndividualResult(
    suiteResult: SuiteResult,
      testsDone: TestSuite[],
      slackClosed: boolean
    ): Array<JSX.Element> {
    let popOverContent = (
    <div className={Classes.POPOVER_DISMISS}>
      <h5>Please wait for test to finish.</h5>
      <p>...</p>
      <Button className="bp3-button bp3-popover-dismiss" small alignText="center">Close popover</Button>
    </div>);

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
                onClick={function() {
                  appState.testRunning = true;
                  retryTest(name, suiteResult.name, testsDone);
                }} // using a 'closure'
                title="Retry test"
                text={(appState.testRunning)? "Running...": `Retry`}
              >
              </Button>
          // </Popover>
          // </div>
        );
        // </div>
        const errorElement = error && !slackClosed ? retryElem : errorTextElement;
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
      testsDone.forEach(testSuite => {
        if (testSuite.name === suiteName) {
          testSuite.suiteMethodResults.it.forEach(async indTest => {
            if (testName === indTest.name) {
              runTest(indTest, (succeeded: boolean) => {
                appendReport(indTest, succeeded);
                appState.testPassed = succeeded;
              });
            }
          });
        }
      });
    };

};

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
