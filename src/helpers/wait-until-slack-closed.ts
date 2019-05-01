import { getRunningSlackProcessesCount } from './get-running-slack-processes';
import { AppState } from '../renderer/state';

/**
 * Wait until Slack is closed (and has 0 running processes)
 *
 * @export
 * @param {AppState} appPath
 * @param {number} [timeout=10 * 1000]
 * @returns {Promise<boolean>}
 */
export async function waitUntilSlackClosed(
  appState: AppState,
  timeout: number = 10 * 1000
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const test = async () => {
      return (await getRunningSlackProcessesCount(appState)) === 0;
    };

    const testTimeout = setTimeout(() => {
      clearInterval(testInterval);
      reject('timeout reached');
    }, timeout);

    const testInterval = setInterval(async () => {
      if (test()) {
        clearTimeout(testTimeout);
        clearInterval(testInterval);
        resolve(true);
      }
    }, 500);
  });
}
