import * as path from 'path';

import { runAppleScript } from '../helpers/applescript';
import { isMac, isWin } from '../helpers/os';
import { runPowerShellScript } from '../helpers/powershell';
import { wait } from '../helpers/wait';

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
