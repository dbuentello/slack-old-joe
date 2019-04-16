import { observable } from 'mobx';
import { Tests, SuiteResult } from '../interfaces';

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
  @observable public appVersion: string = '3.4.1-betaaa231d3';

  @observable public testsTotal: number = 0;
  @observable public testsDone: number = 0;
  @observable public testsFailed: number = 0;
  @observable public done: boolean = false;
}

export const appState = new AppState();
