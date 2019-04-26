import * as robot from 'robotjs';
import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { selectNextTeamShortcut } from '../helpers/switch-teams';
import { openPreferences } from '../helpers/open-preferences';
import { isWin } from '../helpers/os';
import { switchToChannel } from '../helpers/switch-channel';
import { wait } from '../helpers/wait';
import { enterMessage } from '../helpers/enter-message';
import { sendClickElement } from '../helpers/send-pointer-event';
import { sendKeyboardEvent } from '../helpers/send-keyboard-event';
import { doTimes } from '../helpers/do-times';

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('has working spellcheck', async () => {
    await switchToChannel(client, 'spellcheck');
    await wait(300);
    await enterMessage(client, 'mispelled');
    await focus();
    await wait(1000);

    await sendClickElement(client, 'p=mispelled', true);
    await wait(200);
    await robot.keyTap('down');
    await wait(200);
    await robot.keyTap('enter');

    const messageElement = await client.$('p=misspelled');
    await messageElement.waitForExist(1000);

    assert.ok(messageElement, 'text did not get corrected');

    // Hit backspace ten times
    await doTimes(10, () => sendKeyboardEvent(client, {
      text: 'Backspace'
    }));
  });
};
