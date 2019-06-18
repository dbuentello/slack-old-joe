import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getNativeOpenNotificationCount } from '../native-commands/count-native-notifications';
import { switchToChannel } from '../helpers/switch-channel';
import { isWin } from '../utils/os';
import { wait } from '../utils/wait';
import { clickFirstNativeNotification } from '../native-commands/click-native-notification';
import { getIsHidden } from '../helpers/get-is-hidden';
import { close } from '../native-commands/close';
import { closeFlexpane } from '../helpers/close-flexpane';
import { setPreference } from '../helpers/set-preference';
import { getSonicWindow } from '../helpers/get-sonic-window';
import { sendNotification } from '../helpers/send-notification';

export const test: SuiteMethod = async ({ it, beforeAll, beforeEach }) => {
  beforeAll(async () => {
    if (isWin()) {
      await setPreference(window.client, 'notificationStyle', '2018');
      await setPreference(window.client, 'notificationMethod', 'html');
      await wait(500);
    }
  });

  beforeEach(async () => {
    await getSonicWindow(window.client);
  });

  it('can send a native notification', async () => {
    // $('div.c-message_list div:nth-child(5)')
    await sendNotification(window.client, `Hi, it's me, the notification`);

    assert.equal(
      await getNativeOpenNotificationCount(window.client),
      1,
      'count of native notifications'
    );
  });

  it(
    'can click on the notification and open the right channel',
    async () => {
      await switchToChannel(window.client, 'ads');
      await clickFirstNativeNotification(window.client);

      // We should now be back at the notification item
      const messageToFind = await window.client.$(
        `span=Hi, it's me, the notification`
      );
      assert.ok(messageToFind.waitForExist(1000), 'the notification message');
    },
    {
      platforms: ['win32', 'darwin']
    }
  );

  it(
    'can click on the notification and open Slack',
    async () => {
      await sendNotification(window.client, `Hi, it's me, the notification`);
      await close();
      await wait(100);
      await clickFirstNativeNotification(window.client);
      await wait(300);

      assert.isFalse(await getIsHidden(window.client), 'document.hidden');
    },
    {
      platforms: ['win32', 'darwin']
    }
  );

  it(
    'can send notifications for threaded messages',
    async () => {
      const threadBtn = await window.client.$(`=1 reply`);
      await threadBtn.click();

      await sendNotification(window.client, 'The thread notification');
      assert.equal(
        await getNativeOpenNotificationCount(window.client),
        1,
        'count of native notifications'
      );
    },
    {
      platforms: ['win32', 'darwin']
    }
  );

  it(
    'can click on the notification and open the right thread',
    async () => {
      // Close the thread
      await closeFlexpane(window.client);
      await wait(200);

      // Hopefully open it again
      await clickFirstNativeNotification(window.client);
      const threadMsg = await window.client.$('span=The thread notification');
      assert.ok(threadMsg.waitForExist(2000));

      await getSonicWindow(window.client);
      await closeFlexpane(window.client);
    },
    {
      platforms: ['win32', 'darwin']
    }
  );
};
