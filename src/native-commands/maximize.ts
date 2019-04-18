import * as path from 'path';

import { runAppleScriptFile } from '../helpers/applescript';

export function maximize() {
  if (process.platform === 'darwin') {
    const scriptPath = path.join(__dirname, '../../static/applescript/maximize.scpt');
    return runAppleScriptFile(scriptPath);
  }
}
