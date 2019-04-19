import { getBrowserViewHandle } from './get-browser-view';
import { sendKeyboardEvent, KeyboardEventType } from './send-keyboard-event';

export async function openQuickSwitcher(client: BrowserObject) {
  await getBrowserViewHandle(client);

  await sendKeyboardEvent(client, {
    cmd: process.platform === 'darwin',
    ctrl: process.platform !== 'darwin',
    type: KeyboardEventType.KEYDOWN,
    text: 'k'
  });
}
