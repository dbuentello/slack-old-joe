import * as React from 'react';
import useStayScrolled from 'react-stay-scrolled';
import { Card, Elevation, Icon, Button, Popover, PopoverInteractionKind, Classes, Position } from '@blueprintjs/core';
// import { PopoverHeader, PopoverBody } from 'reactstrap'
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

interface ResultsProps {
  results: Array<SuiteResult>;
  done: boolean;
  testsDone: TestSuite[];
  slackClosed: boolean;
  currPath: string;
}

export const Results = ({
  results,
  done,
  testsDone,
  slackClosed
}: ResultsProps) => {
  const listRef = React.useRef();
  const { stayScrolled } = useStayScrolled(listRef);
  const resultElements =
    results.length > 0
      ? results.map(suiteResult =>
          renderIndividualResult(suiteResult, testsDone, slackClosed)
        ) // pass in testsDone
      : [
          done ? (
            <h5 key="did-not-run">Didn't run any tests, huh? You rascal!</h5>
          ) : null
        ];

  const doneElements = done ? (
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
  }, [results.length]);

  return (
    <Card elevation={Elevation.ONE} className="result-card">
      {doneElements}
      <div ref={listRef as any}>{resultElements}</div>
    </Card>
  );
};

export function retryTest(
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
          });
        }
      });
    }
  });
}

/**
 * If there is an error, lets pass in the suiteName and name
 * @param suiteResult result of tests.
 * @param testsDone list of tests for all suites
 */
const renderIndividualResult = (
  suiteResult: SuiteResult,
  testsDone: TestSuite[],
  slackClosed: boolean
): Array<JSX.Element> => {
let popOverContent = (<div>
  <h5>Popover Title</h5>
      <p>...</p>
  <Button className="bp3-button bp3-popover-dismiss" title="Close popover"> ⏱⏱⏱⏱⏱⏱⏱⏱⏱</Button>
</div>);

  return [
    <h5 key={suiteResult.name}>{suiteResult.name}</h5>,
    ...suiteResult.results.map(result => {
      const { error, name } = result;
      const errorTextElement = error ? <pre>{error.toString()}</pre> : null;
      const retryElem = (
        // <div className={Classes.POPOVER_DISMISS}>
        <Popover
          content={popOverContent}
          isOpen={appState.testRunning}
          position={Position.RIGHT}
          interactionKind={PopoverInteractionKind.CLICK}
          onInteraction={() => {appState.testRunning = true; console.log(`TESTRUNNING: ${appState.testRunning}`)}}
        >
            <Button
              className="bp3-button bp3-intent-primary"
              icon="outdated"
              id={name}
              onClick={function() {
                // appState.testRunning = true;
                retryTest(name, suiteResult.name, testsDone);
                // appState.testRunning = false;
              }} // using a 'closure'
              title="Retry test"
              text="Retry"
            >
            </Button>
        </Popover>
        // </div>
      );
      // </div>
      const errorElement = error && !slackClosed ? retryElem : errorTextElement;
      return (
        <div className="result" key={result.name}>
          <p>
            {getIcon(result)} {name}
          </p>
          {errorTextElement}
          {errorElement}
        </div>
      );
    })
  ];
};

function getIcon({ skipped, ok }: Result): JSX.Element {
  if (skipped) {
    return <Icon icon="moon" htmlTitle="Test skipped (wrong platform)" />;
  }

  if (ok) {
    return <Icon icon="endorsed" htmlTitle="Test passed" />;
  }

  return <Icon icon="error" intent="danger" htmlTitle="Test failed" />;
}
