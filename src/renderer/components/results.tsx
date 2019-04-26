import { observer } from 'mobx-react';
import * as React from 'react';
import {
  Card,
  Elevation,
  Icon
} from '@blueprintjs/core';

import { AppState } from '../state';
import { SuiteResult } from '../../interfaces';

interface ResultsProps {
  appState: AppState;
}

@observer
export class Results extends React.Component<ResultsProps, {}> {
  constructor(props: ResultsProps) {
    super(props);
  }

  public render() {
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
}
