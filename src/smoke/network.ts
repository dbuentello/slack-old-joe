import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { disableWifi, enableWifi } from '../native-commands/wifi';
import { waitUntilElementGone } from '../helpers/wait-until-gone';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  it('displays the offline information when offline', async () => {
    await disableWifi();

    // We don't really know how quickly the system will go down,
    // so we'll be generous with our wait time (40s), likely much faster
    const offlineInfo = await window.client.$('.p-notification_bar__offline');
    await offlineInfo.waitForDisplayed(40 * 1000);

    assert.ok(await offlineInfo.isDisplayed(), 'offline info not displayed');
  });

  it('returns to the connected state when Wifi comes back', async () => {
    await enableWifi();

    // Wait for us to be online before we continue
    assert.ok(
      await waitUntilElementGone(
        window.client,
        '.p-notification_bar__offline',
        40 * 1000
      )
    );
  });
};
