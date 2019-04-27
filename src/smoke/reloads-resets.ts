import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../helpers/wait';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { reload, reloadEverything } from '../native-commands/reload';
import { getRendererWindowHandle } from '../helpers/get-renderer-window';
import { switchToTeam } from '../helpers/switch-teams';

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('can reload a workspace', async () => {
    // Leave a breadcrumb to check that we've reloaded
    assert.ok(
      await client.executeScript('return window.__old_joe_was_here = true', [])
    );

    await reload();
    await wait(500);

    // Wait for the client ui
    await (await client.$('#client-ui')).waitForExist(10000);

    // Our breadcrumb should be gone now
    assert.ok(
      !(await client.executeScript('return window.__old_joe_was_here', []))
    );
  });

  it('can reload everything', async () => {
    // Leave a breadcrumb to check that we've reloaded (renderer)
    await getRendererWindowHandle(client);
    assert.ok(
      await client.executeScript('return window.__old_joe_was_here = true', [])
    );

    // Leave a breadcrumb to check that we've reloaded (webapp)
    await getBrowserViewHandle(client);
    assert.ok(
      await client.executeScript('return window.__old_joe_was_here = true', [])
    );

    await reloadEverything();
    await wait(500);

    // Wait for the client ui
    await (await client.$('#client-ui')).waitForExist(10000);

    // Our breadcrumb should be gone now
    assert.ok(
      !(await client.executeScript('return window.__old_joe_was_here', []))
    );
    await getRendererWindowHandle(client);
    assert.ok(
      !(await client.executeScript('return window.__old_joe_was_here', []))
    );
  });

  it('can still switch teams post-reload (via shortcut)', async () => {
    await switchToTeam(client, 1);

    let title = await client.getTitle();
    assert.include(title, 'Old Joe Two');

    await switchToTeam(client, 0);

    title = await client.getTitle();
    assert.include(title, 'Old Joe One');
  });
};
