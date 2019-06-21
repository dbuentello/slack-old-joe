import { exec } from 'child_process';

import { AppState } from '../renderer/state';
import { wait } from '../utils/wait';

export async function launchWithArgs(
  appState: AppState,
  ...args: Array<string>
) {
  exec(`${appState.appToTest} --test-type=webdriver ${args.join(' ')}`);
  await wait(1000);
}
