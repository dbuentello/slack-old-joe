import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import {
  getAboutBoxValue,
  openAboutBox,
  closeAboutBox
} from '../native-commands/mac-about-dialog';
import { wait } from '../utils/wait';
import { getPostWindowHandle } from '../helpers/get-posts-window';
import { switchToChannel } from '../helpers/switch-channel';
import { getAboutWindowHandle } from '../helpers/get-about-window';
import { getSonicWindow } from '../helpers/get-sonic-window';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  const expectedVersion = {
    simple: '',
    full: ''
  };

  beforeAll(async () => {
    await getSonicWindow(window.client);

    // Returns
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko)
    // AtomShell/3.4.1-beta3179ea19 Chrome/69.0.3497.128 Electron/4.1.3 Safari/537.36 Slack_SSB/3.4.1"
    const userAgent: string = await window.client.executeScript(
      'return navigator.userAgent',
      []
    );
    expectedVersion.simple = userAgent.slice(
      userAgent.indexOf('Slack_SSB') + 10
    );
    expectedVersion.full = userAgent.slice(
      userAgent.indexOf('AtomShell') + 10,
      userAgent.indexOf(' Chrome')
    );
  });

  it(
    'opens macOS "About" dialog and displays the correct version string',
    async () => {
      // Make sure that we make a blacklist of logs files we won't
      // accept because they already exist
      await openAboutBox();

      // What version do we expect?
      await getSonicWindow(window.client);

      const aboutBoxValue: string = await getAboutBoxValue();

      assert.ok(aboutBoxValue.includes(expectedVersion.simple), 'about dialog does not display the correct version.');

      if (expectedVersion.full.includes('alpha')) {
        assert.include(aboutBoxValue.toLowerCase(), 'alpha', 'version string for alpha not included');
      } else if (expectedVersion.full.includes('beta')) {
        assert.include(aboutBoxValue.toLowerCase(), 'beta', 'version string for beta not included');
      }

      // Close window
      await closeAboutBox();
    },
    { platforms: ['darwin'] }
  );

  it(
    'opens the Windows/Linux "About Slack" dialog',
    async () => {
      await openAboutBox();
      await wait(1000);

      const handle = await getAboutWindowHandle(window.client);

      assert.ok(handle, 'the about window handle is not visible.');

      const versionElement = await window.client.$('.AboutBox-version');
      await versionElement.waitForExist(1000);

      // Direct Download 3.4.1-beta PR6078/aa231d3 64-bit
      const versionText = await versionElement.getText();

      assert.include(versionText, expectedVersion.simple, `version does not match the expected. expected:${expectedVersion.simple} actual: ${versionText}`);

      if (expectedVersion.full.includes('alpha')) {
        assert.include(versionText.toLowerCase(), 'alpha', 'version string for alpha not included');
      } else if (expectedVersion.full.includes('beta')) {
        assert.include(versionText.toLowerCase(), 'beta', 'version string for beta not included');
      }
    },
    { platforms: ['win32'] }
  );

  it(
    'has a a "notices" link in the about window',
    async () => {
      const acknowledgements = await window.client.$(
        '.AboutBox-acknowledgements'
      );

      assert.ok(
        await acknowledgements.isDisplayed(),
        'visibility of the acknowledgements button'
      );

      await window.client.closeWindow();
    },
    { platforms: ['win32'] }
  );

  // Disabled: Posts don't work in Sonic (yet)
  //
  // it('creates a post window', async () => {
  //   // Switch to the posts channel
  //   await getSonicWindow(window.client);
  //   await switchToChannel(window.client, 'posts');

  //   // Open the plus menu, wait 100ms, create a new post
  //   const paperclipBtn = await window.client.$('.c-icon--paperclip');
  //   await paperclipBtn.moveTo();
  //   await wait(200);
  //   await paperclipBtn.click();
  //   await wait(200);
  //   await (await window.client.$('=Post')).click();
  //   await wait(1000);

  //   // Switch to the new post window
  //   const postsWindow = await getPostWindowHandle(window.client);
  //   assert.ok(postsWindow);

  //   // Title includes the word "Untitled"?
  //   assert.ok((await window.client.getTitle()).includes('Untitled'));
  // });

  // it(`can create a post that's saved`, async () => {
  //   const expectedText = Date.now().toString();

  //   // Focus and enter some text
  //   const shadowP = await window.client.$('p.shadow');
  //   await shadowP.waitForExist(5000);
  //   await shadowP.click();
  //   await wait(100);
  //   await window.client.sendKeys([...expectedText.split('')]);

  //   // Share
  //   await (await window.client.$('.space_btn_share')).click();
  //   await wait(300);

  //   // Name this post field
  //   await (await window.client.$(
  //     '#p-share_dialog__name_this_post_input'
  //   )).click();
  //   await window.client.sendKeys([...expectedText.split('')]);

  //   // Submit
  //   await (await window.client.$('button.c-dialog__go')).click();
  //   await wait(300);
  //   await window.client.execute('window.close()', []);

  //   // Back to the Window
  //   await getSonicWindow(window.client);

  //   // The message should show up
  //   const randomDesc = await window.client.$(`span=${expectedText}`);
  //   assert.ok(await randomDesc.waitForExist(1000));
  // });
};
