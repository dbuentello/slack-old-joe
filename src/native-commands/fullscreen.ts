import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { isMac, isWin, isLinux } from '../utils/os';
import { wait } from '../utils/wait';

export async function fullscreen() {
  await sendNativeKeyboardEvent({
    text: 'f',
    cmd: isMac(),
    shift: isWin() || isLinux(),
    ctrl: true
  });
  await wait(350);
}
