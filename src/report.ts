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
  createPage(JSONreport);
  return fs.writeFile(reportPath, JSONreport);
}

function createPage(JSONreport: string) {
  // add in the important stuff. 
  var Metalsmith  = require('metalsmith');
  var collections = require('metalsmith-collections');
  var layouts     = require('metalsmith-layouts');
  var markdown    = require('metalsmith-markdown');
  var permalinks  = require('metalsmith-permalinks');
  Metalsmith(__dirname)         // __dirname defined by node.js:
                              // name of current working directory
  .metadata({                 // add any variable you want
                              // use them in layout-files
    sitename: "My Static Site & Blog",
    siteurl: "http://example.com/",
    description: "It's about saying »Hello« to the world.",
    generatorname: "Metalsmith",
    generatorurl: "http://metalsmith.io/"
  })
  .source('./src')            // source directory
  .destination('./build')     // destination directory
  .clean(true)                // clean destination before
  .use(collections({          // group all blog posts by internally
    posts: 'posts/*.md'       // adding key 'collections':'posts'
  }))                         // use `collections.posts` in layouts
  .use(markdown())            // transpile all md into html
  .use(permalinks({           // change URLs to permalink URLs
    relative: false           // put css only in /css
  }))
  .use(layouts())             // wrap layouts around html
  .build(function(err) {      // build process
    if (err) throw err;       // error handling is required
  });
  return true;
}
