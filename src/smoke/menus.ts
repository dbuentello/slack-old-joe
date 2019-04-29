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
import { wait } from '../utils/wait';

export const test: SuiteMethod = async ({ it, beforeEach }) => {
  beforeEach(async () => {
    await getBrowserViewHandle(window.client);
  });

  it('can select the "next" workspace using the window menu', async () => {
    await selectNextTeamWindowMenu(window.client);

    const beforeTitle = await window.client.getTitle();

    await selectNextTeamWindowMenu(window.client);

    const afterTitle = await window.client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select the "previous" workspace using the window menu', async () => {
    const beforeTitle = await window.client.getTitle();

    await selectPreviousTeamWindowMenu(window.client);

    const afterTitle = await window.client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select a workspace by name using the window menu', async () => {
    await selectTeamWindowMenu(smokeTeams[0].name, window.client);
    const beforeTitle = await window.client.getTitle();
    assert.include(beforeTitle, smokeTeams[0].name);

    await selectTeamWindowMenu(smokeTeams[1].name, window.client);
    const afterTitle = await window.client.getTitle();
    assert.include(afterTitle, smokeTeams[1].name);
  });

  it('can select the "next" workspace using the shortcut', async () => {
    const beforeTitle = await window.client.getTitle();
    await selectNextTeamShortcut(window.client);
    const afterTitle = await window.client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select the "previous" workspace using the shortcut', async () => {
    const beforeTitle = await window.client.getTitle();
    await selectPreviousTeamShortcut(window.client);
    const afterTitle = await window.client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select a workspace using the Dock menu', async () => {
    // In the dock, "Old Joe" should be number six from the bottom
    await clickDockMenuItem(6);
    await getBrowserViewHandle(window.client, 500);

    const beforeTitle = await window.client.getTitle();
    assert.include(beforeTitle, smokeTeams[0].name);

    // In the dock, "Old Joe Two" should be number five from the bottom
    await clickDockMenuItem(5);
    await getBrowserViewHandle(window.client, 500);

    const afterTitle = await window.client.getTitle();
    assert.include(afterTitle, smokeTeams[1].name);
  }, [ 'darwin' ]);

  it('can select a workspace using the Quick Switcher', async () => {
    await switchToTeam(window.client, 1);
    await getBrowserViewHandle(window.client, 300);
    await openQuickSwitcher(window.client);
    await window.client.sendKeys([...smokeTeams[0].name.split('')]);
    await wait(100);
    await window.client.sendKeys(['\uE007']);
    await getBrowserViewHandle(window.client, 300);

    const afterTitle = await window.client.getTitle();
    assert.include(afterTitle, smokeTeams[0].name);
  });
};
