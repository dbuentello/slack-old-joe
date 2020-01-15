import { assert } from 'chai';

import { SuiteMethod, JoeBrowserObject } from '../interfaces';
import { switchToChannel } from '../helpers/switch-channel';
import { enterMessage } from '../helpers/enter-message';
import { getSonicWindow } from '../helpers/get-sonic-window';
import { switchToTeam } from '../helpers/switch-teams';
import { wait } from '../utils/wait';
import { getDockBadgeText } from '../helpers/get-dock-badge-text';
import { sendClickElement, PointerEvents } from '../helpers/send-pointer-event';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';

async function assertVideo(client: JoeBrowserObject) {
  // Play the video
  const playBtn = await client.$('.c-message_attachment__video_play');
  await playBtn.moveTo();
  await playBtn.click();

  // Expect the iframe to show up
  let iframe = await client.$('iframe');
  await iframe.waitForExist(2000);

  // Expect the video to be playing
  const src = (await iframe.getProperty('src')) as string;
  assert.ok(src.includes('youtube.com'), "src does not include 'youtube.com'");
  assert.ok(src.includes('IEItOBG0r2g'), "src does not include 'IEItOBG0r2g'");

  await wait(1000);

  // Switch to the iframe
  await client.switchToFrame(iframe);

  // Expect "playing mode"
  const player = await client.$('.playing-mode');
  await player.waitForExist(3000);

  // Stop the video
  await (await client.$('body')).click();

  const fullscreenBtn = await client.$('.ytp-fullscreen-button');
  await fullscreenBtn.moveTo();
  await fullscreenBtn.click();

  await client.waitUntil(async () => {
    const bodyWidth = await client.executeScript(
      'return window.outerWidth',
      []
    );
    return screen.width === bodyWidth;
  }, 2000);

  await fullscreenBtn.moveTo();
  await fullscreenBtn.click();

  // Switch back
  await client.switchToParentFrame();
}

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getSonicWindow(window.client);
    await switchToTeam(0);
  });

  it('can switch to the #random channel', async () => {
    // Switch to the random channel
    await switchToChannel(window.client, 'random');

    // Wait for the description to show up
    const randomDesc = await window.client.$(
      'span=Non-work banter and water cooler conversation'
    );
    assert.ok(
      await randomDesc.waitForExist(1000),
      'could not switch to the #random channel.'
    );
  });

  it('can post a message', async () => {
    const testValue = Date.now().toString();
    await enterMessage(window.client, testValue, true);

    // The message should show up
    const randomDesc = await window.client.$(`div=${testValue}`);
    assert.ok(await randomDesc.waitForExist(1000), 'could not post a message.');
  });

  it('can play a YouTube video', async () => {
    await switchToChannel(window.client, 'ads');

    // Wait for the description to show up
    const randomDesc = await window.client.$('span=Old Camel ads');
    assert.ok(await randomDesc.waitForExist(1000));

    await assertVideo(window.client);
  });

  it(
    'dock badge reflects unread state',
    async () => {
      // Switch to the random channel
      await switchToChannel(window.client, 'unreads');

      // Badge should not be on the icon
      await window.client.waitUntil(
        async () => null === (await getDockBadgeText()),
        5000,
        'unable to clear the dock badge'
      );

      // Mark a message as unread
      await sendClickElement(window.client, {
        selector: '[data-qa="message_content"]',
        type: PointerEvents.MOUSEDOWNUP,
        alt: true
      });

      // Badge should now be visible
      await window.client.waitUntil(
        async () => '•' === (await getDockBadgeText()),
        undefined,
        '• is not displayed in the badge for unread state'
      );
    },
    { platforms: ['darwin'] }
  );

  it(
    'dock badge reflects notification state',
    async () => {
      await switchToChannel(window.client, 'Slackbot');

      // Mark a message as unread
      await sendClickElement(window.client, {
        selector: '[data-qa="message_content"]',
        type: PointerEvents.MOUSEDOWNUP,
        alt: true
      });

      await window.client.waitUntil(
        async () => '1' === (await getDockBadgeText()),
        undefined,
        '1 is not displayed in the badge for notification state'
      );

      // Clear the unread
      await sendNativeKeyboardEvent({ text: 'escape' });
    },
    { platforms: ['darwin'] }
  );
};
