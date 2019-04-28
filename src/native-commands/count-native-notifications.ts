import { runAppleScript } from '../helpers/applescript';
import { isMac } from '../helpers/os';

const getOpenNotificationCountAppleScript = () =>
  `
tell application "System Events"
	tell process "Notification Center"
		set theseWindows to every window
		return (count of theseWindows)
	end tell
end tell
`.trim();

export async function getNativeOpenNotificationCount() {
  if (isMac()) {
    const script = getOpenNotificationCountAppleScript();
    return runAppleScript(script);
  }
}
