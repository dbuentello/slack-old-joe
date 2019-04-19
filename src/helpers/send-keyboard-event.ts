import { keyDescriptionForString } from '../lib/keyboard-description-for-string';

export const enum KeyboardEventType {
  KEYUP = 'keyUp',
  KEYDOWN = 'keyDown'
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

    const usingText = `using {${instructions.join(', ')}}`;

    await focus();
    await runAppleScript(
      `tell application "System Events" to keystroke "${text}" ${usingText}`
    );
  }
}

export function sendKeyboardEvent(
  client: BrowserObject,
  options: KeyboardEventOptions
) {
  const { type, text, shift, alt, ctrl, cmd } = options;
  const description = keyDescriptionForString(options);

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

  const _type =
    type !== KeyboardEventType.KEYDOWN
      ? text
        ? 'keyDown'
        : 'rawKeyDown'
      : type;

  return client.sendCommand('Input.dispatchKeyEvent', {
    type: _type,
    modifiers,
    windowsVirtualKeyCode: description.keyCode,
    code: description.code,
    key: description.key,
    text: text,
    unmodifiedText: text,
    location: description.location,
    isKeypad: description.location === 3
  });
}
