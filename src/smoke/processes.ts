import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getRunningSlackPocessesCount } from '../helpers/get-running-slack-processes';
import { isWin } from '../helpers/os';
import { appState } from '../renderer/state';
import { waitForSlackClosed } from '../helpers/wait-until-slack-closed';

export const test: SuiteMethod = async ({ it }) => {
  it('leaves no processes behind after closing', async () => {
    await window.client.deleteSession();

    // Wait until we have no processes
    assert.ok(await waitForSlackClosed(appState.appToTest));

    // Restart the app
    await window.client.restart();
  });

  it('has the right number of processes (and not more or less)', async () => {
    const processes = getRunningSlackPocessesCount(appState.appToTest);
    const expected = isWin() ? 6 : 6;

    assert.equal(processes, expected, 'number of Slack processes');
  });
};
