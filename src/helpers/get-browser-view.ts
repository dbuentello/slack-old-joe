import { wait } from '../utils/wait';
import { getWindowHandle, GetWindowResult } from './get-window-handle';

import { BrowserObject } from 'webdriverio';

/**
 * Get the currently active BrowserView
 *
 * @export
 * @param {BrowserObject} client
 * @param {number} [waitForMsBefore=0]
 * @param {string} [teamUrl='']
 * @returns {Promise<GetWindowResult | null>}
 */
export async function getBrowserViewHandle(
  client: BrowserObject,
  waitForMsBefore = 0,
  teamUrl = ''
): Promise<GetWindowResult | null> {
  if (wait) await wait(waitForMsBefore);

  console.groupCollapsed('getBrowserViewHandle');
  console.trace();

  let handle: GetWindowResult | null = null;

  // See if we're already the current browser view (often the case)
  handle = await getCurrentTargetBrowserViewHandle(client, teamUrl);

  // Maybe we need to go through all windows
  handle =
    handle ||
    (await getWindowHandle(client, async (url, title) =>
      isBrowserView(client, url, title, teamUrl)
    ));

  console.groupEnd();
  return handle;
}

async function isBrowserView(
  client: BrowserObject,
  url: string,
  title: string,
  teamUrl: string
) {
  const isRemote = url.startsWith(`https://${teamUrl}`);
  const selectedId = `window.desktop.store.getState().appTeams.selectedTeamId`;
  const isSelectedTest = `return ${selectedId} === window.teamId`;

  if (title.endsWith('Slack') && isRemote) {
    let isSelected = false;

    try {
      isSelected = await client.executeScript(isSelectedTest, []);
    } catch (error) {
      console.log(`Could not run script to find selected team`, error);
    }

    return isSelected && isRemote;
  }

  return false;
}

async function getCurrentTargetBrowserViewHandle(
  client: BrowserObject,
  teamUrl: string
) {
  try {
    // See if we're already the current browser view (often the case)
    const url = await client.getUrl();
    const title = await client.getTitle();

    if (await isBrowserView(client, url, title, teamUrl)) {
      return {
        handle: await client.getWindowHandle(),
        url,
        title
      };
    }
  } catch (error) {
    console.log(`Checking if we're already a BrowserView failed`, error);
  }

  return null;
}
