import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { focus } from './focus';
import { wait } from '../utils/wait';
import { isMac, isWin, isLinux } from '../utils/os';

export async function reload() {
  await focus();
  await wait(100);

  return sendNativeKeyboardEvent({
    text: 'r',
    cmd: isMac(),
    ctrl: isWin() || isLinux()
  });
}

export async function reloadEverything() {
  await focus();
  await wait(100);

  return sendNativeKeyboardEvent({
    text: 'r',
    cmd: isMac(),
    ctrl: isWin() || isLinux(),
    shift: true
  });
}
