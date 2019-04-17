import { observable } from 'mobx';
import { Tests, SuiteResult } from '../interfaces';
import { getSlackPath } from '../helpers/get-slack-path';

/**
 * The application's state. Exported as a singleton below.
 *
 * @export
 * @class AppState
 */
export class AppState {
  @observable public progress = 0;
  @observable public tests: Tests = [];
  @observable public results: Array<SuiteResult> = [];
  @observable public appToTest: string;

  @observable public testsTotal: number = 0;
  @observable public testsDone: number = 0;
  @observable public testsFailed: number = 0;
  @observable public done: boolean = false;

  constructor() {
    this.setup();
  }

  public async setup() {
    this.appToTest = await getSlackPath();
  }
}

export const appState = new AppState();
