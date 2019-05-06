import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { switchToTeam } from '../helpers/switch-teams';
import { switchToChannel } from '../helpers/switch-channel';
import { wait } from '../utils/wait';
import { enterMessage } from '../helpers/enter-message';
import {
  sendKeyboardEvent,
  sendNativeKeyboardEvent
} from '../helpers/send-keyboard-event';
import { doTimes } from '../utils/do-times';
import { clearMessageInput } from '../helpers/clear-message-input';
import { isWin } from '../utils/os';
import { setSelection } from '../helpers/set-selection';
import { reopen } from '../native-commands/reopen';
import { appState } from '../renderer/state';
import { openContextMenuForElement } from '../helpers/open-context-menu';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await switchToTeam(window.client, 0);

    if (isWin()) {
      await reopen(appState);
    }
  });

  it(
    'corrects misspelled words and replaces on correction via context menu',
    async () => {
      await switchToChannel(window.client, 'spellcheck');
      await wait(300);
      await enterMessage(window.client, 'mispelled');
      await focus();
      await wait(1000);

      // On Windows, we need to first select the element
      if (isWin()) {
        await setSelection(window.client, '#msg_input .ql-editor > p')
      }

      await openContextMenuForElement(window.client, 'p=mispelled');
      await wait(200);
      await sendNativeKeyboardEvent({ text: 'down', noFocus: true });
      await wait(200);
      await sendNativeKeyboardEvent({ text: 'enter', noFocus: true });

      const messageElement = await window.client.$('p=misspelled');
      await messageElement.waitForExist(1000);

      assert.ok(messageElement, 'corrected message elemt');
    },
    {
      cleanup: () => clearMessageInput(window.client),
      retries: 3
    }
  );
};
