import { BrowserObject } from 'webdriverio';

/**
 * Assumes that the GPU window is open and selected.
 *
 * @export
 * @param {BrowserObject} client
 */
export async function getIsGpuEnabled(client: BrowserObject) {
  const acceleratedFeatures = (await client.$$('span=Hardware accelerated'))
    .length;

  return acceleratedFeatures > 4;
}
