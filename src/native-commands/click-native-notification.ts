import { runAppleScript } from '../utils/applescript';
import { isMac, isWin } from '../utils/os';
import { getNotificationsWindowHandle } from '../helpers/get-notifications-window';

export async function clickFirstNativeNotification(client: BrowserObject) {
  if (isMac()) {
    return runAppleScript(
      `tell application "System Events" to click window 1 of process "NotificationCenter"`
    );
  }

  if (isWin()) {
    // We'll just click the html notifications
    const handle = await getNotificationsWindowHandle(client);

    if (handle) {
      return (await client.$('div.Message')).click();
    } else {
      throw new Error('Notifications window does not exist');
    }
  }
}
