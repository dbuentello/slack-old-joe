import { BrowserObject } from 'webdriverio';

export async function getZoomLevel(client: BrowserObject): Promise<number> {
  return client.execute('return window.desktop.app.getZoom()');
}
