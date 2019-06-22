import {
  SuiteMethodResults,
  SuiteMethods,
  TestSuites,
  SuiteResult,
  SuiteMethod,
  TestFile,
  ItTestParams,
  Result,
  LifeCycleFn
} from '../interfaces';
import { AppState, appState } from './state';
import { wait } from '../utils/wait';

const debug = require('debug')('old-joe');

/**
 * Read all test suite files
 *
 * @export
 * @param {Array<TestFile>} testFiles
 * @returns {Promise<TestSuites>}
 */
export async function readTests(
  testFiles: Array<TestFile>
): Promise<TestSuites> {
  const tests: TestSuites = [];

  for (const testFile of testFiles) {
    if (!testFile.disabled) {
      tests.push({
        name: testFile.name,
        suiteMethodResults: await readTestFile(testFile.test)
      });
    }
  }

  return tests;
}

/**
 * Read a test file (or suite), producing an array of all
 * the methods we need to run
 *
 * @export
 * @param {SuiteMethod} test
 * @returns {Promise<SuiteMethodResults>}
 */
export async function readTestFile(
  test: SuiteMethod
): Promise<SuiteMethodResults> {
  const suiteMethodResults: SuiteMethodResults = {
    it: [],
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: []
  };

  const suiteMethods: SuiteMethods = {
    it: (name, fn, options?) =>
      suiteMethodResults.it.push({ name, fn, options }),
    beforeAll: fn => suiteMethodResults.beforeAll.push(fn),
    afterAll: fn => suiteMethodResults.afterAll.push(fn),
    beforeEach: fn => suiteMethodResults.beforeEach.push(fn),
    afterEach: fn => suiteMethodResults.afterAll.push(fn)
  };

  await test(suiteMethods);

  return suiteMethodResults;
}

/**
 * Run a test file (or suite)
 *
 * @export
 * @param {string} file
 * @param {SuiteMethodResults} suiteMethodResults
 * @param {(succeeded: boolean) => void} updateCallback
 * @param {AppState} appState
 * @returns {Promise<SuiteResult>}
 */
export async function runTestFile(
  file: string,
  suiteMethodResults: SuiteMethodResults,
  updateCallback: (succeeded: boolean) => void,
  appState: AppState
): Promise<SuiteResult> {
  const { generateReportAtEnd } = appState;
  const result: SuiteResult = {
    name: file,
    results: []
  };

  console.groupCollapsed(file);

  // Cool down between each suite
  await wait(1500);

  // Run all "beforeAll"
  await runAll(suiteMethodResults.beforeAll, 'beforeAll');

  // Run all tests
  for (const test of suiteMethodResults.it) {
    console.groupCollapsed(test.name);
    // Can we skip this platform?
    if (
      test.options &&
      test.options.platforms &&
      !test.options.platforms.includes(process.platform)
    ) {
      result.results.push({ name: test.name, ok: true, skipped: true });

      continue;
    }

    // Run all "beforeEach"
    await runAll(suiteMethodResults.beforeEach, 'beforeEach');

    // Run the test
    debug(`Now running test "${test.name}"`);
    result.results.push(await runTest(test, updateCallback));

    // Run all "afterEach"
    await runAll(suiteMethodResults.afterEach, 'afterEach');
    console.groupEnd();
  }

  // Run all "afterAll"
  await runAll(suiteMethodResults.afterAll, 'afterAll');

  console.groupEnd();

  return result;
}


/**
 * Run a single test, as returned by an it() method
 *
 * @param {ItTestParams} { name, fn }
 * @param {(succeeded: boolean) => void} updateCallback
 * @returns {Promise<Result>}
 */
export async function runTest(
  { name, fn, options }: ItTestParams,
  updateCallback: (succeeded: boolean) => void,
  retries: number = 0
): Promise<Result> {
  const result: Result = { name, ok: false };

  try {
    await fn();

    result.ok = true;
  } catch (error) {
    console.warn(error);

    // Do we retry?
    if (options && options.retries && options.retries > retries) {
      return runTest({ name, fn, options }, updateCallback, retries + 1);
    }

    result.ok = false;
    result.error = error;
  }

  if (options && options.cleanup) {
    try {
      await options.cleanup();
    } catch (error) {
      console.error(`Cleanup for ${name} failed`, error);

      result.ok = false;
      result.error = error;
    }
  }

  updateCallback(result.ok);
  appState.testRunning = false;
  return result;
}

/**
 * Run all the lifecycle methods, but in sequence, not in parallel
 * (hence not using Promise.all)
 *
 * @param {Array<LifeCycleFn>} methods
 * @returns {Promise<void>}
 */
async function runAll(
  methods: Array<LifeCycleFn>,
  phase: string
): Promise<void> {
  console.groupCollapsed(phase);

  for (const method of methods) {
    try {
      await method();
    } catch (error) {
      console.warn(`Failed to run ${method.name} for phase ${phase}`, error);
    }
  }

  console.groupEnd();
}
