import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { getNativeOpenNotificationCount } from '../native-commands/count-native-notifications';
import { switchToChannel } from '../helpers/switch-channel';
import { switchToTeam } from '../helpers/switch-teams';
import { isMac } from '../utils/os';
import { wait } from '../utils/wait';
import { clickFirstNativeNotification } from '../native-commands/click-native-notification';
import { getIsHidden } from '../helpers/get-is-hidden';
import { close } from '../native-commands/close';
import { closeFlexpane } from '../helpers/close-flexpane';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  /**
   * Clicks on a message with Cmd / Ctrl and shift to send a notification.
   *
   * @param {string} text
   */
  async function sendNotification(text: string) {
    const cmdOrCtrl = isMac() ? 'Meta' : 'Ctrl';

    await switchToTeam(window.client, 0);
    await switchToChannel(window.client, 'notify');

    // The "notify" message
    await window.client.keys([cmdOrCtrl, 'Shift']);
    const messageToClick = await window.client.$(`span=${text}`);
    await messageToClick.click();
    await window.client.keys([cmdOrCtrl, 'Shift']);
    await wait(100);
  }

  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  it('can send a native notification', async () => {
    await sendNotification(`Hi, it's me, the notification`);

    assert.equal(
      await getNativeOpenNotificationCount(),
      1,
      'count of native notifications'
    );
  });

  it('can click on the notification and open the right channel', async () => {
    await switchToChannel(window.client, 'ads');
    await clickFirstNativeNotification();

    // We should now be back at the notification item
    const messageToFind = await window.client.$(
      `span=Hi, it's me, the notification`
    );
    assert.ok(messageToFind.waitForExist(1000), 'the notification message');
  });

  it('can click on the notification and open Slack', async () => {
    await sendNotification(`Hi, it's me, the notification`);
    await close();
    await wait(100);
    await clickFirstNativeNotification();
    await wait(300);

    assert.isFalse(await getIsHidden(window.client), 'document.hidden');
  });

  it('can send notifications for threaded messages', async () => {
    const threadBtn = await window.client.$(`=1 reply`);
    await threadBtn.click();

    await sendNotification('The thread notification');
    assert.equal(
      await getNativeOpenNotificationCount(),
      1,
      'count of native notifications'
    );
  });

  it('can click on the notification and open the right thread', async () => {
    // Close the thread
    await closeFlexpane(window.client);
    await wait(50);

    // Hopefully open it again
    await clickFirstNativeNotification();
    const threadMsg = await window.client.$('span=The thread notification');
    assert.ok(threadMsg.waitForExist(1000));

    await closeFlexpane(window.client);
  });
};
