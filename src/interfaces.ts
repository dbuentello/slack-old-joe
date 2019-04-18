export interface Options {
  binary: string;
}

export type LifeCycleFn = () => Promise<void> | void;
export type TestFn = () => Promise<void> | void;

export interface SuiteMethods {
  it: (name: string, fn: TestFn) => void,
  beforeAll: (fn: LifeCycleFn) => void,
  afterAll: (fn: LifeCycleFn) => void,
  beforeEach: (fn: LifeCycleFn) => void,
  afterEach: (fn: LifeCycleFn) => void
}

export interface SuiteMethodResults {
  it: Array<{ name: string, fn: TestFn }>,
  beforeAll: Array<LifeCycleFn>,
  afterAll: Array<LifeCycleFn>,
  beforeEach: Array<LifeCycleFn>,
  afterEach: Array<LifeCycleFn>
}

export interface TestFile {
  file: string;
  suiteMethodResults: SuiteMethodResults;
}

export type TestFiles = Array<TestFile>;

export type Result = {
  ok: boolean;
  name: string;
  error?: string | Error;
}

export type Results = Array<Result>;

export type SuiteMethod = (client: BrowserObject, methods: SuiteMethods) => Promise<void> | void;

export interface SuiteResult {
  name: string;
  results: Results;
}

export type BrowserObject = WebDriver.ClientOptions & WebDriver.ClientAsync & WebdriverIOAsync.Browser;
