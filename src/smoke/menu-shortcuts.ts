import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { openPreferences, closePreferences } from '../helpers/open-preferences';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { getIsHidden } from '../helpers/get-is-hidden';
import { focus } from '../native-commands/focus';
import { enterMessage } from '../helpers/enter-message';
import { isMac, isLinux, isWin } from '../utils/os';
import { getSelection } from '../helpers/get-selection';
import { reopen } from '../native-commands/reopen';
import { clipboard } from 'electron';
import { switchToChannel } from '../helpers/switch-channel';
import { appState } from '../renderer/state';
import { getSonicWindow } from '../helpers/get-sonic-window';
import { getZoomLevel } from '../helpers/get-zoom';
import { switchToTeam } from '../helpers/switch-teams';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getSonicWindow(window.client);
    await switchToTeam(1);
  });

  it('can open the preferences', async () => {
    assert.ok(
      await openPreferences(window.client),
      'could not open preferences'
    );

    await closePreferences(window.client);
  });

  it(
    'can "close the window"',
    async () => {
      await sendNativeKeyboardEvent({ text: 'w', cmdOrCtrl: true });
      await wait(5000);  
      assert.ok(await getIsHidden(window.client), 'client is not hidden');
    },
    {
      cleanup: async () => {
        await reopen(appState);
        await focus();
      }
    }
  );

  it('can "undo"', async () => {
    await getSonicWindow(window.client);
    await enterMessage(window.client, 'F');
    const messageElement = await window.client.$('p=F');
    await messageElement.waitForExist(1000);

    if (isMac() || isWin()) {
      await sendNativeKeyboardEvent({
        text: 'z',
        cmdOrCtrl: true,
        noFocus: true
      });
    } else {
      // linux
      await sendNativeKeyboardEvent({
        text: 'z',
        cmdOrCtrl: true
      });
    }
    assert.notOk(await messageElement.isExisting(), 'the former message input');
  });

  it('can "redo"', async () => {
    if (isMac()) {
      await sendNativeKeyboardEvent({
        text: 'z',
        cmd: true,
        shift: true,
        noFocus: true
      });
    } else if (isLinux()) {
      await sendNativeKeyboardEvent({
        text: 'z',
        ctrl: true,
        shift: true
      });
    } else {
      // Windows!
      await sendNativeKeyboardEvent({ text: 'y', ctrl: true, noFocus: true });
    }

    const messageElement = await window.client.$('p=F');
    await messageElement.waitForExist(1000);

    assert.ok(await messageElement.isExisting(), 'the message input');
  });

  it('can "select all"', async () => {
    await sendNativeKeyboardEvent({
      text: 'a',
      cmdOrCtrl: true,
      noFocus: true
    });
    const selection = await getSelection(window.client);

    assert.equal(selection, 'F', "the message input should equal 'F'");
  });

  it('can "copy"', async () => {
    await sendNativeKeyboardEvent({ text: 'c', cmdOrCtrl: true });
    await wait(300);
    assert.equal(
      clipboard.readText(),
      'F',
      "the clipboard content should equal 'F'"
    );
  });

  it('can "delete"', async () => {
    await sendNativeKeyboardEvent({ text: 'a', cmdOrCtrl: true });
    await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });

    const messageElement = await window.client.$('p=F');
    assert.notOk(
      await messageElement.isExisting(),
      'the former message input should not exist'
    );
  });

  it('can "paste"', async () => {
    clipboard.writeText('P');
    await sendNativeKeyboardEvent({
      text: 'v',
      cmdOrCtrl: true,
      noFocus: true
    });

    const messageElement = await window.client.$('p=P');
    await messageElement.waitForExist(1000);

    assert.ok(
      await messageElement.isExisting(),
      'the message input should exist.'
    );
  });

  it(
    'can "paste and match style"',
    async () => {
      await sendNativeKeyboardEvent({ text: 'a', cmdOrCtrl: true });
      await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });

      clipboard.writeText('Hello');

      await sendNativeKeyboardEvent({
        text: 'v',
        cmdOrCtrl: true,
        shift: true
      });

      const messageElement = await window.client.$('p=Hello');
      await messageElement.waitForExist(1000);

      assert.ok(
        await messageElement.isExisting(),
        'the message input should exist.'
      );

      // Delete it again
      await sendNativeKeyboardEvent({
        text: 'a',
        cmdOrCtrl: true,
        noFocus: true
      });
      await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });
    },
    {
      platforms: ['darwin']
    }
  );

  it('can "find"', async () => {
    await sendNativeKeyboardEvent({
      text: 'f',
      cmdOrCtrl: true,
      noFocus: true
    });

    const searchCloseBtn = await window.client.$(
      '.c-search__input_and_close__close'
    );
    await searchCloseBtn.waitForExist(1000);

    assert.ok(
      await searchCloseBtn.isExisting(),
      'the search box close button should exist.'
    );

    await searchCloseBtn.click();
  });

  // Disabled: Currently not available in Sonic

  // it(
  //   'can "use selection to find"',
  //   async () => {
  //     await enterMessage(window.client, 'selection');
  //     await sendNativeKeyboardEvent({
  //       text: 'a',
  //       cmdOrCtrl: true,
  //       noFocus: true
  //     });
  //     await sendNativeKeyboardEvent({ text: 'e', cmd: true, noFocus: true });

  //     const searchEntry = await window.client.$(`span=selection`);
  //     await searchEntry.waitForExist(1000);

  //     const searchCloseBtn = await window.client.$(
  //       '.c-search__input_and_close__close'
  //     );
  //     await searchCloseBtn.waitForExist(1000);

  //     assert.ok(await searchCloseBtn.isExisting(), 'the search box');

  //     await searchCloseBtn.click();
  //   },
  //   { platforms: ['darwin'] }
  // );

  it('can "zoom in"', async () => {
    await sendNativeKeyboardEvent({
      text: '+',
      cmdOrCtrl: true,
      noFocus: true
    });
    await wait(300);

    const zoomLevel = await getZoomLevel(window.client);

    assert.equal(zoomLevel, 1, 'zoom level indicator');
  });

  it('can "zoom in" (again)', async () => {
    await sendNativeKeyboardEvent({
      text: '+',
      cmdOrCtrl: true,
      noFocus: true
    });
    await wait(300);

    assert.equal(await getZoomLevel(window.client), 2, 'zoom level indicator');
  });

  it('can "zoom out"', async () => {
    await sendNativeKeyboardEvent({
      text: '-',
      cmdOrCtrl: true,
      noFocus: true
    });
    await wait(300);

    assert.equal(await getZoomLevel(window.client), 1, 'zoom level indicator');
  });

  it('can go back to "actual size"', async () => {
    await sendNativeKeyboardEvent({
      text: '0',
      cmdOrCtrl: true,
      noFocus: true
    });
    await wait(300);

    assert.equal(await getZoomLevel(window.client), 0, 'zoom level indicator');
  });

  it('can go "back" in history', async () => {
    await switchToTeam(0);
    await switchToChannel(window.client, 'ads');
    await switchToChannel(window.client, 'downloads');

    await sendNativeKeyboardEvent({
      text: '[',
      cmdOrCtrl: true,
      noFocus: true
    });
    assert.include(await window.client.getTitle(), 'ads');
  });

  it('can go "forward" in history', async () => {
    await sendNativeKeyboardEvent({
      text: ']',
      cmdOrCtrl: true,
      noFocus: true
    });
    assert.include(await window.client.getTitle(), 'downloads');
  });

  it('can display keyboard shortcuts', async () => {
    await sendNativeKeyboardEvent({ text: '/', cmdOrCtrl: true });

    const keyboardShortcutsTitle = await window.client.$('h3=Navigation');
    await keyboardShortcutsTitle.waitForExist(1000);
    assert.ok(await keyboardShortcutsTitle.isExisting());
  });

  it('can close keyboard shortcuts', async () => {
    await wait(300);
    await sendNativeKeyboardEvent({
      text: '/',
      cmdOrCtrl: true,
      noFocus: true
    });
    await wait(400);

    const keyboardShortcutsTitle = await window.client.$('h3=Navigation');
    assert.notOk(await keyboardShortcutsTitle.isDisplayed());
  });
};
