import { sendNativeKeyboardEvent } from './send-keyboard-event';
import { clickWindowMenuItem } from './click-window-menu-item';
import { getBrowserViewHandle } from './get-browser-view';

const PLATFORM_MODIFIER =
  process.platform === 'darwin' ? { cmd: true } : { ctrl: true };

export async function switchToTeam(index: number, client: BrowserObject) {
  await sendNativeKeyboardEvent({
    ...PLATFORM_MODIFIER,
    text: (index + 1).toString()
  });
  await getBrowserViewHandle(client, 300);
}

export async function selectNextTeamShortcut(client: BrowserObject) {
  const options =
    process.platform === 'darwin'
      ? { text: '}', shift: true }
      : { text: '\u0009' };

  await sendNativeKeyboardEvent({ ...options, ...PLATFORM_MODIFIER });
  await getBrowserViewHandle(client, 300);
}

export async function selectPreviousTeamShortcut(client: BrowserObject) {
  const options =
    process.platform === 'darwin'
      ? { text: '{', shift: true }
      : { text: '\u0009', shift: true };

  await sendNativeKeyboardEvent({ ...options, ...PLATFORM_MODIFIER });
  await getBrowserViewHandle(client, 300);
}

export async function selectNextTeamWindowMenu(client: BrowserObject) {
  await clickWindowMenuItem('Window', 'Select Next Workspace');
  await getBrowserViewHandle(client, 300);
}

export async function selectPreviousTeamWindowMenu(client: BrowserObject) {
  await clickWindowMenuItem('Window', 'Select Previous Workspace');
  await getBrowserViewHandle(client, 300);
}

export async function selectTeamWindowMenu(
  name: string,
  client: BrowserObject
) {
  await clickWindowMenuItem('Window', name);
  await getBrowserViewHandle(client, 300);
}
