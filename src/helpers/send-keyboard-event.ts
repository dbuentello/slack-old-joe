export const enum KeyboardEventType {
  KEYUP = 'keyUp',
  KEYDOWN = 'rawKeyDown',
  KEYPRESS = 'char'
}

export interface KeyboardEventOptions {
  type: KeyboardEventType;
  charCode: number;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  cmd?: boolean;
}

export function sendKeyboardEvent(client: BrowserObject, options: KeyboardEventOptions) {
  const { type, charCode, shift, alt, ctrl, cmd } = options;
  let text = type === KeyboardEventType.KEYPRESS
    ? String.fromCharCode(charCode)
    : '';

  let modifiers = 0;
  if (shift) {
    modifiers += 8;
  }
  if (alt) {
    modifiers += 1;
  }
  if (ctrl) {
    modifiers += 2;
  }
  if (cmd) {
    modifiers += 4;
  }

  return client.sendCommand("Input.dispatchKeyEvent", {
    type: type,
    windowsVirtualKeyCode: charCode,
    modifiers: modifiers,
    text: text
  });
}
