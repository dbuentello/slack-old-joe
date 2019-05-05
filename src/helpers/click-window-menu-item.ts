import * as robot from 'robotjs';

import { runAppleScript } from '../utils/applescript';
import { isWin, isMac } from '../utils/os';
import { focus } from '../native-commands/focus';
import { doTimes } from '../utils/do-times';
import { wait } from '../utils/wait';

const debug = require('debug')('old-joe');

export async function clickWindowMenuItem(clickList: Array<string>) {
  await focus();

  if (isMac()) {
    const script =
      clickList.length < 3
        ? getAppleScript(clickList[0], clickList[1])
        : getSubAppleScript(clickList[0], clickList[1], clickList[2]);

    return runAppleScript(script);
  }

  if (isWin()) {
    return clickWindowMenuItemWin(clickList);
  }
}

type MenuMapEntry = {
  index: number;
  items?: Record<string, MenuMapEntry>;
};

const getAppleScript = (menuName: string, itemName: string) =>
  `
tell application "System Events" to tell process "Slack"
	tell menu bar item "${menuName}" of menu bar 1
		click
		click menu item "${itemName}" of menu 1
	end tell
end tell
`.trim();

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

const menuMap: Record<string, MenuMapEntry> = {
  Window: {
    index: 2,
    items: {
      'Old Joe One': { index: 5 },
      'Old Joe Two': { index: 4 },
      'Select Next Workspace': { index: 3 },
      'Select Previous Workspace': { index: 2 }
    }
  },
  View: {
    index: 4,
    items: {
      Developer: {
        index: 1,
        items: {
          'Toggle Webapp DevTools': { index: 3 },
          'Toggle Electron DevTools': { index: 3 },
          'Reload Everything': { index: 2 },
          'Open Settings Editor': { index: 1 }
        }
      }
    }
  },
  Help: {
    index: 1,
    items: {
      'Check for Updates': { index: 6 },
      'Keyboard Shortcuts': { index: 5 },
      'Open Help Center': { index: 4 },
      Troubleshooting: {
        index: 3,
        items: {
          'Show Logs in Explorer': {
            index: 4
          },
          'Restart and Collect Net Logs…': {
            index: 3
          },
          'Clear Cache and Restart': {
            index: 2
          },
          'Reset App Data…': {
            index: 1
          }
        }
      },
      "What's new...": { index: 2 },
      'About Slack': { index: 1 }
    }
  }
};

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
async function clickWindowMenuItemWin(clickList: Array<string>) {
  // Make sure we're focused
  await focus();

  robot.keyTap('alt');
  await wait(500);

  let currentFocus = menuMap;
  for (const entry of clickList) {
    await performWinMenuAction(currentFocus[entry]);

    if (currentFocus[entry].items) {
      currentFocus = currentFocus[entry].items!;
    }
  }

  // Do the thing
  robot.keyTap('enter');
}

async function performWinMenuAction(item: MenuMapEntry) {
  debug(`Navigating to menu item`);

  await doTimes(item.index, async () => {
    robot.keyTap('up');
    await wait(250);
  });

  if (item.items) {
    // Go right
    robot.keyTap('right');
    await wait(250);
  }
}
