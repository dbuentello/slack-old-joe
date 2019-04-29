import { runAppleScript } from '../utils/applescript';
import { isMac, isWin } from '../utils/os';
import { getNotificationsWindowHandle } from '../helpers/get-notifications-window';

const getOpenNotificationCountAppleScript = () =>
  `
tell application "System Events"
	tell process "Notification Center"
		set theseWindows to every window
		return (count of theseWindows)
	end tell
end tell
`.trim();

export async function getNativeOpenNotificationCount(client: BrowserObject) {
  if (isMac()) {
    const script = getOpenNotificationCountAppleScript();
    return runAppleScript(script);
  }

  if (isWin()) {
    // We'll just count the html notifications
    const handle = await getNotificationsWindowHandle(client);

    if (handle) {
      return (await client.$$('div.Message')).length;
    } else {
      throw new Error('Notifications window does not exist');
    }
  }
}
