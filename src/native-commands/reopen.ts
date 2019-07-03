import { runAppleScript } from '../utils/applescript';
import { isMac, isWin, isLinux } from '../utils/os';
import { AppState } from '../renderer/state';
import { launchWithArgs } from '../helpers/launch-with-args';

export async function reopen(appState: AppState) {
  if (isMac()) {
    return runAppleScript('tell application "Slack" to reopen');
  }

  if (isWin() || isLinux()) {
    return launchWithArgs(appState);
  }

  // if (isLinux()) {
  //   // rip

  // }

}
