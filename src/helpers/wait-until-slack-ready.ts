import { getSignInWindow } from './get-sign-in-window';
import { getBrowserViewHandle } from './get-browser-view';
import { wait } from './wait';

/**
 * Resolves once the client is ready
 *
 * @export
 * @param {BrowserObject} client
 * @returns {Promise<boolean>}
 */
export function waitUntilSlackReady(client: BrowserObject): Promise<boolean> {
  const getHasWindows = async () =>
    (await client.getWindowHandles()).length > 1;

  return new Promise(resolve => {
    const finish = async () => {
      clearInterval(testInterval);

      // At this point, we wait 500ms to allow
      // Slack's post-load scripts to load, too
      await wait(500);

      resolve(true);
    };

    const testInterval = setInterval(async () => {
      // Not at least two window objects? Goodbye
      if (!(await getHasWindows())) {
        return;
      }

      // So we have windows, huh? Are we ready?
      const target =
        (await getSignInWindow(client)) || (await getBrowserViewHandle(client));
      const isLoading = await client.isLoading();
      if (target && !isLoading) return finish();

      // No? Let's do this again in 300ms
    }, 300);
  });
}
