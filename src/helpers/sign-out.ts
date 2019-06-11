import { getBrowserViewHandle } from './get-browser-view';
import { wait } from '../utils/wait';
import { focus } from '../native-commands/focus';

import { BrowserObject } from 'webdriverio';

export async function signOut(client: BrowserObject) {
  await focus();
  await getBrowserViewHandle(client);

  // Try to sign out
  const teamMenu = await client.$('#team_menu');
  await teamMenu.click();
  // Animation
  await wait(1000);

  const signoutBtn = await client.$('*=Sign out');
  await signoutBtn.click();
  await wait(1000);
}
