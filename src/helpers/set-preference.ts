import { getSonicWindow } from './get-sonic-window';

import { BrowserObject } from 'webdriverio';

export async function setPreference(
  client: BrowserObject,
  name: string,
  value: any
) {
  await getSonicWindow(client);

  const val =
    typeof value === 'string' ? `"${value.replace(/\\/g, '\\\\')}"` : value;

  const script = `return window.desktop.app.setPreference({ name: "${name}", value: ${val}})`;

  await client.executeScript(script, []);
}
