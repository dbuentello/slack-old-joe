import * as path from 'path';
import { execSync } from 'child_process';

import { isWin, isMac } from '../utils/os';
import { runPowerShellScript } from '../utils/powershell';
import { runAppleScript } from '../utils/applescript';
import { wait } from '../utils/wait';

export async function killSlack() {
  if (isWin()) {
    // Windows: ps1
    const scriptPath = path.join(__dirname, '../../static/powershell/kill.ps1');
    await runPowerShellScript(scriptPath);
  } else if (isMac()) {
    // macOS: AppleScript
    await runAppleScript('tell application "Slack" to quit');
    await wait(1000);
  } else {
    // Linux: bash
    execSync('killall slack || true');
  }
}
