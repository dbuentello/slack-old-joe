import { assert } from 'chai';
import * as robot from 'robotjs';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { enterMessage } from '../helpers/enter-message';
import { clipboard } from 'electron';
import { sendClickElement, PointerEvents } from '../helpers/send-pointer-event';
import { switchToChannel } from '../helpers/switch-channel';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { clickContextMenuItem } from '../helpers/click-context-menu-item';
import { clearMessageInput } from '../helpers/clear-message-input';
import { getDevToolsWindowHandle } from '../helpers/get-devtools-window';
import { clickWindowMenuItem } from '../helpers/click-window-menu-item';
import { closeFullscreenModal } from '../helpers/close-fullscreen-modal';

// This suite is pretty unstable. It's not entirely clean
// when exactly we're opening up the context menu, or when
// we're closing it – so we'll retry these tests a few times.

export const test: SuiteMethod = async ({ it, beforeAll, beforeEach }) => {
  const retries = 3;

  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
    await switchToChannel(window.client, 'random');
  });

  beforeEach(async () => {
    const { width, height } = robot.getScreenSize();
    robot.moveMouse(Math.round(width / 2), Math.round(height / 2));
    await wait(500);
  });

  it(
    'can "copy" (editable)',
    async () => {
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
    },
    { retries }
  );

  it(
    'can "paste" (editable)',
    async () => {
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
    },
    { retries }
  );

  it(
    'can "cut" (editable)',
    async () => {
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
    },
    { retries }
  );

  it(
    'can "copy" (static)',
    async () => {
      clipboard.clear();
      await switchToChannel(window.client, 'threads');

      await sendClickElement(window.client, 'span=I am a thread', true);
      await wait(300);
      await clickContextMenuItem(1);
      await wait(600);

      // We're just selecting the first element
      assert.equal(clipboard.readText(), 'I', 'the clipboard content');
    },
    { retries }
  );

  it(
    'can "inspect element" (static)',
    async () => {
      await switchToChannel(window.client, 'threads');
      await sendClickElement(window.client, 'span=I am a thread', true);
      await wait(300);
      await clickContextMenuItem(0);
      await wait(600);

      const devToolsWindow = await getDevToolsWindowHandle(window.client);
      assert.ok(devToolsWindow, 'window handle for the dev tools');

      // Let's close that again though
      await clickWindowMenuItem([
        'View',
        'Developer',
        'Toggle Webapp DevTools'
      ]);
      await wait(600);
      await getBrowserViewHandle(window.client);
    },
    { retries }
  );

  it(
    'can "copy image url"',
    async () => {
      clipboard.clear();

      await switchToChannel(window.client, 'image');
      await wait(1000);
      await sendClickElement(
        window.client,
        'a.p-file_image_thumbnail__wrapper',
        false,
        PointerEvents.MOUSEDOWN
      );

      await sendClickElement(
        window.client,
        'a.p-file_image_thumbnail__wrapper',
        false,
        PointerEvents.MOUSEUP
      );

      await wait(1000);
      await sendClickElement(window.client, '.p-image_viewer__image', true);
      await wait(600);
      await clickContextMenuItem(1);
      await wait(600);

      const imageUrl = clipboard.readText();
      assert.ok(imageUrl.startsWith('https://files.slack'));
    },
    {
      retries,
      cleanup: async () => {
        await closeFullscreenModal(window.client);
        await wait(1000);
      }
    }
  );

  it(
    'can "copy image"',
    async () => {
      clipboard.clear();

      await switchToChannel(window.client, 'image');
      await wait(1000);
      await sendClickElement(
        window.client,
        'a.p-file_image_thumbnail__wrapper',
        false,
        PointerEvents.MOUSEDOWN
      );

      await sendClickElement(
        window.client,
        'a.p-file_image_thumbnail__wrapper',
        false,
        PointerEvents.MOUSEUP
      );

      await wait(1000);
      await sendClickElement(window.client, '.p-image_viewer__image', true);
      await wait(600);
      await clickContextMenuItem(2);
      await wait(600);

      const image = clipboard.readImage();
      assert.notOk(image.isEmpty());
    },
    {
      retries,
      cleanup: async () => {
        await sendNativeKeyboardEvent({ text: 'escape' });
        await wait(1000);
      }
    }
  );

  it(
    'can "copy link"',
    async () => {
      clipboard.clear();

      await switchToChannel(window.client, 'image');
      await wait(1000);
      await sendClickElement(
        window.client,
        'a.p-file_image_thumbnail__wrapper',
        true
      );

      await wait(600);
      await clickContextMenuItem(2);
      await wait(600);

      const image = clipboard.readText();
      // https://files.slack.com/files-pri/THWUCHYD6-FJEBR9EJ1/photo-1467269204594-9661b134dd2b.jpeg
      assert.ok(image.startsWith('https://files.slack'));
    },
    {
      retries
    }
  );
};
