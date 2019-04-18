import { observable } from 'mobx';
import { TestFiles, SuiteResult } from '../interfaces';
import { getSlackPath } from '../helpers/get-slack-path';

/**
 * The application's state. Exported as a singleton below.
 *
 * @export
 * @class AppState
 */
export class AppState {
  @observable public progress = 0;
  @observable public tests: TestFiles = [];
  @observable public results: Array<SuiteResult> = [];
  @observable public appToTest: string;

  // Test results
  @observable public testsTotal: number = 0;
  @observable public testsDone: number = 0;
  @observable public testsFailed: number = 0;
  @observable public done: boolean = false;

  // Configuration
  @observable public logoutAndCloseApp: boolean = true;

  constructor() {
    this.setup();
  }

  public async setup() {
    this.appToTest = await getSlackPath();
  }
}

export const appState = new AppState();
