import { getWindowHandle } from './get-window-handle';

import { BrowserObject } from 'webdriverio';

export function getGpuWindowHandle(client: BrowserObject) {
  return getWindowHandle(client, url => url.startsWith('chrome://gpu'));
}
