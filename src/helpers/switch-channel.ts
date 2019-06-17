import { BrowserObject } from 'webdriverio';
import { wait } from '../utils/wait';

export async function switchToChannel(client: BrowserObject, channel: string) {
  const channelLink = await client.$(`=${channel}`);
  await channelLink.waitForExist(1500);
  await channelLink.moveTo();
  await channelLink.click();
  await wait(500);
}
