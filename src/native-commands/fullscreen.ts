import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';

export async function fullscreen() {
  if (process.platform === 'darwin') {
    return sendNativeKeyboardEvent({ text: 'f', cmd: true, ctrl: true });
  }

  if (process.platform === 'win32' || process.platform === 'linux') {
    return sendNativeKeyboardEvent({ text: 'f', shift: true, ctrl: true });
  }
}
