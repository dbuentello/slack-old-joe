import { getWindowHandle } from './get-window-handle';

export function getGpuWindowHandle(client: BrowserObject) {
  return getWindowHandle(client, url => url.startsWith('chrome://gpu'));
}
