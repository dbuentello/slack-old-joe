import * as path from 'path';
import * as os from 'os';

export function getUserDir() {
  return path.join(getAppDataDir(), 'SlackDevMode');
}

export function getAppDataDir() {
  const homedir = os.homedir();

  if (process.platform === 'darwin') {
    return path.join(homedir, `Library/Application Support`);
  } else if (process.platform === 'win32') {
    return path.join(homedir, `AppData/Roaming`);
  } else {
    throw new Error(`Platform ${process.platform} not implemented yet`);
  }
}
