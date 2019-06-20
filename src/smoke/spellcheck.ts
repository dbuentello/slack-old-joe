import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { switchToTeam } from '../helpers/switch-teams';
import { switchToChannel } from '../helpers/switch-channel';
import { wait } from '../utils/wait';
import { enterMessage } from '../helpers/enter-message';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { clearMessageInput } from '../helpers/clear-message-input';
import { isWin } from '../utils/os';
import { setSelection } from '../helpers/set-selection';
import { reopen } from '../native-commands/reopen';
import { appState } from '../renderer/state';
import { openContextMenuForElement } from '../helpers/open-context-menu';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await switchToTeam(1);

    if (isWin()) {
      await reopen(appState);
    }
  });

  it(
    'corrects misspelled words and replaces on correction via context menu',
    async () => {
      const selector = 'div.ql-editor > p';

      await switchToChannel(window.client, 'spellcheck');
      await wait(300);
      await enterMessage(window.client, 'mispelled');
      await focus();
      await wait(1000);

      // On Windows, we need to first select the element
      if (isWin()) {
        await setSelection(window.client, selector);
      }

      await openContextMenuForElement(window.client, selector);
      await wait(200);
      await sendNativeKeyboardEvent({ text: 'down', noFocus: true });
      await wait(200);
      await sendNativeKeyboardEvent({ text: 'enter', noFocus: true });

      const messageElement = await window.client.$(selector);
      await messageElement.waitForExist(1000);

      assert.equal(
        await messageElement.getText(),
        'misspelled',
        'corrected message element'
      );
    },
    {
      cleanup: () => clearMessageInput(window.client),
      retries: 3,
      platforms: ['win32', 'darwin']
    }
  );
};
