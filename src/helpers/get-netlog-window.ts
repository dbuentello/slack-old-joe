import { getWindowHandle } from './get-window-handle';

export async function getNetLogWindowHandle(client: BrowserObject) {
  return getWindowHandle(client, url => url.endsWith('component=NetLogWindow'));
}
