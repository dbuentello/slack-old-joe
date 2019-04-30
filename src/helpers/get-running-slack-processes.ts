import { execSync } from 'child_process';
import * as path from 'path';

import { isWin, isMac } from '../utils/os';
import { runPowerShellScript } from '../utils/powershell';

const debug = require('debug')('old-joe');

export async function getRunningSlackProcessesCount(appPath: string) {
  let output: String | Buffer = '';
  let pathToCheck = appPath;

  if (isWin()) {
    const scriptPath = path.join(
      __dirname,
      '../../static/powershell/process-count.ps1'
    );

    return runPowerShellScript(scriptPath);
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
