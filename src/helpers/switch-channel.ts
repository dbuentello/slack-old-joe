import { BrowserObject } from 'webdriverio';

export async function switchToChannel(client: BrowserObject, channel: string) {
  const channelLink = await client.$(`=${channel}`);
  await channelLink.waitForExist(1500);
  await channelLink.click();
}
