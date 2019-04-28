import { runAppleScript } from '../helpers/applescript';
import { isMac, isWin } from '../helpers/os';

const getCloseAppleScript = () =>
  `
tell application "Slack" to activate
tell application "System Events"
	perform action "AXPress" of (first button whose subrole is "AXCloseButton") of (first window whose subrole is "AXStandardWindow") of (first process whose frontmost is true)
end tell
`.trim();

export async function close() {
  // macOS
  if (isMac()) {
    return runAppleScript(getCloseAppleScript());
  }

  // Windows
  if (isWin()) {
  }
}
