import * as path from 'path';
import * as fs from 'fs-extra';
import { SuiteResult, ItTestParams } from './interfaces';
import { appState } from './renderer/state';

/**
 * Writes the report to memory. This will no longer write to a file and will instead write to the global
 * appState.fileName.
 * @param input Takes in all the suites and their results
 */
export async function writeReport(input: Array<SuiteResult>) {
  let text = `# Slack Old Joe Run ${new Date().toLocaleString()}\n`;
  text += `-`.padEnd(50, '-');
  text += `\n\n`;

  for (const { name, results } of input) {
    text += `\n\n## Suite: ${name}\n`;

    for (const result of results) {
      text += `Test: ${result.name}\n`;
      text += `Result: ${result.ok ? 'Passed' : 'Did not pass'}\n`;

      if (result.error) {
        text += `Error:\n`;
        text += result.error
          .toString()
          .split('\n')
          .map(line => ` > ${line}`)
          .join('\n');
      }

      text += `\n`;
    }
  }
  appState.report += text;
  return true;
}

export async function writeJSONReport(input: Array<SuiteResult>) {
  input.forEach( (currSuiteResult) => {
    // append to the end of the list. 
    appState.reportJSON.push(currSuiteResult)
  })
}

/**
 * Append a test-retry to the report.
 */
export async function appendReport(
  input: ItTestParams, // for now
  succeeded: boolean
) {
  let text = `\n\n# Slack Old Joe Run ${input.name} (previously failed test)\n`;
  text += `-`.padEnd(50, '-');
  text += `\n\n`;

  text += `Test: ${input.name}\n`;
  text += `Result: ${succeeded ? 'Passed' : 'Did not pass'}\n`;
  text += `\n`;

  appState.report += text;
}

export function writeToFile() {
  const reportPath = path.join(appState.absPath, appState.fileName);
  return fs.writeFile(reportPath, appState.report);
}

export function writeJSONtoFile() {
  const reportPath = path.join(appState.absPathJSON, appState.JSONfileName);
  console.log('saving reportPath at: ', reportPath);

  const JSONreport = JSON.stringify(appState.reportJSON);
  // createPage(JSONreport);
  return fs.writeFile(reportPath, JSONreport);
}

