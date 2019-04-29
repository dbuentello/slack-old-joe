import { observer } from 'mobx-react';
import * as React from 'react';
import { Card, Elevation, Icon } from '@blueprintjs/core';

import { AppState } from '../state';
import { SuiteResult, Result } from '../../interfaces';

interface ResultsProps {
  appState: AppState;
}

@observer
export class Results extends React.Component<ResultsProps, {}> {
  constructor(props: ResultsProps) {
    super(props);
  }

  public render() {
    const { results, done } = this.props.appState;
    const resultElements =
      results.length > 0
        ? results.map(this.renderResult)
        : [
            done ? (
              <h5>Didn't run any tests, huh? You rascal!</h5>
            ) : (
              <h5>Waiting for test results...</h5>
            )
          ];

    // Warning: In CSS, we'll reverse this list!
    return (
      <Card elevation={Elevation.ONE} className="result-card">
        {resultElements}
      </Card>
    );
  }

  public renderResult(suiteResult: SuiteResult): Array<JSX.Element> {
    return [
      <h5>{suiteResult.name}</h5>,
      ...suiteResult.results.map(result => {
        const { error, name } = result;
        const errorElement = error ? <pre>{error.toString()}</pre> : null;

        return (
          <div className="result">
            <p>
              {this.getIcon(result)} {name}
            </p>
            {errorElement}
          </div>
        );
      })
    ].reverse();
  }

  private getIcon({ skipped, ok }: Result) {
    if (skipped) {
      return <Icon icon="moon" />;
    }

    if (ok) {
      return <Icon icon="endorsed" />;
    }

    return <Icon icon="error" intent="danger" />;
  }
}
