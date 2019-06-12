import * as path from 'path';
import * as os from 'os';

export const USER_DATA_FOLDER_NAME = `SlackDevMode`;

export function getUserDir() {
  return path.join(getAppDataDir(), USER_DATA_FOLDER_NAME);
}

export function getAppDataDir() {
  const homedir = os.homedir();

  if (process.platform === 'darwin') {
    return path.join(homedir, `Library/Application Support`);
  } else if (process.platform === 'win32') {
    return path.join(homedir, `AppData/Roaming`);
  } else if (process.platform === 'linux') {
    return path.join(homedir, '.config');
  } else {
    throw new Error(`Platform ${process.platform} not implemented yet`);
  }
}
