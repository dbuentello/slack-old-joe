import * as assert from 'assert';

import { isMac } from '../utils/os';
import { runAppleScript } from '../utils/applescript';

const tryGetYesTitleScript = () =>
  `
tell application "Slack" to activate
tell application "System Events"
	tell UI element 3 of (first application process whose frontmost is true)
		return title of button 2
	end tell
end tell`.trim();

/**
 * Is the sheet open? We just check if the sheet is open and has a "Yes" button
 *
 * @export
 * @returns
 */
export async function getIsNetLogSheetOpen() {
  if (isMac()) {
    let errored;

    try {
      const title = await runAppleScript(tryGetYesTitleScript());
      assert.equal(title, 'Restart Slack');
    } catch (ignoredError) {
      console.log(ignoredError);
      errored = true;
    }

    return !errored;
  }
}
