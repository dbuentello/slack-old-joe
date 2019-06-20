import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import { SuiteResult, ItTestParams } from './interfaces';



export async function writeReport(
  input: Array<SuiteResult>,
  pathChosen: string, 
  fileName: string
) 
{
  const reportPath = path.join(pathChosen, fileName);
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
  fs.writeFile(reportPath, text);
  return reportPath;
}

/**
 * Append a test-retry to the report. 
 */
export async function appendReport(
  input: ItTestParams, // for now
  fileName: string,
  absPath: string,
  succeeded: boolean
) {  
  if(absPath === "") {
    console.log("Nothing will print");
  } else {
    console.log("🐪ing");
    let text = `\n\n# Slack Old Joe Run ${input.name} (previously failed test)\n`;
    text += `-`.padEnd(50, '-');
    text += `\n\n`;

    text += `Test: ${input.name}\n`;
    text += `Result: ${succeeded ? 'Passed' : 'Did not pass'}\n`;
    text += `\n`;
    fs.appendFile(absPath + "/" + fileName, text);
  }
}