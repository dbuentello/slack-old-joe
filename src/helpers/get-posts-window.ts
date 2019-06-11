import { getWindowHandle, GetWindowResult } from './get-window-handle';

import { BrowserObject } from 'webdriverio';

export async function getPostWindowHandle(
  client: BrowserObject
): Promise<GetWindowResult | null> {
  return getWindowHandle(client, url => url.includes('/files/'));
}
