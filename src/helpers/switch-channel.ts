import { BrowserObject } from 'webdriverio';
import { wait } from '../utils/wait';

export async function switchToChannel(
  client: BrowserObject,
  channel: string,
  { fuzzy = false }: { fuzzy?: boolean } = {}
) {
  const channelLink = await client.$(`${fuzzy ? '*' : ''}=${channel}`);
  await channelLink.waitForExist(1500);
  await channelLink.moveTo();
  await channelLink.click();
  await wait(500);
}
