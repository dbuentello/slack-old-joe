import { getSignInWindow } from './get-sign-in-window';
import { getBrowserViewHandle } from './get-browser-view';
import { wait } from '../utils/wait';

/**
 * Resolves once the client is ready
 *
 * @export
 * @param {BrowserObject} client
 * @returns {Promise<boolean>}
 */
export function waitUntilSlackReady(
  client: BrowserObject,
  expectSignIn: boolean
): Promise<boolean> {
  const getHasWindows = async () =>
    (await client.getWindowHandles()).length > 1;

  return new Promise(resolve => {
    const finish = async () => {
      clearInterval(testInterval);

      // At this point, we wait 500ms to allow
      // Slack's post-load scripts to load, too
      await wait(600);

      resolve(true);
    };

    const testInterval = setInterval(async () => {
      // Not at least two window objects? Goodbye
      if (!(await getHasWindows())) {
        return;
      }

      // So we have windows, huh? Are we ready?
      const target = expectSignIn
        ? await getSignInWindow(client)
        : await getBrowserViewHandle(client);
      const isLoading = target && (await client.isLoading());
      if (target && !isLoading) return finish();

      // No? Let's do this again in one second
    }, 1000);
  });
}
