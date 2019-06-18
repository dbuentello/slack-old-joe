import * as React from 'react';
import useStayScrolled from 'react-stay-scrolled';
import { Card, Elevation, Icon, Button } from '@blueprintjs/core';

import { SuiteResult, Result } from '../../interfaces';
import { chooseFolder } from './path-chooser'; // new addition

interface ResultsProps {
  results: Array<SuiteResult>;
  done: boolean;
}

export const Results = ({ results, done }: ResultsProps) => {
  const listRef = React.useRef();
  const { stayScrolled } = useStayScrolled(listRef);

  const resultElements =
    results.length > 0
      ? results.map(renderIndividualResult)
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

const renderIndividualResult = (
  suiteResult: SuiteResult
): Array<JSX.Element> => {
  return [
    <h5 key={suiteResult.name}>{suiteResult.name}</h5>,
    ...suiteResult.results.map(result => {
      const { error, name } = result;
      const errorElement = error ? <pre>{error.toString()}</pre> : null;

      return (
        <div className="result" key={result.name}>
          <p>
            {getIcon(result)} {name}
          </p>
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
