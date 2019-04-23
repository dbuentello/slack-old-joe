import { sendNativeKeyboardEvent } from './send-keyboard-event';
import { clickWindowMenuItem } from './click-window-menu-item';
import { wait } from './wait';

const PLATFORM_MODIFIER =
  process.platform === 'darwin' ? { cmd: true } : { ctrl: true };

export function switchToTeam(index: number) {
  return sendNativeKeyboardEvent({
    ...PLATFORM_MODIFIER,
    text: index.toString()
  });
}

export async function selectNextTeamShortcut() {
  const options =
    process.platform === 'darwin'
      ? { text: '}', shift: true }
      : { text: '\u0009' };

  return sendNativeKeyboardEvent({ ...options, ...PLATFORM_MODIFIER });
}

export async function selectPreviousTeamShortcut() {
  const options =
    process.platform === 'darwin'
      ? { text: '{', shift: true }
      : { text: '\u0009', shift: true };

  return sendNativeKeyboardEvent({ ...options, ...PLATFORM_MODIFIER });
}

export async function selectNextTeamWindowMenu() {
  await clickWindowMenuItem('Window', 'Select Next Workspace');
  await wait(300);
}

export async function selectPreviousTeamWindowMenu() {
  await clickWindowMenuItem('Window', 'Select Previous Workspace');
  await wait(300);
}

export async function selectTeamWindowMenu(name: string) {
  await clickWindowMenuItem('Window', name);
  await wait(300);
}
