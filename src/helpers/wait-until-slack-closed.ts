import { getRunningSlackPocessesCount } from './get-running-slack-processes';

/**
 * Wait until Slack is closed (and has 0 running processes)
 *
 * @export
 * @param {string} appPath
 * @param {number} [timeout=10 * 1000]
 * @returns {Promise<boolean>}
 */
export async function waitUntilSlackClosed(
  appPath: string,
  timeout: number = 10 * 1000
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const test = async () => {
      return getRunningSlackPocessesCount(appPath) === 0;
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
