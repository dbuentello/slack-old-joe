import { getWindowHandle } from './get-window-handle';

import { BrowserObject } from 'webdriverio';

export async function getNetLogWindowHandle(client: BrowserObject) {
  return getWindowHandle(client, url => url.endsWith('component=NetLogWindow'));
}
