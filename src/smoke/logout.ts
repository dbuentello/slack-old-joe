import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { getTeamsCount } from '../helpers/get-teams-count';
import { signOut } from '../helpers/sign-out';
import { getSignInWindow } from '../helpers/get-sign-in-window';

export const test: SuiteMethod = async ({ it }) => {
  it('signs out', async () => {
    const numberOfTeams = await getTeamsCount();
    await signOut(window.client);

    // We hopefully lost a team, at least after a while
    await wait(3000);
    assert.ok(numberOfTeams > (await getTeamsCount()));
  });

  it('opens the sign-in window when signing out of the last team ', async () => {
    await signOut(window.client);

    // Give Slack a second to realize we have no teams
    await wait(1000);

    const signInWindowHandle = await getSignInWindow(window.client);
    assert.ok(signInWindowHandle, 'sign in window handle');
  });
};
