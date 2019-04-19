
import { observer } from 'mobx-react';
import * as React from 'react';
import { Card, Elevation, Checkbox } from '@blueprintjs/core';

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
      <Card elevation={Elevation.ONE} className='test-chooser-card'>
        <h3>Test Suites</h3>
        {tests}
      </Card>
    );
  }

  public renderTest(input: TestFile) {
    const onChange = handleBooleanChange((checked) => (input.disabled = !checked));

    return (
      <Checkbox
        checked={!input.disabled}
        label={input.name}
        onChange={onChange}
      />
    )
  }
}
