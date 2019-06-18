import * as robot from 'robotjs';

import { BrowserObject } from 'webdriverio';
import { moveCursorToElement } from './move-cursor';
import { getModifierKeyCode, ModifierOptions } from './send-keyboard-event';

export const enum PointerEvents {
  MOUSEMOVE = 'mouseMoved',
  MOUSEDOWN = 'mousePressed',
  MOUSEUP = 'mouseReleased',
  MOUSEDOWNUP = 'mouseDownAndUp' // Custom
}

export interface PointerEventOptions {
  type: PointerEvents;
  touch?: boolean;
  x: number;
  y: number;
  rightClick?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  cmd?: boolean;
}

export function sendPointerEvent(
  client: BrowserObject,
  options: PointerEventOptions
) {
  const { type, touch, x, y, rightClick } = options;

  let command = '';
  const data = {
    type: type,
    button: rightClick ? 'right' : 'left',
    y: y,
    x: x,
    timestamp: Date.now(),
    clickCount: 1,
    modifiers: getModifierKeyCode(options)
  };

  // Won't work with scaled screens
  if (touch) {
    command = 'Input.emulateTouchFromMouseEvent';
  } else {
    command = 'Input.dispatchMouseEvent';
  }

  return client.sendCommand(command, data);
}

export interface SendClickElementOptions {
  selector: string;
  rightClick?: boolean;
  type?: PointerEvents;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  cmd?: boolean;
}

export async function sendClickElement(
  client: BrowserObject,
  options: SendClickElementOptions
) {
  const { rightClick, selector, type, alt, cmd, ctrl, shift } = options;
  const element = await client.$(selector);
  await element.waitForExist(1000);
  const location = await element.getLocation();

  await element.moveTo();

  let _type = type || PointerEvents.MOUSEDOWN;

  // If the type was "down and up", we'll now do the "down" part
  if (type === PointerEvents.MOUSEDOWNUP) {
    _type = PointerEvents.MOUSEDOWN;
  }

  await sendPointerEvent(client, {
    type: _type,
    // +2 so that we actually hit the element
    x: location.x + 2,
    y: location.y + 2,
    rightClick,
    alt,
    cmd,
    shift,
    ctrl
  });

  // If the type was "down and up", we'll now do the "up" part
  if (type === PointerEvents.MOUSEDOWNUP) {
    await sendClickElement(client, {
      ...options,
      type: PointerEvents.MOUSEUP
    });
  }
}

export async function sendClickElementRobot(
  client: BrowserObject,
  selector: string
) {
  await moveCursorToElement(client, selector);
  robot.mouseClick();
}
