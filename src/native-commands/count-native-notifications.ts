import { runAppleScript } from '../helpers/applescript';

const getOpenNotificationCountAppleScript = () => `
tell application "System Events"
	tell process "Notification Center"
		set theseWindows to every window
		return (count of theseWindows)
	end tell
end tell
`.trim();

export async function getNativeOpenNotificationCount() {
  const script = getOpenNotificationCountAppleScript();
  return runAppleScript(script);
}
