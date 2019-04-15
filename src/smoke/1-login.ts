import * as assert from 'assert';

import { SuiteMethod } from '../interfaces';
import { getSignInWindow } from '../helpers/get-sign-in-window';
import { openBrowserAndSignIn } from '../helpers/open-browser-and-sign-in';

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
    assert.equal(await button.getText(), 'Sign in');
  });

  it('signs in', async () => {
    assert.ok(await getSignInWindow(client));

    openBrowserAndSignIn();

    await new Promise(resolve => {
      setTimeout(() => {}, 500);
    });
  });
};
