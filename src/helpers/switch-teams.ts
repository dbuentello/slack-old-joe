import { sendNativeKeyboardEvent } from './send-keyboard-event';
import { clickWindowMenuItem } from './click-window-menu-item';

const PLATFORM_MODIFIER = process.platform === 'darwin'
    ? { cmd: true }
    : { ctrl: true };

export function switchToTeam(index: number) {
  return sendNativeKeyboardEvent({ ...PLATFORM_MODIFIER, text: index.toString() });
}

export async function selectNextTeamShortcut() {
  const options = process.platform === 'darwin'
    ? { text: '}', shift: true }
    : { text: '\u0009' };

  return sendNativeKeyboardEvent({ ...options, ...PLATFORM_MODIFIER });
}

export async function selectPreviousTeamShortcut() {
  const options = process.platform === 'darwin'
    ? { text: '{', shift: true }
    : { text: '\u0009', shift: true };

  return sendNativeKeyboardEvent({ ...options, ...PLATFORM_MODIFIER });
}

export async function selectNextTeamWindowMenu() {
  return clickWindowMenuItem('Window', 'Select Next Workspace');
}

export async function selectPreviousTeamWindowMenu() {
  return clickWindowMenuItem('Window', 'Select Previous Workspace');
}

export async function selectTeamWindowMenu(name: string) {
  return clickWindowMenuItem('Window', name);
}
