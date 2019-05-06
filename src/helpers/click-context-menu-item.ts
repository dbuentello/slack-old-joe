import * as robot from 'robotjs';

import { isMac } from '../utils/os';
import { runAppleScript } from '../utils/applescript';
import { doTimes } from '../utils/do-times';
import { wait } from '../utils/wait';

const getAppleScript = (itemIndexFromBottom: number) =>
  `
tell application "System Events"
  repeat ${itemIndexFromBottom +
    1} times -- count number of items to the one you want
    key code 126 -- up arrow
    -- key code 125 -- down arrow
  end repeat
  delay 1
  key code 36 -- return key
end tell
`.trim();

export async function clickContextMenuItem(itemIndexFromBottom: number) {
  if (isMac()) {
    return runAppleScript(getAppleScript(itemIndexFromBottom));
  }

  await doTimes(itemIndexFromBottom + 1, async () => {
    robot.keyTap('up');
    await wait(250);
  });

  robot.keyTap('enter');
  await wait(250);
}
