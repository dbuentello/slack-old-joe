import * as path from 'path';
import * as fs from 'fs-extra';

import { SuiteMethodResults, SuiteMethods } from './interfaces';
import { takeScreenshot } from './helpers/screenshot';

export async function runTests(client: BrowserObject) {
  const smokeTestFiles = await fs.readdir('./src/smoke');
  let result = '';

  for (const testFile of smokeTestFiles) {
    result += await runTestFile(testFile, client);
  }

  return result;
}

async function runTestFile(file: string, client: BrowserObject): Promise<string> {
  const { test } = await import(`./smoke/${file}`);
  const suiteMethodResults: SuiteMethodResults = {
    it: [],
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: []
  }

  const suiteMethods: SuiteMethods = {
    it: (name, fn) => suiteMethodResults.it.push({ name, fn }),
    beforeAll: (fn) => suiteMethodResults.beforeAll.push(fn),
    afterAll: (fn) => suiteMethodResults.afterAll.push(fn),
    beforeEach: (fn) => suiteMethodResults.beforeEach.push(fn),
    afterEach: (fn) => suiteMethodResults.afterAll.push(fn),
  }

  let result = `\n` + `Suite: ${file} `.padEnd(50, '-');

  await test(client, suiteMethods);

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

      result += `\nok: it ${name}`;
    } catch (error) {
      console.warn(error);

      result += `\nnot ok: it ${name}`;
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

  result += `\n`;
  result += ``.padEnd(50, '-') + `\n`;

  return result;
}
