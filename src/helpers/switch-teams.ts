import { sendNativeKeyboardEvent } from './send-keyboard-event';

export function switchTeam(index: number) {
  sendNativeKeyboardEvent({ cmd: true, text: index.toString() });
}
