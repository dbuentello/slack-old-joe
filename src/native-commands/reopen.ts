import { runAppleScript } from '../utils/applescript';
import { isMac, isWin } from '../utils/os';
import { AppState } from '../renderer/state';
import { launchWithArgs } from '../helpers/launch-with-args';

export async function reopen(appState: AppState) {
  if (isMac()) {
    return runAppleScript('tell application "Slack" to reopen');
  }

  if (isWin()) {
    return launchWithArgs(appState);
  }
}
