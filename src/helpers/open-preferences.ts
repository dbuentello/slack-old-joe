import { sendNativeKeyboardEvent } from './send-keyboard-event';
import { isMac } from '../utils/os';
import { getBrowserViewHandle } from './get-browser-view';
import { wait } from '../utils/wait';

export async function openPreferences(
  client: BrowserObject,
  preferenceGroup?: string
) {
  await getBrowserViewHandle(client);

  if (!(await getIsPreferencesOpen(client))) {
    await sendNativeKeyboardEvent({
      cmd: isMac(),
      ctrl: !isMac(),
      text: ','
    });
  };

  const prefencesModal = await client.$('.p-prefs_modal');
  await prefencesModal.waitForDisplayed(1000);

  if (preferenceGroup) {
    const advancedButton = await window.client.$(`button=${preferenceGroup}`);
    await advancedButton.click();
    await wait(200);
  }

  return prefencesModal;
}

export async function closePreferences(client: BrowserObject) {
  if (!(await getIsPreferencesOpen(client))) return;
  const closeBtn = await client.$('.c-fullscreen_modal__close');
  await closeBtn.click();
  await wait(500);
}

export async function getIsPreferencesOpen(
  client: BrowserObject
): Promise<boolean> {
  const prefencesModal = await client.$('.p-prefs_modal');
  return prefencesModal.isExisting();
}
