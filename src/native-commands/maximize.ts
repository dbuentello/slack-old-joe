import * as path from 'path';

import { runAppleScriptFile } from '../helpers/applescript';
import { isMac, isWin } from '../helpers/os';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';

export async function maximize() {
  if (isMac()) {
    const scriptPath = path.join(
      __dirname,
      '../../static/applescript/maximize.scpt'
    );
    return runAppleScriptFile(scriptPath);
  }

  if (isWin()) {
    return sendNativeKeyboardEvent({ text: 'up', cmd: true });
  }
}
