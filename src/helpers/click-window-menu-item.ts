import { runAppleScript } from './applescript';

const getAppleScript = (menuName: string, itemName: string) => `
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
