import * as path from 'path';
import * as fs from 'fs-extra';
import { SuiteResult, ItTestParams, Result } from './interfaces';
import { appState } from './renderer/state';
import * as json2html from 'node-json2html';

/**
 * This will create a reportJSON array which will be later written to a file
 * @param input array of test suites
 */
export async function writeReport(input: Array<SuiteResult>) {
  input.forEach(currSuiteResult => {
    // append to the end of the list.
    appState.reportJSON.push(currSuiteResult);
  });
}

/**
 * Append a test-retry to the report.
 */
export async function appendReport(
  input: ItTestParams, // for now
  succeeded: boolean,
  error?: string
) {
  let text = `\n\n# Slack Old Joe Run ${input.name} (previously failed test)\n`;
  const result: Result = {
    ok: succeeded,
    name: input.name,
    error,
    skipped: false
  };
  const suiteResult: SuiteResult = { name: text, results: [result] };
  appState.reportJSON.push(suiteResult);
}

// Write our JSON data to HTML
export function writeToFile() {
  const JSONreport = JSON.stringify(appState.reportJSON);
  try {
    createPage(JSONreport);
  } catch (error) {
    console.warn(`Unable to create HTML report page`, error);
  }

  return true;
}

// Create HTML report page
function createPage(report: string) {
  const template = fs.readFileSync(
    path.resolve(__dirname, '../../static/report-page/template.html'),
    'utf8'
  );
  const html = convert(report);
  const result = template.replace('HTMLHERE', html);
  const reportPath = path.join(appState.absPath, appState.fileName);
  fs.writeFileSync(reportPath, result);
}

function convert(report: string) {
  // Transform our list of tests into HTML.
  const transforms = {
    '<>': 'h1',
    text: '${name}\n',
    html: function(): any {
      return json2html.transform((this as any).results, transforms.child);
    },
    child: {
      '<>': 'li',
      style: 'font-size:16px',
      text: '${name} Passed: ',
      html: function(): any {
        return (this as any).error
          ? `❌<li style="margin-left: 40px; font-size:16px; color: red"> Error: ${
              (this as any).error.message
            }</li>`
          : '✅';
      }
    }
  };
  return json2html.transform(report, transforms);
}
