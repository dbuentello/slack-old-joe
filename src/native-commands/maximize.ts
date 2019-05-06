import * as path from 'path';

import { runAppleScriptFile } from '../utils/applescript';
import { isMac, isWin } from '../utils/os';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';

export async function maximize() {
  if (isMac()) {
    const scriptPath = path.join(
      __dirname,
      '../../static/applescript/maximize.scpt'
    );
    return runAppleScriptFile(scriptPath);
  }

  // Windows, Linux
  return sendNativeKeyboardEvent({ text: 'up', cmd: true });
}
