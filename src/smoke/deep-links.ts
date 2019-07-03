import { assert } from 'chai';
import { shell } from 'electron';

import { SuiteMethod } from '../interfaces';
import { smokeTeams } from '../smoke-teams';
import { switchToTeam } from '../helpers/switch-teams';
import { getSonicWindow } from '../helpers/get-sonic-window';
import { wait } from '../utils/wait';
import { launchWithArgs } from '../helpers/launch-with-args';
import { appState } from '../renderer/state';
import { isMac, isLinux } from '../utils/os';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  function openDeepLink(link: string) {
    if (isMac()) {
      return shell.openExternal(link);
    }

    // We used to use shell.openExternal, but Slack would
    // launch the "normal" Slack side-by-side with the "devMode"
    // Slack.
    return launchWithArgs(appState, link);
  }

  beforeAll(async () => {
    await getSonicWindow(window.client);
  });

  // (Disabled: Not available in Sonic as of 6/16)
  // it('can open a workspace via deep link', async () => {
  //   for (const { id, name } of smokeTeams) {
  //     shell.openExternal(`slack://open?team=${id}`);
  //     await wait(1000);
  //     assert.include(await window.client.getTitle(), name);
  //   }
  // });

  it('can open a channel via deep link', async () => {
    await switchToTeam(0);

    const teamId = smokeTeams[0].id;
    const channelId = `DJ0EJKRC7`;
    await openDeepLink(`slack://channel?team=${teamId}&id=${channelId}`);

    const dmTitle = await window.client.$('span*=(you)');
    await dmTitle.waitForExist(1000);

    assert.ok(await dmTitle.isDisplayed(), 'DM title is not displayed');
  });

  it('can open a file via deep link', async () => {
    await switchToTeam(0);

    const teamId = smokeTeams[1].id;
    const fileId = 'FHNDK7KAN';
    await openDeepLink(`slack://file?team=${teamId}&id=${fileId}`);

    const filesTitle = await window.client.$('div=Files');
    await filesTitle.waitForExist(2000);

    assert.ok(
      await filesTitle.isDisplayed(),
      'files flex pane title is not displayed'
    );
  });
};
