import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
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
import { smokeTeams } from '../smoke-teams';
import { wait } from '../helpers/wait';

export const test: SuiteMethod = async (client, { it, beforeEach }) => {
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
    await selectTeamWindowMenu(smokeTeams[0].name, client);
    const beforeTitle = await client.getTitle();
    assert.include(beforeTitle, smokeTeams[0].name);

    await selectTeamWindowMenu(smokeTeams[1].name, client);
    const afterTitle = await client.getTitle();
    assert.include(afterTitle, smokeTeams[1].name);
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
    assert.include(beforeTitle, smokeTeams[0].name);

    // In the dock, "Old Joe Two" should be number five from the bottom
    await clickDockMenuItem(5);
    await getBrowserViewHandle(client, 500);

    const afterTitle = await client.getTitle();
    assert.include(afterTitle, smokeTeams[1].name);
  });

  it('can select a workspace using the Quick Switcher', async () => {
    await switchToTeam(client, 1);
    await getBrowserViewHandle(client, 300);
    await openQuickSwitcher(client);
    await client.sendKeys([...smokeTeams[0].name.split('')]);
    await wait(100);
    await client.sendKeys(['\uE007']);
    await getBrowserViewHandle(client, 300);

    const afterTitle = await client.getTitle();
    assert.include(afterTitle, smokeTeams[0].name);
  });
};
