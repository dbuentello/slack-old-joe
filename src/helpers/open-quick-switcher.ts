import { sendKeyboardEvent, KeyboardEventType } from './send-keyboard-event';
import { getSonicWindow } from './get-sonic-window';

import { BrowserObject } from 'webdriverio';

export async function openQuickSwitcher(client: BrowserObject) {
  await getSonicWindow(client);
  await sendKeyboardEvent(client, {
    cmd: process.platform === 'darwin',
    ctrl: process.platform !== 'darwin',
    type: KeyboardEventType.KEYDOWN,
    text: 'k'
  });
}
