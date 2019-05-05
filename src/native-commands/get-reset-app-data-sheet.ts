import { isMac, isWin } from '../utils/os';
import { runAppleScript } from '../utils/applescript';
import { findHwnds } from './find-hwnds';

const tryGetYesTitleScript = () =>
  `
tell application "Slack" to activate
tell application "System Events"
	tell UI element 3 of (first application process whose frontmost is true)
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

    try {
      await runAppleScript(tryGetYesTitleScript());
    } catch (ignoredError) {
      errored = true;
    }

    return !errored;
  }

  if (isWin()) {
    return (await findHwnds('Reset Slack?')) > 0;
  }
}
