import { runAppleScript } from '../helpers/applescript';
import { isMac } from '../helpers/os';

export async function clickFirstNativeNotification() {
  if (isMac()) {
    return runAppleScript(
      `tell application "System Events" to click window 1 of process "NotificationCenter"`
    );
  }
}
