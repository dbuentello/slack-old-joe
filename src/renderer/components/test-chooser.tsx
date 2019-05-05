import { observer } from 'mobx-react';
import * as React from 'react';
import { Card, Elevation, Checkbox, Button } from '@blueprintjs/core';

import { AppState } from '../state';
import { handleBooleanChange } from '../../utils/handle-boolean-change';
import { TestFile } from '../../interfaces';
import { isSignInDisabled } from '../../utils/is-sign-in-disabled';

interface TestChooserProps {
  appState: AppState;
}

@observer
export class TestChooser extends React.Component<TestChooserProps, {}> {
  constructor(props: TestChooserProps) {
    super(props);

    this.renderTest = this.renderTest.bind(this);
  }

  public render() {
    const { appState } = this.props;
    const tests = appState.availableTestFiles.map(this.renderTest);

    return (
      <Card elevation={Elevation.ONE} className="test-chooser-card">
        <h3>
          Test Suites
          {this.renderNoneAllButton()}
        </h3>
        {tests}
      </Card>
    );
  }

  public renderNoneAllButton() {
    const { appState } = this.props;
    const allDisabled = appState.availableTestFiles.every(t => !!t.disabled);

    return (
      <div style={{ float: 'right' }}>
        <Button
          text={allDisabled ? 'All' : 'None'}
          icon={allDisabled ? 'circle' : 'selection'}
          small={true}
          onClick={() =>
            appState.availableTestFiles.forEach(
              t => (t.disabled = !allDisabled)
            )
          }
        />
      </div>
    );
  }

  public renderTest(input: TestFile) {
    const { appState } = this.props;
    let onChange = handleBooleanChange(update => (input.disabled = !update));

    let checked = !input.disabled;
    let label = input.name;

    // Signing out will destroy the cookie forever,
    // so we can't use the packaged one.
    if (input.name === 'Sign out' && isSignInDisabled(appState)) {
      label = 'Sign out (Only available with Sign in)';
      checked = false;
      onChange = handleBooleanChange(update => {
        input.disabled = !update;
        appState.availableTestFiles;
      });
    }

    return (
      <Checkbox
        key={input.name}
        checked={checked}
        label={label}
        onChange={onChange}
      />
    );
  }
}
