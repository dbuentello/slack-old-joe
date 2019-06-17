import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { SuiteResult } from './interfaces';

const now = new Date().toLocaleTimeString().replace(/:/g, '-').replace(' ', '');

export async function writeReport(input: Array<SuiteResult>, pathChosen: string) {
  const reportPath = path.join(pathChosen, `${now}.txt`);
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
  return fs.writeFile(reportPath, text);
}
