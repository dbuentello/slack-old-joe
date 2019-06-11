import { getBrowserViewHandle } from './get-browser-view';
import { sendKeyboardEvent, KeyboardEventType } from './send-keyboard-event';

import { BrowserObject } from 'webdriverio';

export async function openQuickSwitcher(client: BrowserObject) {
  await getBrowserViewHandle(client);
  await sendKeyboardEvent(client, {
    cmd: process.platform === 'darwin',
    ctrl: process.platform !== 'darwin',
    type: KeyboardEventType.KEYDOWN,
    text: 'k'
  });
}
