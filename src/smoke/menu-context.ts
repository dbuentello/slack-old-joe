import { assert } from 'chai';
import * as robot from 'robotjs';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { enterMessage } from '../helpers/enter-message';
import { clipboard } from 'electron';
import { sendClickElement } from '../helpers/send-pointer-event';
import { switchToChannel } from '../helpers/switch-channel';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { clickContextMenuItem } from '../helpers/click-context-menu-item';
import { clearMessageInput } from '../helpers/clear-message-input';

// This suite is pretty unstable. It's not entirely clean
// when exactly we're opening up the context menu, or when
// we're closing it – so we'll retry these tests a few times.

export const test: SuiteMethod = async ({ it, beforeAll, beforeEach }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
    await switchToChannel(window.client, 'random');
  });

  beforeEach(async () => {
    const { width, height } = robot.getScreenSize();
    robot.moveMouse(Math.round(width / 2), Math.round(height / 2));
    await wait(500);
  });

  it('can "copy"', async () => {
    clipboard.writeText('content');
    await clearMessageInput(window.client);
    await enterMessage(window.client, 'hello');
    await wait(300);

    await sendNativeKeyboardEvent({ text: 'a', cmdOrCtrl: true });
    await sendClickElement(window.client, 'p=hello', true);
    await wait(300);
    await clickContextMenuItem(2);
    await wait(600);

    assert.equal(clipboard.readText(), 'hello', 'the clipboard content');
  }, { retries: 3 });

  it('can "paste"', async () => {
    clipboard.writeText('pasted');
    await clearMessageInput(window.client);

    await enterMessage(window.client, 'replace');
    await sendNativeKeyboardEvent({
      text: 'a',
      cmdOrCtrl: true,
      noFocus: true
    });

    await sendClickElement(window.client, 'p=replace', true);
    await wait(300);
    await clickContextMenuItem(1);
    await wait(600);

    const messageElement = await window.client.$('p=pasted');
    await messageElement.waitForExist(1000);

    assert.ok(await messageElement.isExisting(), 'the message input');
  }, { retries: 3 });

  it('can "cut"', async () => {
    clipboard.writeText('blob');
    await clearMessageInput(window.client);

    await enterMessage(window.client, 'cut');
    await sendNativeKeyboardEvent({
      text: 'a',
      cmdOrCtrl: true,
      noFocus: true
    });
    await wait(300);
    await sendClickElement(window.client, 'p=cut', true);
    await wait(300);
    await clickContextMenuItem(3);
    await wait(600);

    assert.equal(clipboard.readText(), 'cut', 'the clipboard content');
    await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });
  }, { retries: 3 });
};
