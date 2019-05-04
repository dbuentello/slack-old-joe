import { assert } from 'chai';
import * as robot from 'robotjs';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { focus } from '../native-commands/focus';
import { enterMessage } from '../helpers/enter-message';
import { clipboard } from 'electron';
import { sendClickElement } from '../helpers/send-pointer-event';
import { switchToChannel } from '../helpers/switch-channel';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { clickContextMenuItem } from '../helpers/click-context-menu-item';
// VERY unstable

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
    await enterMessage(window.client, 'hello');
    await focus();
    await wait(300);

    await sendNativeKeyboardEvent({ text: 'a', cmdOrCtrl: true });
    await sendClickElement(window.client, 'p=hello', true);
    await wait(300);
    await clickContextMenuItem(2);
    await wait(600);

    assert.equal(clipboard.readText(), 'hello', 'the clipboard content');
  });

  it('can "paste"', async () => {
    clipboard.writeText('pasted');
    await sendNativeKeyboardEvent({
      text: 'a',
      cmdOrCtrl: true,
      noFocus: true
    });
    await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });
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

    // Delete
    await focus();
    await sendNativeKeyboardEvent({
      text: 'a',
      cmdOrCtrl: true,
      noFocus: true
    });
    await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });
  });

  it('can "cut"', async () => {
    clipboard.writeText('blob');

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
  });
};
