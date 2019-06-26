import { assert } from 'chai';

import { SuiteMethod, JoeBrowserObject } from '../interfaces';
import { switchToChannel } from '../helpers/switch-channel';
import { enterMessage } from '../helpers/enter-message';
import { getSonicWindow } from '../helpers/get-sonic-window';

async function assertVideo(client: JoeBrowserObject) {
  // Play the video
  const playBtn = await client.$('.c-message_attachment__video_play');
  await playBtn.moveTo();
  await playBtn.click();

  // Expect the iframe to show up
  let iframe = await client.$('iframe');
  await iframe.waitForExist(2000);
  iframe = await client.$('iframe');

  // Expect the video to be playing
  const src = (await iframe.getProperty('src')) as string;
  assert.ok(src.includes('youtube.com'), "src does not include 'youtube.com'");
  assert.ok(src.includes('IEItOBG0r2g'), "src does not include 'IEItOBG0r2g'");

  // Switch to the iframe
  await client.switchToFrame(iframe);

  // Expect "playing mode"
  let player = await client.$('.playing-mode');
  await player.waitForExist(2000);

  // Stop the video
  await (await client.$('body')).click();

  // Switch back
  await client.switchToParentFrame();
}

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getSonicWindow(window.client);
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
    const randomDesc = await window.client.$(`span=${testValue}`);
    assert.ok(await randomDesc.waitForExist(1000), 'could not post a message.');
  });

  it('can play a YouTube video', async () => {
    // Switch to the random channel
    await switchToChannel(window.client, 'ads');

    // Wait for the description to show up
    const randomDesc = await window.client.$('span=Old Camel ads');
    assert.ok(await randomDesc.waitForExist(1000));

    await assertVideo(window.client);
  });
};
