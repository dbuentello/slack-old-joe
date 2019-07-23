import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getSignInWindow } from '../helpers/get-sign-in-window';
import { openBrowserAndWaitForSignIn } from '../helpers/open-browser-and-sign-in';
import { switchToTeam } from '../helpers/switch-teams';
import { smokeTeams } from '../smoke-teams';
import { centerMouse } from '../native-commands/center-mouse';
import { getSonicWindow } from '../helpers/get-sonic-window';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => centerMouse());

  it('opens and loads a sign-in window', async () => {
    assert.ok(
      await getSignInWindow(window.client),
      'unable to fetch sign in window.'
    );

    const url = await window.client.getUrl();
    assert.ok(
      url.startsWith('https://app.slack.com/ssb/first'),
      'Starts with app.slack.com/ssb/first'
    );
  });

  it('has a visible sign-in button', async () => {
    assert.ok(await getSignInWindow(window.client));

    const button = await window.client.$('button');
    assert.ok(button, 'button is not present.');
    assert.equal(
      await button.getText(),
      'Sign In',
      "button text should be: 'Sign in'"
    );
  });

  it('signs in', async () => {
    assert.ok(await getSignInWindow(window.client), 'sign-in window exists');
    assert.ok(
      await openBrowserAndWaitForSignIn(smokeTeams[1].url),
      'should be able to sign in.'
    );
  });

  it('does not have a team switcher', async () => {
    await getSonicWindow(window.client);

    const sidebar = await window.client.$('div[aria-label=Teams]');

    assert.ok(
      !(await sidebar.isDisplayed()),
      'has a team sidebar, should have none'
    );
  });

  it('signs into a second team', async () => {
    assert.ok(
      await openBrowserAndWaitForSignIn(smokeTeams[0].url),
      'should be able to sign into second team.'
    );
  });

  it('has a team switcher', async () => {
    await getSonicWindow(window.client);

    const sidebar = await window.client.$('div[aria-label=Teams]');

    assert.ok(
      await sidebar.isDisplayed(),
      'has no team sidebar, should have one'
    );
  });

  it('can switch teams (via shortcut)', async () => {
    await getSonicWindow(window.client);
    await switchToTeam(0);

    let title = await window.client.getTitle();
    assert.ok(
      title.includes('Old Joe One'),
      `title does not include \'Old Joe One\', got \'${title}\' instead.`
    );

    await switchToTeam(1);

    title = await window.client.getTitle();
    assert.include(
      title,
      'Old Joe Two',
      `title does not include \'Old Joe Two\', got \'${title}\' instead.`
    );
  });
};
