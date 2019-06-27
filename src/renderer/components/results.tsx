import * as React from 'react';
import useStayScrolled from 'react-stay-scrolled';
import { Card, Elevation, Icon, Button } from '@blueprintjs/core';
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
import { appendReport, writeReport } from '../../report';
import { appState } from '../state';

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
    <Button text="Save Report" onClick={chooseFolder}></Button>
  ) : (
    <Button
      text="Waiting for tests to finish...."
      onClick={chooseFolder}
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

export function retrySuite(
  testsDone: TestSuite[],
  suiteName: string,
  results: Result[]
) {
  const foundSuiteMethodResults = testsDone.filter(({name}) => {name === suiteName})[0]; // get the suit of tests we want. 
  const failedSuiteTests = results.filter(({error}) => {error}) // get the tests with an error in them. 
  foundSuiteMethodResults.suiteMethodResults.it.filter((test) => {}); // get the tests with an error from the suit we found. 
  foundSuiteMethodResults.suiteMethodResults.it.forEach(async indTest => {
    if(failedSuiteTests.some((result) => {result.name === indTest.name})) {
      runTest(indTest, (succeeded:boolean) => {
        appendReport(indTest, succeeded);
        appState.testPassed = succeeded;
      })
    }
  });
}

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
            if (appState.absPath === '') {
              let p: string = appState.reportPath();
              appState.absPath = p;
              writeReport(
                appState.results,
                appState.absPath,
                appState.fileName
              );
              appendReport(
                indTest,
                appState.fileName,
                appState.absPath,
                succeeded
              );
            } else {
              appendReport(
                indTest,
                appState.fileName,
                appState.absPath,
                succeeded
              );
            }
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
  { name: suiteName, results }: SuiteResult,
  testsDone: TestSuite[],
  slackClosed: boolean
): Array<JSX.Element> => {
  const noErrorSuite = <h5 key={suiteName}>{suiteName}</h5>;
  const suiteWithError = <h5 key={suiteName}>{suiteName} <a style={{"color":"#D8000C"}}><u onClick={() => {retrySuite(testsDone, suiteName, results)} }>try again?</u></a></h5> 
  const hasError = results.some(({ error }) => !!error);

  if (!!hasError) {
    console.log(`${suiteName} has an error.`, results);
  } else {
    console.log(`${suiteName} has no error`, results);
  }
  const suiteElement = hasError ? suiteWithError : noErrorSuite;

  return [
    suiteElement,
    ...results.map(result => {
      const { error, name } = result;
      const retryElem = error ? (
        <div>
          <Button
            icon="outdated"
            onClick={async function() {
              await retryTest(name, suiteName, testsDone);
            }} // using a 'closure'
            title="Retry test"
          ></Button>
        </div>
      ) : null;
      const errorElement = error ? (<pre>{error.toString()}</pre>) : null;
      return (
        <div className="result" key={result.name}>
          <p>
            {getIcon(result)} {name}
          </p>
          {retryElem}
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
