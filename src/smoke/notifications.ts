import * as robot from 'robotjs';
import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { getNativeOpenNotificationCount } from '../native-commands/count-native-notifications';
import { switchToChannel } from '../helpers/switch-channel';
import { switchToTeam } from '../helpers/switch-teams';
import { isMac } from '../helpers/os';
import { wait } from '../helpers/wait';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  it('can send a native notification', async () => {
    await switchToTeam(window.client, 0);
    await switchToChannel(window.client, 'notify');

    // The "notify" message
    const cmdOrCtrl = isMac() ? 'Meta' : 'Ctrl';
    await window.client.keys([cmdOrCtrl, 'Shift']);
    const messageToClick = await window.client.$(`span=Hi, it's me, the notification`);
    await messageToClick.click();
    await window.client.keys([cmdOrCtrl, 'Shift']);
    await wait(100);

    const notifications = await getNativeOpenNotificationCount();

    assert.equal(notifications, 1, 'count of native notifications');
  });
};
