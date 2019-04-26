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

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('has working spellcheck', async () => {
    await switchToChannel(client, 'spellcheck');
    await wait(200);
    await enterMessage(client, 'mispelled');
    await wait(200);

    // Todo: Get the correct selector
    await sendClickElement(client, 'mispelled', true);
    // Todo: Use the keyboard to select the corrected spelling

    const messageElement = await client.$('');
    const text = await messageElement.getText();

    assert.equal(text, 'misspelled', 'text did not get corrected');
  });

  // Todo: Do it again, but in a German channel?
};
