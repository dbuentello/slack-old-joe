import { getSignInWindow } from './get-sign-in-window';
import { getBrowserViewHandle } from './get-browser-view';
import { wait } from '../utils/wait';
import { GetWindowResult } from './get-window-handle';

const debug = require('debug')('old-joe');

/**
 * Resolves once the client is ready
 *
 * @export
 * @param {BrowserObject} client
 * @returns {Promise<boolean>}
 */
export function waitUntilSlackReady(
  client: BrowserObject,
  expectSignIn: boolean,
  timeout: number = 15 * 1000
): Promise<boolean> {
  debug(`Waiting for Slack to be ready`);

  const getHasWindows = async () =>
    (await client.getWindowHandles()).length > 1;

  return new Promise((resolve, reject) => {
    let target: GetWindowResult | null = null;

    const finish = async () => {
      clearInterval(testInterval);
      clearTimeout(testTimeout);

      // At this point, we wait 500ms to allow
      // Slack's post-load scripts to load, too
      await wait(600);

      debug(`Reporting Slack as ready!`);

      resolve(true);
    };

    const testTimeout = setTimeout(() => {
      clearInterval(testInterval);
      reject(`Timeout for Slack ready reached. Target: ${target}`);
    }, timeout);

    const testInterval = setInterval(async () => {
      // Not at least two window objects? Goodbye
      if (!(await getHasWindows())) {
        return;
      }

      // So we have windows, huh? Are we ready?
      target =
        target || expectSignIn
          ? await getSignInWindow(client)
          : await getBrowserViewHandle(client);
      const isLoading = target && (await client.isLoading());

      if (target && !isLoading) return finish();

      // No? Let's do this again in one second
    }, 1000);
  });
}
