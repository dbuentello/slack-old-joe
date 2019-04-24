import {
  SuiteMethodResults,
  SuiteMethods,
  TestSuites,
  SuiteResult,
  SuiteMethod,
  TestFile
} from '../interfaces';
import { takeScreenshot } from '../report';

export async function readTests(
  client: BrowserObject,
  testFiles: Array<TestFile>
): Promise<TestSuites> {
  const tests: TestSuites = [];

  for (const testFile of testFiles) {
    if (!testFile.disabled) {
      tests.push({
        name: testFile.name,
        suiteMethodResults: await readTestFile(testFile.test, client)
      });
    }
  }

  return tests;
}

export async function readTestFile(test: SuiteMethod, client: BrowserObject) {
  const suiteMethodResults: SuiteMethodResults = {
    it: [],
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: []
  };

  const suiteMethods: SuiteMethods = {
    it: (name, fn) => suiteMethodResults.it.push({ name, fn }),
    beforeAll: fn => suiteMethodResults.beforeAll.push(fn),
    afterAll: fn => suiteMethodResults.afterAll.push(fn),
    beforeEach: fn => suiteMethodResults.beforeEach.push(fn),
    afterEach: fn => suiteMethodResults.afterAll.push(fn)
  };

  await test(client, suiteMethods);

  return suiteMethodResults;
}

export async function runTestFile(
  file: string,
  suiteMethodResults: SuiteMethodResults,
  updateCallback: (succeeded: boolean) => void
): Promise<SuiteResult> {
  const result: SuiteResult = {
    name: file,
    results: []
  };

  // Run all "beforeAll"
  for (const beforeAll of suiteMethodResults.beforeAll) {
    await beforeAll();
  }

  // Run all tests
  for (const { fn, name } of suiteMethodResults.it) {
    // Run all "beforeEach"
    for (const beforeEach of suiteMethodResults.beforeEach) {
      await beforeEach();
    }

    // Screenshot
    await takeScreenshot(`before ${name}`);

    // Run the test
    try {
      await fn();

      result.results.push({
        name,
        ok: true
      });

      updateCallback(true);
    } catch (error) {
      result.results.push({
        name,
        ok: false,
        error
      });

      console.warn(error);

      updateCallback(false);
    }

    // Screenshot
    await takeScreenshot(`after ${name}`);

    // Run all "afterEach"
    for (const afterEach of suiteMethodResults.afterEach) {
      await afterEach();
    }
  }

  // Run all "afterAll"
  for (const afterAll of suiteMethodResults.afterAll) {
    await afterAll();
  }

  return result;
}
