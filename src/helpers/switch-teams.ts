import { sendNativeKeyboardEvent } from './send-keyboard-event';
import { clickWindowMenuItem } from './click-window-menu-item';
import { wait } from '../utils/wait';

const PLATFORM_MODIFIER =
  process.platform === 'darwin' ? { cmd: true } : { ctrl: true };

export async function switchToTeam(index: number) {
  await sendNativeKeyboardEvent({
    ...PLATFORM_MODIFIER,
    text: (index + 1).toString()
  });

  await wait(600);
}

export async function selectNextTeamShortcut() {
  const options =
    process.platform === 'darwin'
      ? { text: '}', shift: true }
      : { text: '\u0009' };

  await sendNativeKeyboardEvent({ ...options, ...PLATFORM_MODIFIER });
  await wait(300);
}

export async function selectPreviousTeamShortcut() {
  const options =
    process.platform === 'darwin'
      ? { text: '{', shift: true }
      : { text: '\u0009', shift: true };

  await sendNativeKeyboardEvent({ ...options, ...PLATFORM_MODIFIER });
  await wait(300);
}

export async function selectNextTeamWindowMenu() {
  await clickWindowMenuItem(['Window', 'Select Next Workspace']);
  await wait(300);
}

export async function selectPreviousTeamWindowMenu() {
  await clickWindowMenuItem(['Window', 'Select Previous Workspace']);
  await wait(300);
}

export async function selectTeamWindowMenu(name: string) {
  await clickWindowMenuItem(['Window', name]);
  await wait(300);
}
