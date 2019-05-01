import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getRunningSlackProcessesCount } from '../helpers/get-running-slack-processes';
import { isWin } from '../utils/os';
import { appState } from '../renderer/state';

export const test: SuiteMethod = async ({ it }) => {
  it('leaves no processes behind after closing', async () => {
    await window.client.stop();

    // Wait until we have no processes
    assert.equal(
      await getRunningSlackProcessesCount(appState),
      0,
      'number of running processes'
    );

    // Restart the app
    await window.client.restart();
  });

  it('has the right number of processes while running (and not more or less)', async () => {
    const processes = await getRunningSlackProcessesCount(appState);
    const expected = isWin() ? 9 : 6;

    assert.equal(processes, expected, 'number of Slack processes');
  });
};
