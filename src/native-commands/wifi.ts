import { isMac } from '../utils/os';
import { WifiManager } from './wifi-manager';

// Yes, I could write one module that does both. But I won't.
const wifi: WifiManager = isMac() ? require('manage-wifi') : new WifiManager();

export async function enableWifi() {
  return wifi.on();
}

export async function disableWifi() {
  return wifi.off();
}
