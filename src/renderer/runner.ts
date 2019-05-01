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
import { takeScreenshot } from '../report';
import { AppState } from './state';

const debug = require('debug')('old-joe');

/**
 * Read all test files (or suites)
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
    it: (name, fn, platforms?) =>
      suiteMethodResults.it.push({ name, fn, platforms }),
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

  // Run all "beforeAll"
  await runAll(suiteMethodResults.beforeAll, 'beforeAll');

  // Run all tests
  for (const test of suiteMethodResults.it) {
    console.groupCollapsed(test.name);
    // Can we skip this platform?
    if (test.platforms && !test.platforms.includes(process.platform)) {
      result.results.push({ name: test.name, ok: true, skipped: true });

      continue;
    }

    // Run all "beforeEach"
    await runAll(suiteMethodResults.beforeEach, 'beforeEach');

    // Screenshot
    if (generateReportAtEnd) await takeScreenshot(`before ${name}`);

    // Run the test
    debug(`Now running test "${test.name}"`);
    result.results.push(await runTest(test, updateCallback));

    // Screenshot
    if (generateReportAtEnd) await takeScreenshot(`after ${name}`);

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
async function runTest(
  { name, fn }: ItTestParams,
  updateCallback: (succeeded: boolean) => void
): Promise<Result> {
  const result: Result = { name, ok: false };

  try {
    await fn();

    result.ok = true;
  } catch (error) {
    result.ok = false;
    result.error = error;

    console.warn(error);
  }

  updateCallback(result.ok);
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
