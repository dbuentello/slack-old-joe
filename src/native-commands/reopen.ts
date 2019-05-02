import { runAppleScript } from '../utils/applescript';
import { isMac } from '../utils/os';

export async function reopen() {
  if (isMac()) {
    await runAppleScript('tell application "Slack" to reopen');
  }
}
