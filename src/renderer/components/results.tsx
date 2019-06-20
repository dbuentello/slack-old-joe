import * as React from 'react';
import useStayScrolled from 'react-stay-scrolled';
import { Card, Elevation, Icon, Button } from '@blueprintjs/core';
import { appState } from '../state';

import {
  SuiteResult,
  Result,
  ItTestParams,
  SuiteMethodResults,
  TestSuite
} from '../../interfaces';
import { chooseFolder } from './path-chooser';
import { readTestFile, runTest } from '../runner';
import { startClientDriver, stopClientDriver } from '../client-driver';
import { appendReport, writeReport } from '../../report';
import { write } from 'fs-extra';


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
  slackClosed, 
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

export function retryTest(
  testName: string,
  suiteName: string,
  testsDone: TestSuite[], 
) {
  console.log("Let's hope " + testName + ' works again 😬');
  testsDone.forEach(testSuite => {
    if (testSuite.name === suiteName) {
      testSuite.suiteMethodResults.it.forEach(async indTest => {
        if (testName === indTest.name) {
          console.log('FOUND THE MATCHH☣️️️️️️️️️');
          // run the test!!? K!?!?!?!?!??!
          // await i
          // await startClientDriver(false); // this might depend on the test we're doing.
          console.log("WRITING TOOOOOO: " + appState.absPath);
          runTest(indTest, (succeeded:boolean) => {
            if(appState.absPath === "") {
              console.log("most likely scenario");
              
              let p: string =  appState.reportPath();
              appState.absPath = p;
              writeReport(appState.results, appState.absPath, appState.fileName);
              appendReport(indTest, appState.fileName, appState.absPath, succeeded);
              // p.finally( (result) => {
              //   console.log("PATHHHHH CHOSENNNNNNN: " + (await p) );
              //   appState.absPath = await p;
              //   appState.absPath = await appState.reportPath();
              //   writeReport(appState.results, appState.absPath);
              //   appendReport(indTest, appState.absPath, succeeded);
              // });
            } else {
              console.log("in the event they already wrote the file");
              // const chosenPath = appState.reportPath();
              appendReport(indTest, appState.fileName, appState.absPath, succeeded);
            }
            // succeeded ? console.log('failed again💔') : console.log('it passed now!!💖');
          });
          // await stopClientDriver();
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
  slackClosed: boolean, 
): Array<JSX.Element> => {
  // const showError = <p> {error} </p>
  return [
    <h5 key={suiteResult.name}>{suiteResult.name}</h5>,
    ...suiteResult.results.map(result => {
      const { error, name } = result;
      const errorTextElement = error ? <pre>{error.toString()}</pre> : null;
      const retryElem = (
        <Button
          icon="outdated"
          onClick={async function() {
            await retryTest(name, suiteResult.name, testsDone);
          }} // using a 'closure'
          htmltitle="Retry test"
        ></Button>
      );
      const errorElement = error && !slackClosed ? retryElem : errorTextElement;

      // const text = (

      // );

      // const errorElement = error ? <p>text</p> : null;

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
