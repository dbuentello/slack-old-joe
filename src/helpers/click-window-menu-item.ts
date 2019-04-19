import { runAppleScript } from './applescript';

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
  if (process.platform === 'darwin') {
    const script = getAppleScript(menuName, itemName);
    return runAppleScript(script);
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
    const script = getSubAppleScript(menuName, subMenuName, itemName);
    return runAppleScript(script);
  }
}
