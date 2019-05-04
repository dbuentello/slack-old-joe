import { isMac } from '../utils/os';

import { runAppleScript } from '../utils/applescript';

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
  //await focus();

  if (isMac()) {
    return runAppleScript(getAppleScript(itemIndexFromBottom));
  }
}
