import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { reload } from '../native-commands/reload';
import { switchToTeam } from '../helpers/switch-teams';
import { clickWindowMenuItem } from '../helpers/click-window-menu-item';
import { waitUntilSlackReady } from '../helpers/wait-until-slack-ready';
import { switchToChannel } from '../helpers/switch-channel';
import { enterMessage } from '../helpers/enter-message';
import { getSonicWindow } from '../helpers/get-sonic-window';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getSonicWindow(window.client);
  });

  it('can reload a workspace', async () => {
    // Leave a breadcrumb to check that we've reloaded
    assert.ok(
      await window.client.executeScript(
        'return window.__old_joe_was_here = true',
        []
      )
    );

    await reload();
    await wait(500);

    // Wait for the client ui
    await (await window.client.$('.p-client_container')).waitForExist(10000);

    // Our breadcrumb should be gone now
    assert.ok(
      !(await window.client.executeScript(
        'return window.__old_joe_was_here',
        []
      ))
    );
  });

  it('can still switch teams post-reload (via shortcut)', async () => {
    await wait(1000);
    await switchToTeam(0);
    await wait(300);

    let title = await window.client.getTitle();
    assert.include(title, 'Old Joe Two');

    await switchToTeam(1);

    title = await window.client.getTitle();
    assert.include(title, 'Old Joe One');
  });

  it('can "Clear Cache and Restart"', async () => {
    await clickWindowMenuItem([
      'Help',
      'Troubleshooting',
      'Clear Cache and Restart'
    ]);

    // A bit of wait padding on both sides to make things more robust
    await wait(5000);
    await waitUntilSlackReady(window.client, false);
    await wait(3000);
  });

  it('can still switch teams post-reset (via shortcut)', async () => {
    await switchToTeam(0);

    let title = await window.client.getTitle();
    assert.include(title, 'Old Joe Two');

    await switchToTeam(1);

    title = await window.client.getTitle();
    assert.include(title, 'Old Joe One');
  });

  it('can switch to the #random channel post-reset', async () => {
    // Switch to the random channel
    await switchToChannel(window.client, 'random');

    // Wait for the description to show up
    const randomDesc = await window.client.$(
      'span=Non-work banter and water cooler conversation'
    );
    assert.ok(await randomDesc.waitForExist(1000));
  });

  it('can post a message post-reset', async () => {
    const testValue = Date.now().toString();
    await enterMessage(window.client, testValue, true);

    // The message should show up
    const randomDesc = await window.client.$(`span=${testValue}`);
    assert.ok(await randomDesc.waitForExist(1000));
  });
};
