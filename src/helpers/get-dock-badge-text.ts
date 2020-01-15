import { runAppleScript } from '../utils/applescript';

const getAppleScript = () =>
  `
tell application "System Events"
  tell process "Dock"
	  get value of attribute "AXStatusLabel" of UI element "Slack" of list 1
  end tell
end tell
`.trim();

export async function getDockBadgeText() {
  if (process.platform === 'darwin') {
    const script = getAppleScript();
    const ret = await runAppleScript(script);
    if (ret === 'missing value') return null;
    return ret;
  }
}
