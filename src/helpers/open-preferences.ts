import { sendNativeKeyboardEvent } from './send-keyboard-event';
import { isMac } from './os';
import { getBrowserViewHandle } from './get-browser-view';
import { wait } from './wait';

export async function openPreferences(client: BrowserObject) {
  if (await getIsPreferencesOpen(client)) return;

  await getBrowserViewHandle(client);
  await sendNativeKeyboardEvent({
    cmd: isMac(),
    ctrl: !isMac(),
    text: ','
  });

  const prefencesModal = await client.$('.p-prefs_modal');
  await prefencesModal.waitForDisplayed(1000);

  return prefencesModal;
}

export async function closePreferences(client: BrowserObject) {
  if (!(await getIsPreferencesOpen(client))) return;
  await sendNativeKeyboardEvent({ text: 'escape' })
  await wait(500);
}

export async function getIsPreferencesOpen(client: BrowserObject): Promise<boolean> {
  const prefencesModal = await client.$('.p-prefs_modal');
  return prefencesModal.isExisting();
}
