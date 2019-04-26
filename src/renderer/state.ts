import { observable } from 'mobx';
import { TestSuites, SuiteResult, TestFile } from '../interfaces';
import { getSlackPath } from '../helpers/get-slack-path';
import { SMOKE_TESTS } from '../smoke';

/**
 * The application's state. Exported as a singleton below.
 *
 * @export
 * @class AppState
 */
export class AppState {
  @observable public progress = 0;
  @observable public availableTestFiles: Array<TestFile> = SMOKE_TESTS;
  @observable public tests: TestSuites = [];
  @observable public results: Array<SuiteResult> = [];
  @observable public appToTest: string;

  // Test results
  @observable public testsTotal: number = 0;
  @observable public testsDone: number = 0;
  @observable public testsFailed: number = 0;
  @observable public done: boolean = false;

  // Configuration
  @observable public closeAppAtEnd: boolean = true;
  @observable public generateReportAtEnd: boolean = false;
  @observable public disabledTests: Array<string> = [];

  constructor() {
    this.setup();
  }

  public async setup() {
    this.appToTest = await getSlackPath();
  }
}

export const appState = new AppState();
