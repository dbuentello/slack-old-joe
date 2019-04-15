export interface Options {
  version: string;
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
  beforeAll?: Array<LifeCycleFn>,
  afterAll?: Array<LifeCycleFn>,
  beforeEach?: Array<LifeCycleFn>,
  afterEach?: Array<LifeCycleFn>
}

export type SuiteMethod = (client: BrowserObject, methods: SuiteMethods) => Promise<void> | void;
