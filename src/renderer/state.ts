import { observable, autorun } from 'mobx';
import { TestSuites, SuiteResult, TestFile } from '../interfaces';
import { getSlackPath } from '../helpers/get-slack-path';
import { SMOKE_TESTS } from '../smoke';
import { chooseFolder, chooseFolderAsString } from './components/path-chooser';

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
  @observable public closeAppAtEnd: boolean = false;
  @observable public generateReportAtEnd: boolean = true;
  @observable public disabledTests: Array<string> = [];

  // Persisted
  @observable public expectedLaunchTime: string =
    this.retrieve('expectedLaunchTime') || '5000';

  // Start parameters
  @observable public startingIn: number = 0;
  @observable public hasStarted: boolean = false;
  @observable public hasCountdownStarted: boolean = false;

  // Report so far used to modify after test retry
  @observable public reportPath: Function = chooseFolderAsString;
  @observable public absPath: string = '';
  @observable public fileName: string = new Date()
  .toLocaleTimeString()
  .replace(/:/g, '-')
  .replace(' ', '') + '.txt';

  constructor() {
    this.setup();

    autorun(() => this.save('expectedLaunchTime', this.expectedLaunchTime));
  }

  public async setup() {
    this.appToTest = await getSlackPath();
  }

  /**
   * Save a key/value to localStorage.
   *
   * @param {string} key
   * @param {(string | number | object)} [value]
   */
  private save(key: string, value?: string | number | object | null | boolean) {
    if (value) {
      const _value =
        typeof value === 'object' ? JSON.stringify(value) : value.toString();

      localStorage.setItem(key, _value);
    } else {
      localStorage.removeItem(key);
    }
  }

  /**
   * Fetch data from localStorage.
   *
   * @template T
   * @param {string} key
   * @returns {(T | string | null)}
   */
  private retrieve<T>(key: string): T {
    const value = localStorage.getItem(key);

    return JSON.parse(value || 'null') as T;
  }
}

export const appState = new AppState();
