import { USKeyboardLayout } from './USKeyboardLayout';
import { KeyboardEventOptions } from '../helpers/send-keyboard-event';

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export function keyDescriptionForString(options: KeyboardEventOptions) {
  const { shift, cmd, ctrl, alt, text } = options;
  const description = {
    key: '',
    keyCode: 0,
    code: '',
    text: '',
    location: 0
  };

  const definition = USKeyboardLayout[text];

  if (definition.key) description.key = definition.key;
  if (shift && definition.shiftKey) description.key = definition.shiftKey;

  if (definition.keyCode) description.keyCode = definition.keyCode;
  if (shift && definition.shiftKeyCode)
    description.keyCode = definition.shiftKeyCode;

  if (definition.code) description.code = definition.code;

  if (definition.location) description.location = definition.location;

  if (description.key.length === 1) description.text = description.key;

  if (definition.text) description.text = definition.text;
  if (shift && definition.shiftText) description.text = definition.shiftText;

  // if any modifiers besides shift are pressed, no text should be sent
  if (alt || cmd || ctrl) {
    description.text = '';
  }

  return description;
}
