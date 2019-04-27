import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { wait } from '../helpers/wait';
import { getTeamsCount } from '../helpers/get-teams-count';

export const test: SuiteMethod = async ({ it }) => {
  it('signs out', async () => {
    const numberOfTeams = await getTeamsCount();
    const browserViewHandle = await getBrowserViewHandle(window.client);
    assert.ok(browserViewHandle);

    // Try to sign out
    const teamMenu = await window.client.$('#team_menu');
    await teamMenu.click();
    // Animation
    await wait(1000);

    const signoutBtn = await window.client.$('*=Sign out');
    await signoutBtn.click();
    await wait(1000);

    // On Enterprise, we'll do this twice :D
    // const signoutBtnEnterprise = await window.client.$('*=Sign out');
    // if (signoutBtnEnterprise) {
    //   await signoutBtn.click();
    //   await wait(1000);
    // }

    // We hopefully lost a team, at least after a while
    await wait(3000);
    assert.ok(numberOfTeams > (await getTeamsCount()));
  });
};
