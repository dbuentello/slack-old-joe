import { getWindowHandle, GetWindowResult } from './get-window-handle';

export async function getAboutWindowHandle(
  client: BrowserObject
): Promise<GetWindowResult | null> {
  return getWindowHandle(client, (url, title) => {
    return url.startsWith('file') && title === 'About Slack';
  });
}
