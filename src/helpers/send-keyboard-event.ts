import * as robot from 'robotjs';
import { BrowserObject } from 'webdriverio';

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
  cmdOrCtrl?: boolean;
  noFocus?: boolean;
}

export async function sendNativeKeyboardEvent(options: KeyboardEventOptions) {
  const { text, noFocus, cmdOrCtrl } = options;
  const modifier: Array<string> = [];

  if (cmdOrCtrl) {
    options.cmd = isMac();
    options.ctrl = !isMac();
  }

  // On a Mac, robotjs is kinda garbage. Let's use AppleScript, which works
  // so. much. better.
  if (isMac()) {
    return sendAppleScriptKeyboardEvent(options);
  }

  options.cmd && modifier.push(`command`);
  options.shift && modifier.push(`shift`);
  options.alt && modifier.push(`alt`);
  options.ctrl && modifier.push(`control`);

  debug(`Sending`, text, modifier);

  if (!noFocus) await focus();
  robot.keyTap(text, modifier);
}

async function sendAppleScriptKeyboardEvent(options: KeyboardEventOptions) {
  const { runAppleScript } = await import('../utils/applescript');
  const { text, shift, alt, ctrl, cmd, noFocus } = options;
  const instructions: Array<string> = [];

  cmd && instructions.push(`command down`);
  shift && instructions.push(`shift down`);
  alt && instructions.push(`option down`);
  ctrl && instructions.push(`control down`);

  const command = getAppleScriptCommand(text);
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

// Not to be confused with JS DOM key codes
// https://apple.stackexchange.com/questions/36943/how-do-i-automate-a-key-press-in-applescript
const AS_KEY_CODES = {
  enter: 36,
  '/': 44,
  delete: 51,
  escape: 53,
  '+': 69,
  '-': 78,
  left: 123,
  right: 124,
  down: 125,
  up: 126
};

function getAppleScriptCommand(text: string) {
  let lowercaseText = text.toLowerCase();

  if (AS_KEY_CODES[lowercaseText]) {
    return `key code ${AS_KEY_CODES[lowercaseText]}`;
  } else {
    return `keystroke "${text}"`;
  }
}
