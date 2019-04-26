import { sendKeyboardEvent } from './send-keyboard-event';
import { isMac } from './os';

export async function openPreferences(client: BrowserObject) {
  await sendKeyboardEvent(client, {
    cmd: isMac(),
    ctrl: !isMac(),
    text: '/'
  });

  const prefencesModal = await client.$('TODO: MODAL');
  await prefencesModal.waitForDisplayed(1000);

  return prefencesModal;
}
