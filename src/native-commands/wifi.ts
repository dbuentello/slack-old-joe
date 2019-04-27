import { isMac } from '../helpers/os';

export async function enableWifi() {
  if (isMac()) {
    const manageWifi = require('manage-wifi');
    return manageWifi.on();
  } else {
    // Todo
  }
}

export async function disableWifi() {
  if (isMac()) {
    const manageWifi = require('manage-wifi');
    return manageWifi.off();
  } else {
    // Todo
  }
}
