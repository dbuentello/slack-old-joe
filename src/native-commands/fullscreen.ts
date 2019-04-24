import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { isMac, isWin, isLinux } from '../helpers/os';
import { wait } from '../helpers/wait';

export async function fullscreen() {
  await sendNativeKeyboardEvent({
    text: 'f',
    cmd: isMac(),
    shift: isWin() || isLinux(),
    ctrl: true
  });
  await wait(350);
}
