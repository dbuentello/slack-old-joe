export const enum KeyboardEventType {
  KEYUP = 'keyUp',
  KEYDOWN = 'rawKeyDown',
  KEYPRESS = 'char'
}

export interface KeyboardEventOptions {
  type?: KeyboardEventType;
  text: string;
  shift?: boolean;
  alt?: boolean;
  ctrl?: boolean;
  cmd?: boolean;
}

export async function sendNativeKeyboardEvent(options: KeyboardEventOptions) {
  const { text, shift, alt, ctrl, cmd } = options;

  if (process.platform === 'darwin') {
    const { runAppleScript } = await import('./applescript');
    const instructions: Array<string> = [];

    cmd && instructions.push(`command down`);
    shift && instructions.push(`shift down`);
    alt && instructions.push(`option down`);
    ctrl && instructions.push(`control down`);

    const usingText = `using {${instructions.join(', ')}}`

    await focus();

    runAppleScript(`tell application "System Events" to keystroke "${text}" ${usingText}`)
  }
}

export function sendKeyboardEvent(client: BrowserObject, options: KeyboardEventOptions) {
  const { type, text, shift, alt, ctrl, cmd } = options;
  const charCode = text.charCodeAt(0);

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
    type: type || KeyboardEventType.KEYPRESS,
    windowsVirtualKeyCode: charCode,
    modifiers: modifiers,
    text: text
  });
}
