import { execSync } from 'child_process';

import { isWin, isMac } from './os';

const debug = require('debug')('old-joe');

export function getRunningSlackPocessesCount(appPath: string) {
  let output: String | Buffer = '';
  let pathToCheck = appPath;

  if (isWin()) {
    throw new Error('Not implemented yet');
  } else {
    if (isMac()) {
      pathToCheck = pathToCheck.slice(0, pathToCheck.indexOf('.app/') + 4);
    }

    const command = `ps -ef | grep -v grep | grep ${pathToCheck} | wc -l`;
    debug(`Running ${command}`);
    output = execSync(command);
  }

  return parseInt(output.toString().trim(), 10);
}
