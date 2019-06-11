import { BrowserObject } from 'webdriverio';

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
    clickCount: 1
  };

  // Won't work with scaled screens
  if (touch) {
    command = 'Input.emulateTouchFromMouseEvent';
  } else {
    command = 'Input.dispatchMouseEvent';
  }

  return client.sendCommand(command, data);
}

export async function sendClickElement(
  client: BrowserObject,
  selector: string,
  rightClick?: boolean,
  type?: PointerEvents
) {
  const element = await client.$(selector);
  await element.waitForDisplayed(1000);
  const location = await (client as any).getElementLocation(
    (element as any).elementId
  );

  await window.client.moveToElement((element as any).elementId);

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
    rightClick
  });

  // If the type was "down and up", we'll now do the "up" part
  if (type === PointerEvents.MOUSEDOWNUP) {
    await sendClickElement(client, selector, rightClick, PointerEvents.MOUSEUP);
  }
}
