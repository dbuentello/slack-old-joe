import { observer } from 'mobx-react';
import * as React from 'react';
import * as os from 'os';
import * as path from 'path';
import { remote } from 'electron';
import {
  Card,
  Elevation,
  InputGroup,
  Button,
  FormGroup,
  Checkbox
} from '@blueprintjs/core';

import { AppState } from '../state';
import { getBinaryPath } from '../../helpers/get-slack-path';
import { DRIVER_VERSION } from '../driver';
import { handleBooleanChange } from '../../helpers/handle-boolean-change';
import { TestChooser } from './test-chooser';

const HOME_DIR = os.homedir();

interface SetupProps {
  appState: AppState;
}

@observer
export class Setup extends React.Component<SetupProps, {}> {
  constructor(props: SetupProps) {
    super(props);

    this.chooseFile = this.chooseFile.bind(this);
    this.closeAtEndChange = this.closeAtEndChange.bind(this);
    this.generateReportChange = this.generateReportChange.bind(this);
  }

  public render() {
    const { appState } = this.props;
    const chooseButton = <Button text="Choose" onClick={this.chooseFile} />;
    const appToTest = appState.appToTest
      ? appState.appToTest.replace(HOME_DIR, '~')
      : '';

    return (
      <>
        <Card elevation={Elevation.ONE} className="setup-card">
          <h3>Old Joe</h3>
          <ul>
            <li>
              Make sure your browser is signed into <code>old-joe</code> and{' '}
              <code>old-joe-2</code>.
            </li>
            <li>Close Slack, if running.</li>
            <li>
              Ensure that you're running a version of Old Joe that matches the
              Slack app's Electron version. It should be v{DRIVER_VERSION}.x.
            </li>
            <li>
              Use a Wi-Fi connection.
            </li>
            <li>Close all apps that might send notifications.</li>
          </ul>
          <FormGroup label="Slack App to test" labelInfo="(required)">
            <InputGroup
              disabled={true}
              leftIcon="application"
              value={appToTest}
              rightElement={chooseButton}
            />
          </FormGroup>
          <Checkbox
            checked={appState.closeAppAtEnd}
            label="Close Slack at end of test"
            onChange={this.closeAtEndChange}
          />
          <Checkbox
            checked={appState.generateReportAtEnd}
            label="Generate a report with screenshots"
            onChange={this.generateReportChange}
          />
        </Card>
        <TestChooser appState={appState} />
      </>
    );
  }

  public closeAtEndChange = handleBooleanChange(checked => {
    this.props.appState.closeAppAtEnd = checked;
  });

  public generateReportChange = handleBooleanChange(checked => {
    this.props.appState.generateReportAtEnd = checked;
  });

  public async chooseFile() {
    const currentWindow = remote.BrowserWindow.getAllWindows()[0];
    const { appState } = this.props;

    remote.dialog.showOpenDialog(
      currentWindow,
      {
        title: 'Choose Slack app to test',
        properties: ['openFile'],
        defaultPath: path.dirname(appState.appToTest)
      },
      filePaths => {
        if (filePaths[0]) {
          appState.appToTest = getBinaryPath(filePaths[0]);
        }
      }
    );
  }
}
