import * as path from 'path';

import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { runAppleScript } from '../helpers/applescript';
import { isMac, isWin } from '../helpers/os';
import { runPowerShellScript } from '../helpers/powershell';

export async function minimize(unminimize?: boolean) {
  // macOS
  if (isMac()) {
    if (unminimize) {
      return runAppleScript('tell application "Slack" to reopen');
    } else {
      return sendNativeKeyboardEvent({ text: 'm', cmd: true });
    }
  }

  // Windows
  if (isWin()) {
    const scriptPath = path.join(
      __dirname,
      '../../static/powershell/show-window.ps1'
    );

    if (unminimize) {
      // 9 means restore
      await runPowerShellScript(scriptPath, `-showState 9`);
    } else {
      // 2 means minify
      await runPowerShellScript(scriptPath, `-showState 2`);
    }
  }
}
