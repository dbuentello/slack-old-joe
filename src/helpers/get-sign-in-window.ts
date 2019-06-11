import { getWindowHandle, GetWindowResult } from './get-window-handle';

import { BrowserObject } from 'webdriverio';

/**
 * Get the sign in window
 *
 * @export
 * @param {BrowserObject} client
 * @returns {(Promise<GetWindowResult | null>)}
 */
export async function getSignInWindow(
  client: BrowserObject
): Promise<GetWindowResult | null> {
  return getWindowHandle(client, (_url, title) => {
    return title.includes('Sign in');
  });
}
