import { wait } from './wait';
import { getWindowHandle, GetWindowResult } from './get-window-handle';

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

  return getWindowHandle(client, async (url, title) => {
    if (title.endsWith('Slack')) {
      const isSelectedTest = `return desktop.store.getState().appTeams.selectedTeamId === window.teamId`;
      const isRemote = url.startsWith(`https://${teamUrl}`);
      const isSelected =
        isRemote && (await client.executeScript(isSelectedTest, []));

      return isSelected && isRemote;
    }

    return false;
  });
}
