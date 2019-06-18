import { isMac } from '../utils/os';
import { switchToTeam } from './switch-teams';
import { switchToChannel } from './switch-channel';
import { wait } from '../utils/wait';
import { sendClickElementRobot } from './send-pointer-event';

import * as robot from 'robotjs';
import { BrowserObject } from 'webdriverio';

/**
 * Clicks on a message with Cmd / Ctrl and shift to send a notification.
 *
 * @param {string} text
 */
export async function sendNotification(client: BrowserObject, text: string) {
  const cmdOrCtrl = isMac() ? 'command' : 'control';

  await switchToTeam(1);
  await switchToChannel(window.client, 'notify');

  await window.client.keys([cmdOrCtrl, 'Shift']);
  robot.keyToggle('shift', 'down', [cmdOrCtrl]);
  await wait(200);
  await sendClickElementRobot(client, `span=${text}`);
  await wait(200);
  robot.keyToggle('shift', 'up', [cmdOrCtrl]);
  await wait(300);
}
