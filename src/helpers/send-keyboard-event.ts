import * as robot from 'robotjs';

import { focus } from '../native-commands/focus';
import { keyDescriptionForString } from '../lib/keyboard-description-for-string';
import { isMac } from '../utils/os';

const debug = require('debug')('old-joe:keyboard');

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
  noFocus?: boolean;
}

export async function sendNativeKeyboardEvent(options: KeyboardEventOptions) {
  const { text, shift, alt, ctrl, cmd, noFocus } = options;
  const modifier: Array<string> = [];

  // On a Mac, robotjs is kinda garbage. Let's use AppleScript, which works
  // so. much. better.
  if (isMac()) {
    return sendAppleScriptKeyboardEvent(options);
  }

  cmd && modifier.push(`command`);
  shift && modifier.push(`shift`);
  alt && modifier.push(`alt`);
  ctrl && modifier.push(`control`);

  debug(`Sending`, options);

  if (!noFocus) await focus();
  robot.keyTap(text, modifier);
}

async function sendAppleScriptKeyboardEvent(options: KeyboardEventOptions) {
  const { runAppleScript } = await import('../utils/applescript');
  const { text, shift, alt, ctrl, cmd, noFocus } = options;
  const instructions: Array<string> = [];

  let command = `keystroke "${text}"`;
  let lowercaseText = text.toLowerCase();

  // Not to be confused with JS DOM key codes
  // https://apple.stackexchange.com/questions/36943/how-do-i-automate-a-key-press-in-applescript
  if (lowercaseText === 'enter') {
    command = `key code 36`;
  } else if (lowercaseText === 'right') {
    command = `key code 124`;
  } else if (lowercaseText === 'down') {
    command = `key code 125`;
  } else if (lowercaseText === 'left') {
    command = `key code 123`;
  } else if (lowercaseText === 'up') {
    command = `key code 38`;
  } else if (lowercaseText === 'escape') {
    command = `key code 126`;
  }

  cmd && instructions.push(`command down`);
  shift && instructions.push(`shift down`);
  alt && instructions.push(`option down`);
  ctrl && instructions.push(`control down`);

  const usingText = `using {${instructions.join(', ')}}`;

  if (!noFocus) await focus();
  await runAppleScript(
    `tell application "System Events" to ${command} ${usingText}`
  );
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
    text: description.text,
    //unmodifiedText: text,
    location: description.location,
    isKeypad: description.location === 3
  });
}
