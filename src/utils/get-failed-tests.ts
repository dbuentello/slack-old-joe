import { TestSuite, Result } from '../interfaces';

// Returns tests that have failed within the test suite.
export function getFailedTests(suite: TestSuite, results: Result[]) {
  let testNames: string[] = []; // contains all the test name strings
  // foundSuiteMethodResults
  suite.suiteMethodResults.it.forEach(({ name }) => {
    const result = results.find(({ name: rName }) => rName === name);

    if (result && result.error) {
      testNames.push(name);
    }
  });
  return testNames;
}
