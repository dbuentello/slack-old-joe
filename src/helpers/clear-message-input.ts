import { sendNativeKeyboardEvent } from './send-keyboard-event';

/**
 * Attempts to clear the message input
 *
 * @export
 * @param {BrowserObject} client
 */
export async function clearMessageInput(client: BrowserObject) {
  const msgInput = await client.$('#msg_input .ql-editor');

  await focus();
  await msgInput.click();
  await sendNativeKeyboardEvent({ text: 'a', cmdOrCtrl: true, noFocus: true });
  await sendNativeKeyboardEvent({ text: 'delete', noFocus: true });
}
