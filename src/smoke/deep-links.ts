import { assert } from 'chai';
import { shell } from 'electron';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { smokeTeams, SMOKE_TEAMS } from '../smoke-teams';
import { switchToTeam } from '../helpers/switch-teams';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  it('can open a workspace via deep link', async () => {
    for (const { id, name } of smokeTeams) {
      shell.openExternal(`slack://open?team=${id}`);
      await getBrowserViewHandle(window.client, 300);
      assert.include(await window.client.getTitle(), name);
    }
  });

  it('can open a channel via deep link', async () => {
    await switchToTeam(window.client, 0);

    const teamId = smokeTeams[0].id;
    const channelId = `DJ0EJKRC7`;
    shell.openExternal(`slack://channel?team=${teamId}&id=${channelId}`);

    const dmTitle = await window.client.$('span*=(you)');
    await dmTitle.waitForExist(1000);

    assert.ok(await dmTitle.isDisplayed(), 'DM title is displayed');
  });

  it('can open a file via deep link', async () => {
    await switchToTeam(window.client, 0);

    const teamId = smokeTeams[0].id;
    const fileId = 'FHNDK7KAN';
    shell.openExternal(`slack://file?team=${teamId}&id=${fileId}`);

    const filesTitle = await window.client.$('div=Files');
    await filesTitle.waitForExist(1000);

    assert.ok(
      await filesTitle.isDisplayed(),
      'Files flexpane title is displayed'
    );
  });
};
