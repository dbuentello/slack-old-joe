import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getSignInWindow } from '../helpers/get-sign-in-window';
import {
  openBrowserAndWaitForSignIn,
} from '../helpers/open-browser-and-sign-in';
import { getRendererWindowHandle } from '../helpers/get-renderer-window';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { switchToTeam } from '../helpers/switch-teams';
import { smokeTeams } from '../smoke-teams';

export const test: SuiteMethod = async (client, { it }) => {
  it('opens and loads a sign-in window', async () => {
    assert.ok(await getSignInWindow(client));

    const url = await client.getUrl();
    assert.ok(
      url.startsWith('https://slack.com/ssb/first'),
      'Starts with slack.com/ssb/first'
    );
  });

  it('has a visible sign-in button', async () => {
    assert.ok(await getSignInWindow(client));

    const button = await client.$('button');
    assert.ok(button);
    assert.equal(await button.getText(), 'Sign In');
  });

  it('signs in', async () => {
    assert.ok(await getSignInWindow(client), 'sign-in window exists');
    assert.ok(
      await openBrowserAndWaitForSignIn(smokeTeams[0].url),
      'sign-in was successful'
    );
  });

  it('does not have a quick switcher', async () => {
    await getRendererWindowHandle(client);

    const body = await client.$('body');
    const html = await body.getHTML();
    const hasSidebar = html.includes('TeamSidebar');

    assert.ok(!hasSidebar);
  });

  it('signs into a second team', async () => {
    assert.ok(await openBrowserAndWaitForSignIn(smokeTeams[1].url));
  });

  it('has a quick switcher', async () => {
    await getRendererWindowHandle(client);

    const body = await client.$('body');
    const html = await body.getHTML();
    const hasSidebar = html.includes('TeamSidebar');

    assert.ok(hasSidebar);
  });

  it('can switch teams (via shortcut)', async () => {
    await getBrowserViewHandle(client);

    let title = await client.getTitle();
    assert.ok(title.includes('Old Joe Two'));

    await switchToTeam(1, client);

    title = await client.getTitle();
    assert.include(title, 'Old Joe One');
  });
};
