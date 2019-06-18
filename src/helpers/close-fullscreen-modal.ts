import { BrowserObject } from 'webdriverio';

export async function closeFullscreenModal(client: BrowserObject) {
  const closeBtn = await client.$('button.c-fullscreen_modal__close');
  await closeBtn.waitForExist(1000);
  await closeBtn.click();
}
