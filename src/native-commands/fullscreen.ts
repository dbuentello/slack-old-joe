import * as path from 'path';

import { runAppleScriptFile } from '../helpers/applescript';

export function fullscreen() {
  if (process.platform === 'darwin') {
    const scriptPath = path.join(__dirname, '../../static/applescript/fullscreen.scpt');
    return runAppleScriptFile(scriptPath);
  }
}
