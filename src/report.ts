import * as path from 'path';
import * as fs from 'fs-extra';
import { SuiteResult, ItTestParams } from './interfaces';
import { appState } from './renderer/state';
import { execSync } from 'child_process';


/**
 * This will create a reportJSON array which will be later written to a file
 * @param input array of test suites 
 */
export async function writeReport(input: Array<SuiteResult>) {
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



// Write our JSON data to HTML
export function writeToFile() {
  const JSONreport = JSON.stringify(appState.reportJSON);
  createPage(JSONreport);
  return true
}

// Create HTML report page
function createPage(report:string) {
  const dirname = '/Users/cvaldez/Documents/slack-old-joe/src/';
  const template = fs.readFileSync(path.resolve(dirname, './report/static/template.html'), 'utf8');
  const html = convert(report);
  const result = template.replace('HTMLHERE', html);
  const reportPath = path.join(appState.absPath, appState.fileName);
  fs.writeFileSync(reportPath, result);
}

function convert(report:string) {
  const json2html = require('node-json2html');

  const transforms = {
    '<>': 'h1', 'text': '${name}\n', 'html':function():any {
      return json2html.transform(
        (this as any).results,
        transforms.child
        )},
      'child':{'<>':'li', 'style': 'font-size:16px' ,'html':'${name} Passed: ${ok}'}
    }
  return json2html.transform(report, transforms);
}

