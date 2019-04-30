import * as robot from 'robotjs';

import { runAppleScript } from '../utils/applescript';
import { isWin, isMac } from '../utils/os';
import { focus } from '../native-commands/focus';
import { doTimes } from '../utils/do-times';
import { wait } from '../utils/wait';

const getAppleScript = (menuName: string, itemName: string) =>
  `
tell application "System Events" to tell process "Slack"
	tell menu bar item "${menuName}" of menu bar 1
		click
		click menu item "${itemName}" of menu 1
	end tell
end tell
`.trim();

export async function clickWindowMenuItem(menuName: string, itemName: string) {
  await focus();

  if (isMac()) {
    const script = getAppleScript(menuName, itemName);
    return runAppleScript(script);
  }

  if (isWin()) {
    return clickWindowMenuItemWin(menuName, itemName);
  }
}

/**
 * Keep it simple and stupid: For now, we'll do this with the keyboard
 * 1 File
 * 2 Edit
 * 3 View
 * 4 History
 * 5 Window
 * 6 Help
 *
 * We'll add these as we go along. The way this works: For the main index,
 * press the up arrow key N times. Then press the right arrow key. Then, press
 * the up arrow key N times.
 */
async function clickWindowMenuItemWin(menuName: string, itemName: string) {
  const menuMap = {
    Window: {
      index: 2,
      items: {
        'Old Joe One': 5,
        'Old Joe Two': 4,
        'Select Next Workspace': 3,
        'Select Previous Workspace': 2
      }
    },
    Help: {
      index: 1,
      items: {
        'Check for Updates': 6,
        'Keyboard Shortcuts': 5,
        'Open Help Center': 4,
        'Troubleshooting': 3,
        'What\'s new...': 2,
        'About Slack': 1
      }
    }
  };

  if (menuMap[menuName] && menuMap[menuName].items[itemName]) {
    // Make sure we're focused
    await focus();

    robot.keyTap('alt');
    await wait(500);

    // Go up n times
    await doTimes(menuMap[menuName].index, async () => {
      robot.keyTap('up');
      await wait(500);
    });

    // Go right
    robot.keyTap('right');
    await wait(500);

    // Go up n times
    await doTimes(menuMap[menuName].items[itemName], async () => {
      robot.keyTap('up');
      await wait(500);
    });

    // Do the thing
    robot.keyTap('enter');
  } else {
    throw new Error(`menuMap doesn't know ${menuName} or ${itemName}`);
  }
}

const getSubAppleScript = (
  menuName: string,
  subMenuName: string,
  itemName: string
) =>
  `
tell application "System Events" to tell process "Slack"
	click menu item "${itemName}" of menu 1 of menu item "${subMenuName}" of menu 1 of menu bar item "${menuName}" of menu bar 1
end tell
`.trim();

export async function clickWindowSubMenuItem(
  menuName: string,
  subMenuName: string,
  itemName: string
) {
  if (process.platform === 'darwin') {
    await focus();
    const script = getSubAppleScript(menuName, subMenuName, itemName);
    return runAppleScript(script);
  }
}
