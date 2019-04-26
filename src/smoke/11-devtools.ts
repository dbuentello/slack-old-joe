import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { clickWindowSubMenuItem } from '../helpers/click-window-menu-item';
import { getDevToolsWindowHandle } from '../helpers/get-devtools-window';
import { wait } from '../helpers/wait';

export const test: SuiteMethod = async (client, { it }) => {
  it('can open the webapp devtools via menu', async () => {
    await clickWindowSubMenuItem('View', 'Developer', 'Toggle Webapp DevTools');
    await wait(300);

    const { handle } = await getDevToolsWindowHandle(client);
    assert.ok('DevTools have opened', handle);
  });

  it('can close the webapp devtools via menu', async () => {
    await clickWindowSubMenuItem('View', 'Developer', 'Toggle Webapp DevTools');
    await wait(300);

    const { handle } = await getDevToolsWindowHandle(client);
    assert.notOk('DevTools have closed', handle);
  });

  it('can open the Electron devtools via menu', async () => {
    await clickWindowSubMenuItem('View', 'Developer', 'Toggle Electron DevTools');
    await wait(300);

    const { handle } = await getDevToolsWindowHandle(client);
    assert.ok('DevTools have opened', handle);
  });

  it('can close the Electron devtools via menu', async () => {
    await clickWindowSubMenuItem('View', 'Developer', 'Toggle Electron DevTools');
    await wait(300);

    const { handle } = await getDevToolsWindowHandle(client);
    assert.notOk('DevTools have closed', handle);
  });
};
