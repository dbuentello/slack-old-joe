import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { clickWindowMenuItem } from '../helpers/click-window-menu-item';
import { getDevToolsWindowHandle } from '../helpers/get-devtools-window';
import { wait } from '../utils/wait';

export const test: SuiteMethod = async ({ it }) => {
  it('can open the webapp devtools via menu', async () => {
    await clickWindowMenuItem(['View', 'Developer', 'Toggle Webapp DevTools']);
    await wait(2000);

    const devToolsWindow = await getDevToolsWindowHandle(window.client);
    assert.ok(devToolsWindow, 'window handle for the dev tools');
  });

  it('can close the webapp devtools via menu', async () => {
    await clickWindowMenuItem(['View', 'Developer', 'Toggle Webapp DevTools']);
    await wait(2000);

    const devToolsWindow = await getDevToolsWindowHandle(window.client);
    assert.notOk(devToolsWindow, 'window handle for the devtools');
  });

  it('can open the Electron devtools via menu', async () => {
    await clickWindowMenuItem([
      'View',
      'Developer',
      'Toggle Electron DevTools'
    ]);
    await wait(2000);

    const devToolsWindow = await getDevToolsWindowHandle(window.client);
    assert.ok(devToolsWindow, 'window handle for the dev tools');
  });

  it('can close the Electron devtools via menu', async () => {
    await clickWindowMenuItem([
      'View',
      'Developer',
      'Toggle Electron DevTools'
    ]);
    await wait(2000);

    const devToolsWindow = await getDevToolsWindowHandle(window.client);
    assert.notOk(devToolsWindow, 'window handle for the devtools');
  });
};
