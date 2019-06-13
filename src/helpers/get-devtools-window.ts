import { getWindowHandle, GetWindowResult } from './get-window-handle';

import { BrowserObject } from 'webdriverio';

export async function getDevToolsWindowHandle(
  client: BrowserObject
): Promise<GetWindowResult | null> {
  return getWindowHandle(client, url => {
    console.log(url);
    return url.startsWith('devtools://devtools');
  });
}
