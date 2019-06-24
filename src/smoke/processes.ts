import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getRunningSlackProcessesCount } from '../helpers/get-running-slack-processes';
import { isWin } from '../utils/os';
import { appState } from '../renderer/state';
import { stopClientDriver, startClientDriver } from '../renderer/client-driver';

export const test: SuiteMethod = async ({ it }) => {
  it('leaves no processes behind after closing', async () => {
    // No need to be nice about it
    await stopClientDriver();

    // Wait until we have no processes
    const runningSlackProcessesCount = await getRunningSlackProcessesCount(appState);
    assert.equal(
      runningSlackProcessesCount,
      0,
      `number of running processes is ${runningSlackProcessesCount}, expected 0.`
    );

    // Restart the app
    await startClientDriver(false);
  });

  it('has the right number of processes while running (and not wildly more)', async () => {
    const processes = await getRunningSlackProcessesCount(appState);
    const expected = isWin() ? processes < 10 : processes < 7;

    assert.ok(expected, `number of Slack processes is more than expected (processes:${processes})`);
  });
};
