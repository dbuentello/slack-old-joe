import * as assert from 'assert';

import { SuiteMethod } from '../interfaces';
import { getSignInWindow } from '../helpers/get-sign-in-window';
import {
  openBrowserAndWaitForSignIn,
  TestTeams
} from '../helpers/open-browser-and-sign-in';
import { getRendererWindowHandle } from '../helpers/get-renderer-window';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { switchTeam } from '../helpers/switch-teams';
import { wait } from '../helpers/wait';

export const test: SuiteMethod = async (client, { it }) => {
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
    assert.ok(await openBrowserAndWaitForSignIn(TestTeams[0]));
  });

  it('does not have a quick switcher', async () => {
    await getRendererWindowHandle(client);

    const body = await client.$('body');
    const html = await body.getHTML();
    const hasSidebar = html.includes('TeamSidebar');

    assert.ok(!hasSidebar);
  });

  it('signs into a second team', async () => {
    assert.ok(await openBrowserAndWaitForSignIn(TestTeams[1]));
  });

  it('has a quick switcher', async () => {
    await getRendererWindowHandle(client);

    const body = await client.$('body');
    const html = await body.getHTML();
    const hasSidebar = html.includes('TeamSidebar');

    assert.ok(hasSidebar);
  });

  it('can switch teams', async () => {
    await getBrowserViewHandle(client);

    let title = await client.getTitle();
    assert.ok(title.includes('Old Joe Two'));

    await switchTeam(1);
    await wait(300);
    await getBrowserViewHandle(client);

    title = await client.getTitle();
    assert.ok(!title.includes('Old Joe Two') && title.includes('Old Joe'));
  });
};
