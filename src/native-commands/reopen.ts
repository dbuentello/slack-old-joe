import { runAppleScript } from '../utils/applescript';
import { isMac, isWin } from '../utils/os';
import { AppState } from '../renderer/state';
import { exec } from 'child_process';
import { wait } from '../utils/wait';

export async function reopen(appState: AppState) {
  if (isMac()) {
    return runAppleScript('tell application "Slack" to reopen');
  }

  if (isWin()) {
    exec(`${appState.appToTest} --test-type=webdriver`);
    await wait(1000);
  }
}
