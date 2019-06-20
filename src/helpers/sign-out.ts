import { wait } from '../utils/wait';
import { focus } from '../native-commands/focus';

import { BrowserObject } from 'webdriverio';
import { getSonicWindow } from './get-sonic-window';

export async function signOut(client: BrowserObject) {
  await focus();
  await getSonicWindow(client);

  // Try to sign out
  const teamMenu = await client.$('.p-classic_nav__team_header__content');
  await teamMenu.click();
  // Animation
  await wait(1000);

  const signoutBtn = await client.$('button[data-qa=sign-out]');
  await signoutBtn.click();
  await wait(1000);
}
