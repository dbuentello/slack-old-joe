import { isWin, isLinux } from '../utils/os';
import { execSync } from 'child_process';

const debug = require('debug')('old-joe');

export class WifiManager {
  private lastKnownSsid: string = '';
  private lastKnownProfile: string = '';

  public async on() {
    if (isWin()) return this.onWindows();
    if (isLinux()) return this.onLinux();
  }

  public async off() {
    if (isWin()) return this.offWindows();
    if (isLinux()) return this.offLinux();
  }

  private async onLinux() {
    execSync('nmcli networking off');
  }

  private async offLinux() {
    execSync('nmcli networking on');
  }

  private async onWindows() {
    if (!this.lastKnownSsid) {
      throw new Error('Cannot reconnect without known connection');
    }

    return this.runNetShCommand(
      `connect ssid="${this.lastKnownSsid}" name="${this.lastKnownProfile}"`
    );
  }

  private async offWindows() {
    await this.saveLastKnownConnectionWindows();
    return this.runNetShCommand(`disconnect`);
  }

  private async saveLastKnownConnectionWindows() {
    //
    // There is 1 interface on the system:
    //
    // Name                   : Wi-Fi
    // Description            : Killer Wireless-n/a/ac 1535 Wireless Network Adapter
    // GUID                   : 8f084ddd-95d0-46c7-8e64-da17e91074bb
    // Physical address       : 9c:b6:d0:f5:f9:0d
    // State                  : connected
    // SSID                   : WLAN-EU286W
    // BSSID                  : c8:94:bb:74:4d:04
    // Network type           : Infrastructure
    // Radio type             : 802.11ac
    // Authentication         : WPA2-Personal
    // Cipher                 : CCMP
    // Connection mode        : Profile
    // Channel                : 52
    // Receive rate (Mbps)    : 866.7
    // Transmit rate (Mbps)   : 866.7
    // Signal                 : 100%
    // Profile                : WLAN-EU286W
    //
    // Hosted network status  : Not available
    //
    const currentProfile = await this.runNetShCommand(`show interface`);
    const fields = currentProfile
      .split('\n')
      .filter(line => line.includes(': '));
    const ssidField = fields.filter(line => line.includes('SSID'));
    const profileField = fields.filter(
      line => line.includes('Profile') && !line.includes('Connection mode')
    );
    let ssid = '';
    let profile = '';

    debug(`Profile output:`, currentProfile);

    if (ssidField && ssidField[0]) {
      ssid = ssidField[0].slice(ssidField[0].indexOf(': ') + 2).trim();
    }

    if (profileField && profileField[0]) {
      profile = profileField[0].slice(profileField[0].indexOf(': ') + 2).trim();
    }

    debug(`SSID`, ssid);
    debug(`Profile`, profile);

    this.lastKnownProfile = profile;
    this.lastKnownSsid = ssid;
  }

  private async runNetShCommand(cmd: string) {
    return execSync(`netsh wlan ${cmd}`)
      .toString()
      .trim();
  }
}
