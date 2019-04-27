import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getRunningSlackPocessesCount } from '../helpers/get-running-slack-processes';
import { isWin } from '../helpers/os';
import { appState } from '../renderer/state';

export const test: SuiteMethod = async ({ it }) => {
  it('has the right number of processes (and not more or less)', async () => {
    const processes = getRunningSlackPocessesCount(appState.appToTest);
    const expected = isWin() ? 6 : 6;

    assert.equal(processes, expected, 'number of Slack processes');
  });
};
