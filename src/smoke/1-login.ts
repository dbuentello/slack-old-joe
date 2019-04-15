import * as assert from 'assert';

import { SuiteMethod } from '../interfaces';
import { getSignInWindow } from '../helpers/get-sign-in-window';
import { openBrowserAndWaitForSignIn } from '../helpers/open-browser-and-sign-in';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { wait } from '../helpers/wait';
import { getTeamsCount } from '../helpers/get-teams-count';

export const test: SuiteMethod = async (
  client,
  { it, beforeAll, afterAll, beforeEach, afterEach }
) => {
  it('loads a sign-in window', async () => {
    assert.ok(await getSignInWindow(client));

    const url = await client.getUrl();
    assert.ok(url.startsWith('https://slack.com/ssb/first'));
  });

  it('has a visible sign-in button', async () => {
    assert.ok(await getSignInWindow(client));

    const button = await client.$('button');
    assert.ok(button);
    assert.equal(await button.getText(), 'Sign In');
  });

  it('signs in', async () => {
    assert.ok(await getSignInWindow(client));
    assert.ok(await openBrowserAndWaitForSignIn());
  });

  it('signs out', async () => {
    const numberOfTeams = await getTeamsCount();
    const { handle } = await getBrowserViewHandle(client);
    assert.ok(handle);

    // Try to sign out
    const teamMenu = await client.$('#team_menu');
    await teamMenu.click();
    // Animation
    await wait(1000);

    const signoutBtn = await client.$('*=Sign out');
    await signoutBtn.click();
    await wait(1000);

    // On Enterprise, we'll do this twice :D
    const signoutBtnEnterprise = await client.$('*=Sign out');
    if (signoutBtnEnterprise) {
      await signoutBtn.click();
      await wait(1000);
    }

    // We hopefully lost a team, at least after a while
    await wait(3000);
    assert.ok(numberOfTeams > (await getTeamsCount()));
  });
};
