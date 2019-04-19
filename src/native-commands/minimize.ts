import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { runAppleScript } from '../helpers/applescript';

export async function minimize(unminimize?: boolean) {
  if (process.platform === 'darwin') {
    if (unminimize) {
      return runAppleScript('tell application "Slack" to reopen');
    } else {
      return sendNativeKeyboardEvent({ text: 'm', cmd: true });
    }
  }
}
