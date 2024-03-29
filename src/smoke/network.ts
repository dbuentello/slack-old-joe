import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { disableWifi, enableWifi } from '../native-commands/wifi';
import { waitUntilElementGone } from '../helpers/wait-until-gone';
import { getSonicWindow } from '../helpers/get-sonic-window';
import { wait } from '../utils/wait';
import { isLinux } from '../utils/os';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getSonicWindow(window.client);
  });

  it(
    'displays the offline information when offline',
    async () => {
      await disableWifi();

      // We don't really know how quickly the system will go down,
      // so we'll be generous with our wait time (40s), likely much faster
      const offlineInfo = await window.client.$(
        'i[type="cloud-offline-small"]'
      );
      if (isLinux()) {
        await wait(10000);
      } else {
        // The test always failed when I tested this with linux.
        await offlineInfo.waitForDisplayed(40 * 1000);
      }
      assert.ok(await offlineInfo.isDisplayed(), 'offline info not displayed');
    },
    {
      platforms: ['win32', 'darwin', 'linux']
    }
  );

  it(
    'returns to the connected state when Wifi comes back',
    async () => {
      await enableWifi();

      // Wait for us to be online before we continue
      assert.ok(
        await waitUntilElementGone(
          window.client,
          'i[type="cloud-offline-small"]',
          40 * 1000
        ),
        'Unable to return to the connected state.'
      );
    },
    {
      platforms: ['win32', 'darwin', 'linux']
    }
  );
};
