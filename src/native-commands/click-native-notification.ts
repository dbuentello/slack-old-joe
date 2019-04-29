import { runAppleScript } from '../utils/applescript';
import { isMac } from '../utils/os';

export async function clickFirstNativeNotification() {
  if (isMac()) {
    return runAppleScript(
      `tell application "System Events" to click window 1 of process "NotificationCenter"`
    );
  }
}
