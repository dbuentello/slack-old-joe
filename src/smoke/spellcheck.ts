import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { switchToTeam } from '../helpers/switch-teams';
import { switchToChannel } from '../helpers/switch-channel';
import { wait } from '../utils/wait';
import { enterMessage } from '../helpers/enter-message';
import { sendClickElement } from '../helpers/send-pointer-event';
import {
  sendKeyboardEvent,
  sendNativeKeyboardEvent
} from '../helpers/send-keyboard-event';
import { doTimes } from '../utils/do-times';
import { clearMessageInput } from '../helpers/clear-message-input';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await switchToTeam(window.client, 0);
  });

  it('corrects misspelled words and replaces on correction via context menu', async () => {
    await switchToChannel(window.client, 'spellcheck');
    await wait(300);
    await enterMessage(window.client, 'mispelled');
    await focus();
    await wait(1000);

    await sendClickElement(window.client, 'p=mispelled', true);
    await wait(200);
    await sendNativeKeyboardEvent({ text: 'down', noFocus: true });
    await wait(200);
    await sendNativeKeyboardEvent({ text: 'enter', noFocus: true });

    const messageElement = await window.client.$('p=misspelled');
    await messageElement.waitForExist(1000);

    assert.ok(messageElement, 'text did not get corrected');

    // Hit backspace ten times
    await doTimes(10, () =>
      sendKeyboardEvent(window.client, {
        text: 'Backspace'
      })
    );
  }, {
    cleanup: () => clearMessageInput(window.client),
    retries: 3
  });
};
