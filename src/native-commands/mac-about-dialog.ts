import { runAppleScript } from '../helpers/applescript';
import { clickWindowMenuItem } from '../helpers/click-window-menu-item';

const getAppleScriptValue = () =>
  `
tell application "Slack" to activate
tell application "System Events"
  tell front window of (first application process whose frontmost is true)
    return value of static text 2
  end tell
end tell
`.trim();

export async function getAboutBoxValue() {
  const script = getAppleScriptValue();
  return runAppleScript(script);
}

export async function openAboutBox() {
  return clickWindowMenuItem('Slack', 'About Slack');
}

const closeAboutBoxScriptValue = () =>
  `
tell application "Slack" to activate
tell application "System Events"
	tell process "Slack"
		click button 1 of window 1
	end tell
end tell`.trim();

export async function closeAboutBox() {
  const script = closeAboutBoxScriptValue();
  return runAppleScript(script);
}
