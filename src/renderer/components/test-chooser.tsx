import { observer } from 'mobx-react';
import * as React from 'react';
import { Card, Elevation, Checkbox, Button } from '@blueprintjs/core';

import { AppState } from '../state';
import { handleBooleanChange } from '../../helpers/handle-boolean-change';
import { TestFile } from '../../interfaces';

interface TestChooserProps {
  appState: AppState;
}

@observer
export class TestChooser extends React.Component<TestChooserProps, {}> {
  constructor(props: TestChooserProps) {
    super(props);
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
            appState.availableTestFiles.forEach(t => (t.disabled = !allDisabled))
          }
        />
      </div>
    )
  }

  public renderTest(input: TestFile) {
    const onChange = handleBooleanChange(
      checked => (input.disabled = !checked)
    );

    return (
      <Checkbox
        key={input.name}
        checked={!input.disabled}
        label={input.name}
        onChange={onChange}
      />
    );
  }
}
