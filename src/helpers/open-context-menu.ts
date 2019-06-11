import { wait } from '../utils/wait';
import { sendClickElement, PointerEvents } from './send-pointer-event';

import { BrowserObject } from 'webdriverio';

/**
 * Opens the context menu for a given element.
 *
 * @export
 * @param {BrowserObject} client
 * @param {string} selector
 * @param {number} [waitFor=300]
 */
export async function openContextMenuForElement(
  client: BrowserObject,
  selector: string,
  waitFor: number = 300
) {
  await wait(waitFor);
  await sendClickElement(client, selector, true, PointerEvents.MOUSEDOWNUP);
  await wait(waitFor);
}
