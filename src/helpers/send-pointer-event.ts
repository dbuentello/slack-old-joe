export const enum PointerEvent {
  MOUSEMOVE = 'mouseMoved',
  MOUSEDOWN = 'mousePressed',
  MOUSEUP = 'mouseReleased'
}

export interface PointerEventOptions {
  type: PointerEvent;
  touch?: boolean;
  x: number;
  y: number;
}

export function sendPointerEvent(
  client: BrowserObject,
  options: PointerEventOptions
) {
  const { type, touch, x, y } = options;

  let command = '';
  const data = {
    type: type,
    button: 'left',
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
