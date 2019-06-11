import { getWindowHandle, GetWindowResult } from './get-window-handle';

import { BrowserObject } from 'webdriverio';

/**
 * Get the notifications window handle
 *
 * @export
 * @param {BrowserObject} client
 * @returns {(Promise<GetWindowResult | null>)}
 */
export async function getNotificationsWindowHandle(
  client: BrowserObject
): Promise<GetWindowResult | null> {
  return getWindowHandle(client, async url => {
    const isRenderer =
      url.startsWith('file://') && !url.includes('component-window.html');
    if (!isRenderer) return false;

    const notificationsHost = await client.$('div.NotificationHost');
    return notificationsHost.isExisting();
  });
}
