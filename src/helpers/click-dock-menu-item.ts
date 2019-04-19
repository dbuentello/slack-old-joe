import { runAppleScript } from './applescript';

const getAppleScript = (itemIndexFromBottom: number) => `
tell application "Dock"
	activate
end tell
tell application "System Events"
	tell process "Dock"
		set frontmost to true
		activate
		tell list 1
			perform action "AXShowMenu" of UI element "Slack"
			delay 1
			repeat ${itemIndexFromBottom + 1} times -- count number of items to the one you want
				key code 126 -- up arrow
				-- key code 125 -- down arrow
			end repeat
			delay 1
			repeat 2 times
				key code 36 -- return key
			end repeat
		end tell
	end tell
end tell
`.trim();

export async function clickDockMenuItem(itemIndexFromBottom: number) {
	if (process.platform === 'darwin') {
		const script = getAppleScript(itemIndexFromBottom);
		return runAppleScript(script);
	}
}