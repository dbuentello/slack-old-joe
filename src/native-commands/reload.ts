import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { focus } from './focus';
import { wait } from '../helpers/wait';

export async function reload() {
  if (process.platform === 'darwin') {
    await focus;
    await wait(100);
    return sendNativeKeyboardEvent({ text: 'r', cmd: true });
  }
}

export async function reloadEverything() {
  if (process.platform === 'darwin') {
    await focus;
    await wait(100);
    return sendNativeKeyboardEvent({ text: 'r', cmd: true, shift: true });
  }
}