import { getWindowHandle, GetWindowResult } from './get-window-handle';

/**
 * Get the main window handle
 *
 * @export
 * @param {BrowserObject} client
 * @returns {(Promise<GetWindowResult | null>)}
 */
export async function getRendererWindowHandle(
  client: BrowserObject
): Promise<GetWindowResult | null> {
  return getWindowHandle(client, url => {
    return url.startsWith('file://') && !url.includes('component-window.html');
  });
}
