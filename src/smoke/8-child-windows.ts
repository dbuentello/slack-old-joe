import * as assert from 'assert';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import {
  getAboutBoxValue,
  openAboutBox,
  closeAboutBox
} from '../native-commands/mac-about-dialog';
import { wait } from '../helpers/wait';
import { getPostWindowHandle } from '../helpers/get-posts-window';

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('(Mac) opens about dialog and displays the correct version string', async () => {
    if (process.platform !== 'darwin') return;

    // Make sure that we make a blacklist of logs files we won't
    // accept because they already exist
    await openAboutBox();

    // What version do we expect?
    await getBrowserViewHandle(client);

    // Returns
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko)
    // AtomShell/3.4.1-beta3179ea19 Chrome/69.0.3497.128 Electron/4.1.3 Safari/537.36 Slack_SSB/3.4.1"
    const userAgent: string = await client.executeScript(
      'return navigator.userAgent',
      []
    );
    const aboutBoxValue: string = await getAboutBoxValue();
    const simpleVersion = userAgent.slice(userAgent.indexOf('Slack_SSB') + 10);
    const fullVersion = userAgent.slice(
      userAgent.indexOf('AtomShell') + 10,
      userAgent.indexOf(' Chrome')
    );

    console.log(aboutBoxValue, simpleVersion, fullVersion);

    assert.ok(aboutBoxValue.includes(simpleVersion));

    if (fullVersion.includes('alpha') || fullVersion.includes('beta')) {
      // Covers alpha, beta, etc
      assert.ok(
        aboutBoxValue.toLowerCase().includes('alpha') ||
          aboutBoxValue.includes('beta')
      );
    }

    // Close window
    await closeAboutBox();
  });

  it('creates a post window', async () => {
    // Switch to the posts channel
    await (await client.$('=posts')).click();

    // Open the plus menu, wait 100ms, create a new post
    await (await client.$('#primary_file_button')).click();
    await wait(100);
    await (await client.$('=Post')).click();
    await wait(1000);

    // Switch to the new post window
    const { handle } = await getPostWindowHandle(client);
    assert.ok(handle);

    // Title includes the word "Untitled"?
    assert.ok((await client.getTitle()).includes('Untitled'));
  });

  it(`can create a post that's saved`, async () => {
    const expectedText = Date.now().toString();

    // Focus and enter some text
    const shadowP = await client.$('p.shadow');
    await shadowP.waitForExist(5000);
    await shadowP.click();
    await wait(100);
    await client.sendKeys([...expectedText.split('')]);

    // Share
    await (await client.$('.space_btn_share')).click();
    await wait(300);

    // Name this post field
    await (await client.$('#p-share_dialog__name_this_post_input')).click();
    await client.sendKeys([...expectedText.split('')]);

    // Submit
    await (await client.$('button.c-dialog__go')).click();
    await wait(300);
    await client.execute('window.close()', []);

    // Back to the BrowserView
    await getBrowserViewHandle(client);

    // The message should show up
    const randomDesc = await client.$(`span=${expectedText}`);
    assert.ok(await randomDesc.waitForExist(1000));
  });
};
