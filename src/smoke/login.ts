import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getSignInWindow } from '../helpers/get-sign-in-window';
import { openBrowserAndWaitForSignIn } from '../helpers/open-browser-and-sign-in';
import { getRendererWindowHandle } from '../helpers/get-renderer-window';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { switchToTeam } from '../helpers/switch-teams';
import { smokeTeams } from '../smoke-teams';
import { centerMouse } from '../native-commands/center-mouse';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => centerMouse());

  it('opens and loads a sign-in window', async () => {
    assert.ok(await getSignInWindow(window.client));

    const url = await window.client.getUrl();
    assert.ok(
      url.startsWith('https://slack.com/ssb/first'),
      'Starts with slack.com/ssb/first'
    );
  });

  it('has a visible sign-in button', async () => {
    assert.ok(await getSignInWindow(window.client));

    const button = await window.client.$('button');
    assert.ok(button);
    assert.equal(await button.getText(), 'Sign In');
  });

  it('signs in', async () => {
    assert.ok(await getSignInWindow(window.client), 'sign-in window exists');
    assert.ok(
      await openBrowserAndWaitForSignIn(smokeTeams[0].url),
      'sign-in was successful'
    );
  });

  it('does not have a quick switcher', async () => {
    await getRendererWindowHandle(window.client);

    const body = await window.client.$('body');
    const html = await body.getHTML();
    const hasSidebar = html.includes('TeamSidebar');

    assert.ok(!hasSidebar);
  });

  it('signs into a second team', async () => {
    assert.ok(await openBrowserAndWaitForSignIn(smokeTeams[1].url));
  });

  it('has a quick switcher', async () => {
    await getRendererWindowHandle(window.client);

    const body = await window.client.$('body');
    const html = await body.getHTML();
    const hasSidebar = html.includes('TeamSidebar');

    assert.ok(hasSidebar);
  });

  it('can switch teams (via shortcut)', async () => {
    await getBrowserViewHandle(window.client);

    let title = await window.client.getTitle();
    assert.ok(title.includes('Old Joe Two'));

    await switchToTeam(window.client, 0);

    title = await window.client.getTitle();
    assert.include(title, 'Old Joe One');
  });
};
