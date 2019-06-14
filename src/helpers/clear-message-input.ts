import { sendNativeKeyboardEvent } from './send-keyboard-event';

import { BrowserObject } from 'webdriverio';

/**
 * Attempts to clear the message input
 *
 * @export
 * @param {BrowserObject} client
 */
export async function clearMessageInput(client: BrowserObject) {
  const msgInput = await client.$('.p-message_input .ql-editor');

  await focus();
  await msgInput.click();
  await sendNativeKeyboardEvent({ text: 'a', cmdOrCtrl: true, noFocus: true });
  await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });
}
