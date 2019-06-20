import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { SuiteResult, ItTestParams } from './interfaces';
import { appState } from './renderer/state';

/**
 * Writes the report to memory. This will no longer write to a file and will instead write to the global
 * appState.fileName. 
 * @param input Takes in all the suites and their results
 */
export async function writeReport(
  input: Array<SuiteResult>
) {
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
  // absPath = reportPath;
  appState.report += text;
  return true;
}

/**
 * Append a test-retry to the report.
 */
export async function appendReport(
  input: ItTestParams, // for now
  succeeded: boolean
) {
  console.log("🤪");
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
  fs.writeFile(reportPath, appState.report);
}