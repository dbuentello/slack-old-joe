import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { enterMessage } from '../helpers/enter-message';
import { clipboard } from 'electron';
import { sendClickElement, PointerEvents } from '../helpers/send-pointer-event';
import { switchToChannel } from '../helpers/switch-channel';
import { clickContextMenuItem } from '../helpers/click-context-menu-item';
import { clearMessageInput } from '../helpers/clear-message-input';
import { getDevToolsWindowHandle } from '../helpers/get-devtools-window';
import { centerMouse } from '../native-commands/center-mouse';
import { openContextMenuForElement } from '../helpers/open-context-menu';
import { setSelection } from '../helpers/set-selection';
import { reopen } from '../native-commands/reopen';
import { isWin } from '../utils/os';
import { appState } from '../renderer/state';
import { getSonicWindow } from '../helpers/get-sonic-window';
import { focus } from '../native-commands/focus';
import { switchToTeam } from '../helpers/switch-teams';

// This suite is pretty unstable. It's not entirely clean
// when exactly we're opening up the context menu, or when
// we're closing it – so we'll retry these tests a few times.

export const test: SuiteMethod = async ({ it, beforeAll, beforeEach }) => {
  const retries = 3;

  beforeAll(async () => {
    await getSonicWindow(window.client);
    await switchToTeam(1);
    await switchToChannel(window.client, 'random');

    if (isWin()) {
      await reopen(appState);
    }
  });

  beforeEach(async () => {
    // We could clear, but then "Paste" would be disabled and the
    // indexes would be off
    clipboard.writeText('beforeEach');
    centerMouse();
    await focus();
  });

  it(
    'can "copy" (editable)',
    async () => {
      await clearMessageInput(window.client);
      await enterMessage(window.client, 'hello');
      await wait(300);

      await sendNativeKeyboardEvent({ text: 'a', cmdOrCtrl: true });
      await openContextMenuForElement(
        window.client,
        '.p-message_input .ql-editor p'
      );
      await clickContextMenuItem(2);
      await wait(600);

      assert.equal(
        clipboard.readText(),
        'hello',
        `the clipboard content does not equal \'hello\' given ${clipboard.readText()} instead`
      );
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
      await openContextMenuForElement(
        window.client,
        '.p-message_input .ql-editor p'
      );
      await clickContextMenuItem(1);
      await wait(600);

      const messageElement = await window.client.$('p=pasted');
      await messageElement.waitForExist(1000);

      assert.ok(
        await messageElement.isExisting(),
        'the message input does not exist'
      );
    },
    { retries }
  );

  it(
    'can "cut" (editable)',
    async () => {
      await clearMessageInput(window.client);

      await enterMessage(window.client, 'cut');
      await sendNativeKeyboardEvent({
        text: 'a',
        cmdOrCtrl: true,
        noFocus: true
      });
      await openContextMenuForElement(
        window.client,
        '.p-message_input .ql-editor p'
      );
      await clickContextMenuItem(3);
      await wait(600);

      assert.equal(
        clipboard.readText(),
        'cut',
        "the clipboard content does not equal 'cut'"
      );
      await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });
    },
    { retries }
  );

  it(
    'can "copy" (static)',
    async () => {
      if (isWin()) await reopen(appState);
      await switchToChannel(window.client, 'threads');

      const selector = `.c-message__body:not(.c-message__body--automated)`;

      await setSelection(window.client, selector);
      await openContextMenuForElement(window.client, selector);
      await clickContextMenuItem(1);
      await wait(600);

      assert.equal(
        clipboard.readText(),
        'I am a thread',
        "the clipboard content should equal 'I am a thread'"
      );
    },
    { retries }
  );

  it(
    'can "inspect element" (static)',
    async () => {
      const selector = `.c-message__body:not(.c-message__body--automated)`;

      await switchToChannel(window.client, 'threads');
      await openContextMenuForElement(window.client, selector);
      await clickContextMenuItem(0);
      await wait(1200);

      const devToolsWindow = await getDevToolsWindowHandle(window.client);
      assert.ok(devToolsWindow, 'window handle for the dev tools is not valid');

      // Let's close that again though
      await window.client.closeWindow();
      await wait(1000);
      await getSonicWindow(window.client);
      await wait(600);
    },
    { retries }
  );

  it(
    'can "copy image url"',
    async () => {
      await switchToChannel(window.client, 'image');
      await wait(1000);
      await sendClickElement(window.client, {
        selector: 'a.p-file_image_thumbnail__wrapper',
        rightClick: false,
        type: PointerEvents.MOUSEDOWNUP
      });

      await openContextMenuForElement(
        window.client,
        'a.p-file_image_thumbnail__wrapper',
        1000
      );

      await clickContextMenuItem(1);
      await wait(600);

      const imageUrl = clipboard.readText();
      assert.ok(
        imageUrl.startsWith('https://files.slack'),
        'image does not start with the desired image URL'
      );
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
    'can "copy image"',
    async () => {
      await switchToChannel(window.client, 'image');
      await wait(1000);
      await sendClickElement(window.client, {
        selector: 'a.p-file_image_thumbnail__wrapper',
        rightClick: false,
        type: PointerEvents.MOUSEDOWNUP
      });

      await openContextMenuForElement(
        window.client,
        '.p-image_viewer__image',
        1000
      );

      await clickContextMenuItem(2);
      await wait(600);

      const image = clipboard.readImage();
      assert.notOk(
        image.isEmpty(),
        'there should be an image in the clipboard.'
      );
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
      await switchToChannel(window.client, 'image');
      await openContextMenuForElement(
        window.client,
        'a.p-file_image_thumbnail__wrapper',
        1000
      );

      await clickContextMenuItem(2);
      await wait(600);

      const image = clipboard.readText();
      // https://files.slack.com/files-pri/THWUCHYD6-FJEBR9EJ1/photo-1467269204594-9661b134dd2b.jpeg
      assert.ok(
        image.startsWith('https://files.slack'),
        'image does not begin with the desired url (https://files.slack)'
      );
    },
    {
      retries
    }
  );
};
