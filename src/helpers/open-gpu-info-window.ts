import { getBrowserViewHandle } from './get-browser-view';
import { wait } from '../utils/wait';
import { getGpuWindowHandle } from './get-gpu-info-window';

import { BrowserObject } from 'webdriverio';

/**
 * Open the GPU info window
 *
 * @param {BrowserObject} client
 */
export async function openGpuInfoWindow(client: BrowserObject) {
  await getBrowserViewHandle(client);
  await client.executeScript(`window.open('chrome://gpu')`, []);
  await wait(500);
  await getGpuWindowHandle(client);
}
