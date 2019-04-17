import * as assert from 'assert';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';

async function assertVideo(client: BrowserObject) {
  // Play the video
  await (await client.$('.c-message_attachment__video_play')).moveTo();
  await client.positionClick();

  // Expect the iframe to show up
  let iframe = await client.$('iframe');
  await iframe.waitForExist(2000);
  iframe = await client.$('iframe');

  // Expect the video to be playing
  const src = (await iframe.getProperty('src')) as string;
  assert.ok(src.includes('youtube.com'));
  assert.ok(src.includes('IEItOBG0r2g'));

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

export const test: SuiteMethod = async (
  client,
  { it, beforeAll, afterAll, beforeEach, afterEach }
) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('can switch to the #random channel', async () => {
    // Switch to the random channel
    (await client.$('=random')).click();

    // Wait for the description to show up
    const randomDesc = await client.$(
      'span=Non-work banter and water cooler conversation'
    );
    assert.ok(await randomDesc.waitForExist(1000));
  });

  it('can post a message', async () => {
    const msgInput = await client.$('#msg_input .ql-editor');
    const testValue = Date.now().toString();
    await msgInput.click();

    // Enter out time stamp, followed by the enter key
    await client.sendKeys([...testValue.split(''), '\uE007']);

    // The message should show up
    const randomDesc = await client.$(`span=${testValue}`);
    assert.ok(await randomDesc.waitForExist(1000));
  });

  it('can play a YouTube video', async () => {
    // Switch to the random channel
    await (await client.$('=ads')).click();

    // Wait for the description to show up
    const randomDesc = await client.$('span=Old Camel ads');
    assert.ok(await randomDesc.waitForExist(1000));

    await assertVideo(client);
  });
};
