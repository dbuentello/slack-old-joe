import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { getTeamsCount } from '../helpers/get-teams-count';
import { getRendererWindowHandle } from '../helpers/get-renderer-window';
import { signOut } from '../helpers/sign-out';
import { getSignInWindow } from '../helpers/get-sign-in-window';
import { SMOKE_TEAMS, smokeTeams } from '../smoke-teams';

export const test: SuiteMethod = async ({ it }) => {
  it('signs out', async () => {
    const numberOfTeams = await getTeamsCount();
    await signOut(window.client);

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

  it('removed the quick switcher, now that we have one team', async () => {
    await getRendererWindowHandle(window.client);

    const body = await window.client.$('body');
    const html = await body.getHTML();
    const hasSidebar = html.includes('TeamSidebar');

    assert.ok(!hasSidebar);
  });

  it('opens the sign-in window when signing out of the last team ', async () => {
    await signOut(window.client);

    // Give Slack a second to realize we have no teams
    await wait(1000);

    const signInWindowHandle = await getSignInWindow(window.client);
    assert.ok(signInWindowHandle, 'sign in window handle');
  });

  it('removed the cookies and asks for sign-in before opening a team', async () => {
    await getSignInWindow(window.client);
    await window.client.navigateTo(
      `https://${smokeTeams[0].url}.slack.com/messages`
    );

    const url = await window.client.getUrl();
    const expected = `https://${smokeTeams[0].url}.slack.com/?redir=%2Fmessages`;

    assert.equal(url, expected, 'the url');
  });
};
