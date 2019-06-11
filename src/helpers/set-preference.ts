import { getBrowserViewHandle } from './get-browser-view';

import { BrowserObject } from 'webdriverio';

export async function setPreference(
  client: BrowserObject,
  name: string,
  value: any
) {
  await getBrowserViewHandle(client);

  const val =
    typeof value === 'string' ? `"${value.replace(/\\/g, '\\\\')}"` : value;

  const script = `return window.desktop.app.setPreference({ name: "${name}", value: ${val}})`;

  await client.executeScript(script, []);
}
