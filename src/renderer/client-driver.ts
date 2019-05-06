import { appState } from './state';
import { killChromedriver } from '../native-commands/kill-chromedriver';
import { killSlack } from '../native-commands/kill-slack';
import { spawnChromeDriver } from './driver';
import { getClient } from './client';
import { wait } from '../utils/wait';
import { waitUntilSlackReady } from '../helpers/wait-until-slack-ready';

/**
 * Start both client and driver.
 *
 * @param {boolean} expectSignIn
 */
export async function startClientDriver(expectSignIn: boolean) {
  // Kill a possibly still running Slack and Chromedriver
  await killSlack(appState);
  await killChromedriver();

  // Driver, then client
  await spawnChromeDriver();
  await getClient(appState);

  // Wait for the client to be ready
  await wait(1000);
  await waitUntilSlackReady(window.client, expectSignIn);
}

/**
 * Stop both client and driver.
 */
export async function stopClientDriver() {
  try {
    // Kill driver and session
    await window.client.deleteSession();
    await window.driver.kill();

    // Optional, but harder
    await killChromedriver();

    // Kill Slack, if still running
    await killSlack(appState);
  } catch (error) {
    console.warn(error);
  }
}
