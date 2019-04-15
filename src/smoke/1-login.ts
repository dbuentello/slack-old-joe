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
  it('opens and loads a sign-in window', async () => {
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
};
