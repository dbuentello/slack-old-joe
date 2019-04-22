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
    if (unminimize) {
      const scriptPath = path.join(
        __dirname,
        '../../static/powershell/minimize.ps1'
      );

      return runPowerShellScript(scriptPath);
    } else {
      return sendNativeKeyboardEvent({ text: 'down', cmd: true });
    }
  }
}
