import * as path from 'path';

import { runAppleScript } from '../utils/applescript';
import { isMac, isWin } from '../utils/os';
import { runPowerShellScript } from '../utils/powershell';
import { wait } from '../utils/wait';

export async function focus() {
  if (isMac()) {
    await runAppleScript('tell application "Slack" to activate');
  }

  if (isWin()) {
    const scriptPath = path.join(
      __dirname,
      '../../static/powershell/focus.ps1'
    );

    await runPowerShellScript(scriptPath);
    await wait(300);
  }
}
