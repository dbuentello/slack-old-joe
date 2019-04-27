import { getWindowHandle, GetWindowResult } from './get-window-handle';

export async function getPostWindowHandle(
  client: BrowserObject
): Promise<GetWindowResult | null> {
  return getWindowHandle(client, url => url.includes('/files/'));
}
