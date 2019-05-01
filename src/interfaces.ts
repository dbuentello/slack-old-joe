import { ChildProcess } from 'child_process';

export type LifeCycleFn = () => Promise<void> | void;
export type TestFn = () => Promise<void> | void;

export interface SuiteMethods {
  it: (
    name: string,
    fn: TestFn,
    onlyOnPlatforms?: Array<NodeJS.Platform>
  ) => void;
  beforeAll: (fn: LifeCycleFn) => void;
  afterAll: (fn: LifeCycleFn) => void;
  beforeEach: (fn: LifeCycleFn) => void;
  afterEach: (fn: LifeCycleFn) => void;
}

export interface ItTestParams {
  name: string;
  fn: TestFn;
  platforms?: Array<NodeJS.Platform>;
}

export interface SuiteMethodResults {
  it: Array<ItTestParams>;
  beforeAll: Array<LifeCycleFn>;
  afterAll: Array<LifeCycleFn>;
  beforeEach: Array<LifeCycleFn>;
  afterEach: Array<LifeCycleFn>;
}

export interface TestFile {
  name: string;
  test: SuiteMethod;
  disabled?: boolean;
}

export interface TestSuite {
  name: string;
  suiteMethodResults: SuiteMethodResults;
  disabled?: boolean;
}

export type TestSuites = Array<TestSuite>;

export type Result = {
  ok: boolean;
  name: string;
  error?: string | Error;
  skipped?: boolean;
};

export type Results = Array<Result>;

export type SuiteMethod = (methods: SuiteMethods) => Promise<void> | void;

export interface SuiteResult {
  name: string;
  results: Results;
}

export type WIOJoeBrowserObject = WebDriver.ClientOptions &
  WebDriver.ClientAsync &
  WebdriverIOAsync.Browser;

export interface JoeBrowserObject extends BrowserObject {
  restart: () => Promise<void>;
  stop: () => Promise<void>;
}

export interface Driver extends ChildProcess {
  restart: () => Promise<void>
}
