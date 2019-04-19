import * as assert from 'assert';

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
    const beforeTitle = await client.getTitle();

    await selectNextTeamWindowMenu();
    await wait(300);

    await getBrowserViewHandle(client);
    const afterTitle = await client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select the "previous" workspace using the window menu', async () => {
    const beforeTitle = await client.getTitle();

    await selectPreviousTeamWindowMenu();
    await wait(300);

    await getBrowserViewHandle(client);
    const afterTitle = await client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select a workspace by name using the window menu', async () => {
    await selectTeamWindowMenu('Old Joe');
    await wait(200);

    const beforeTitle = await client.getTitle();
    assert.ok(beforeTitle.includes('Old Joe') && !beforeTitle.includes('Two'));

    await selectTeamWindowMenu('Old Joe Two');
    await wait(200);
    await getBrowserViewHandle(client);

    const afterTitle = await client.getTitle();
    assert.ok(afterTitle.includes('Old Joe Two'));
  });

  it('can select the "next" workspace using the shortcut', async () => {
    const beforeTitle = await client.getTitle();

    await selectNextTeamShortcut();
    await wait(300);

    await getBrowserViewHandle(client);
    const afterTitle = await client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select the "previous" workspace using the shortcut', async () => {
    const beforeTitle = await client.getTitle();

    await selectPreviousTeamShortcut();
    await wait(300);

    await getBrowserViewHandle(client);
    const afterTitle = await client.getTitle();

    assert.notEqual(beforeTitle, afterTitle);
  });

  it('can select a workspace using the Dock menu', async () => {
    if (process.platform !== 'darwin') return;

    // In the dock, "Old Joe" should be number six from the bottom
    await clickDockMenuItem(6);
    await wait(500);
    await getBrowserViewHandle(client);

    const beforeTitle = await client.getTitle();
    assert.ok(beforeTitle.includes('Old Joe') && !beforeTitle.includes('Two'));

    // In the dock, "Old Joe Two" should be number five from the bottom
    await clickDockMenuItem(5);
    await wait(500);
    await getBrowserViewHandle(client);

    const afterTitle = await client.getTitle();
    assert.ok(afterTitle.includes('Old Joe Two'));
  });

  it('can select a workspace using the Quick Switcher', async () => {
    await switchToTeam(2);
    await wait(250);
    await getBrowserViewHandle(client);
    await openQuickSwitcher(client);
    await client.sendKeys([...'Old Joe'.split(''), '\uE007']);
    await wait(250);
    await getBrowserViewHandle(client);

    const afterTitle = await client.getTitle();
    assert.ok(afterTitle.includes('Old Joe') && !afterTitle.includes('Two'));
  });
};
