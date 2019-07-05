import { isMac, isWin, isLinux } from '../utils/os';
import { runAppleScript } from '../utils/applescript';
import { findHwnds } from './find-hwnds';
import { findWindow } from './find-linux-window';

const tryGetYesTitleScript = () =>
  `
tell application "Slack" to reopen
tell application "System Events"
	tell UI element 3 of process "Slack"
		return title of button 1
	end tell
end tell`.trim();

/**
 * Is the sheet open? We just check if the sheet is open and has a "Yes" button
 *
 * @export
 * @returns
 */
export async function getIsResetAppDataSheetOpen() {
  if (isMac()) {
    let errored;
    let result;

    try {
      result = await runAppleScript(tryGetYesTitleScript());
    } catch (ignoredError) {
      console.log(ignoredError);
      errored = true;
    }

    return !errored && result === 'Yes';
  }

  if (isWin()) {
    return (await findHwnds('Reset Slack?')) > 0;
  }

  if (isLinux()) {
    return await findWindow('Reset Slack?');
  }

  return null;
}
