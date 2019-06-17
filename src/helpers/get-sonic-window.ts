import { getWindowHandle, GetWindowResult } from './get-window-handle';

import { BrowserObject } from 'webdriverio';
import { wait } from '../utils/wait';

/**
 * Get the main window handle
 *
 * @export
 * @param {BrowserObject} client
 * @returns {(Promise<GetWindowResult | null>)}
 */
export async function getSonicWindow(
  client: BrowserObject,
  waitForMsBefore = 0
): Promise<GetWindowResult | null> {
  if (waitForMsBefore) await wait(waitForMsBefore);

  console.groupCollapsed('getSonicWindow');
  console.trace();

  let handle: GetWindowResult | null = null;

  // See if we're already in the Sonic window (often the case)
  handle = await getCurrentTargetSonicHandle(client);

  // Maybe we need to go through all windows
  handle = handle || (await getWindowHandle(client, isSonicWindow));

  console.groupEnd();
  return handle;
}

function isSonicWindow(url: string) {
  return url.startsWith('https://') && url.includes('app.slack.com/client');
}

async function getCurrentTargetSonicHandle(client: BrowserObject) {
  try {
    const url = await client.getUrl();
    const title = await client.getTitle();

    if (await isSonicWindow(url)) {
      return {
        handle: await client.getWindowHandle(),
        url,
        title
      };
    }
  } catch (error) {
    console.log(`Checking if we're already a Sonic window failed`, error);
  }

  return null;
}
