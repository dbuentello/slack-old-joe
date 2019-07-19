import { isMac, isWin } from '../utils/os';
import { switchToTeam } from './switch-teams';
import { switchToChannel } from './switch-channel';
import { wait } from '../utils/wait';
import { sendClickElement, PointerEvents } from './send-pointer-event';

import { BrowserObject } from 'webdriverio';

/**
 * Clicks on a message with Cmd / Ctrl and shift to send a notification.
 *
 * @param {string} text
 */
export async function sendNotification(client: BrowserObject, text: string) {
  await switchToTeam(0);
  await switchToChannel(window.client, 'notify');

  await wait(200);
  await sendClickElement(client, {
    selector: `span=${text}`,
    type: PointerEvents.MOUSEDOWNUP,
    cmd: isMac(),
    shift: true,
    ctrl: isWin()
  });
  await wait(200);
}
