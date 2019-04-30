import { getBrowserViewHandle } from './get-browser-view';

export async function getPreference(client: BrowserObject, name: string) {
  await getBrowserViewHandle(client);

  const script = `return window.desktop.app.getPreference("${name}")`;

  return await client.executeScript(script, []);
}
