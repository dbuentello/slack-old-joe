import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../helpers/wait';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import {
  selectNextTeamWindowMenu,
  selectPreviousTeamWindowMenu,
  selectTeamWindowMenu,
  selectNextTeamShortcut,
  selectPreviousTeamShortcut,
  switchToTeam
} from '../helpers/switch-teams';
import { clickDockMenuItem } from '../helpers/click-dock-menu-item';
import { openQuickSwitcher } from '../helpers/open-quick-switcher';

export const test: SuiteMethod = async (
  client,
  { it, beforeAll, afterAll, beforeEach, afterEach }
) => {
  beforeEach(async () => {
    await getBrowserViewHandle(client);
  });

  it('can select the "next" workspace using the window menu', async () => {
    await selectNextTeamWindowMenu(client);

    const beforeTitle = await client.getTitle();

    await selectNextTeamWindowMenu(client);

    const afterTitle = await client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select the "previous" workspace using the window menu', async () => {
    const beforeTitle = await client.getTitle();

    await selectPreviousTeamWindowMenu(client);

    const afterTitle = await client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select a workspace by name using the window menu', async () => {
    await selectTeamWindowMenu('Old Joe', client);
    const beforeTitle = await client.getTitle();
    assert.notInclude(beforeTitle, 'Old Joe Two');
    assert.include(beforeTitle, 'Old Joe');

    await selectTeamWindowMenu('Old Joe Two', client);
    const afterTitle = await client.getTitle();
    assert.include(afterTitle, 'Old Joe Two');
  });

  it('can select the "next" workspace using the shortcut', async () => {
    const beforeTitle = await client.getTitle();
    await selectNextTeamShortcut(client);
    const afterTitle = await client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select the "previous" workspace using the shortcut', async () => {
    const beforeTitle = await client.getTitle();
    await selectPreviousTeamShortcut(client);
    const afterTitle = await client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select a workspace using the Dock menu', async () => {
    if (process.platform !== 'darwin') return;

    // In the dock, "Old Joe" should be number six from the bottom
    await clickDockMenuItem(6);
    await getBrowserViewHandle(client, 500);

    const beforeTitle = await client.getTitle();
    assert.ok(beforeTitle.includes('Old Joe') && !beforeTitle.includes('Two'));

    // In the dock, "Old Joe Two" should be number five from the bottom
    await clickDockMenuItem(5);
    await getBrowserViewHandle(client, 500);

    const afterTitle = await client.getTitle();
    assert.ok(afterTitle.includes('Old Joe Two'));
  });

  it('can select a workspace using the Quick Switcher', async () => {
    await switchToTeam(2, client);
    await getBrowserViewHandle(client, 300);
    await openQuickSwitcher(client);
    await client.sendKeys([...'Old Joe'.split(''), '\uE007']);
    await getBrowserViewHandle(client, 300);

    const afterTitle = await client.getTitle();
    assert.ok(afterTitle.includes('Old Joe') && !afterTitle.includes('Two'));
  });
};
