import { getWindowHandle, GetWindowResult } from './get-window-handle';

export async function getDevToolsWindowHandle(
  client: BrowserObject
): Promise<GetWindowResult | null> {
  return getWindowHandle(client, url => {
    return url.startsWith('chrome-devtools://devtools');
  });
}
