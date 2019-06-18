import { getSonicWindow } from './get-sonic-window';

import { BrowserObject } from 'webdriverio';

export async function getPreference(client: BrowserObject, name: string) {
  await getSonicWindow(client);

  const script = `return window.desktop.app.getPreference("${name}")`;

  return await client.executeScript(script, []);
}
