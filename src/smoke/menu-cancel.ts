import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { switchToChannel } from '../helpers/switch-channel';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { clickWindowMenuItem } from '../helpers/click-window-menu-item';
import { getIsResetAppDataSheetOpen } from '../native-commands/get-reset-app-data-sheet';
import { getIsNetLogSheetOpen } from '../native-commands/get-restart-net-log-sheet';
import { focus } from '../native-commands/focus';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
    await switchToChannel(window.client, 'random');
  });

  const retries = 3;
  const cleanup = async () => {
    // We'll just mash escape twice 😂
    await sendNativeKeyboardEvent({ text: 'escape' });
    await sendNativeKeyboardEvent({ text: 'escape' });
  }

  it('can "cancel" the "Reset App Data" dialog', async () => {
    await clickWindowMenuItem(['Help', 'Troubleshooting', 'Reset App Data…']);
    await wait(1200);

    // Dialog should now be open
    const dialogOpen = await getIsResetAppDataSheetOpen();
    assert.ok(dialogOpen, 'the reset app data dialog (open)');

    await focus();
    await wait(500);
    await sendNativeKeyboardEvent({ text: 'escape', noFocus: true });

    // Dialog should now be closed
    const dialogClosed = !(await getIsResetAppDataSheetOpen());
    assert.ok(dialogClosed, 'the reset app data dialog (closed)');
  }, {
    cleanup,
    retries
  });

  it('can "cancel" the "Restart and Collect Net Logs" dialog', async () => {
    await clickWindowMenuItem([
      'Help',
      'Troubleshooting',
      'Restart and Collect Net Logs…'
    ]);
    await wait(1200);

    // Dialog should now be open
    const dialogOpen = await getIsNetLogSheetOpen();
    assert.ok(dialogOpen, 'the restart and collect net logs sheet (open)');

    await sendNativeKeyboardEvent({ text: 'escape' });

    // Dialog should now be closed
    const dialogClosed = !(await getIsResetAppDataSheetOpen());
    assert.ok(dialogClosed, 'the restart and collect net logs sheet (closed)');
  }, {
    cleanup,
    retries
  });
};
