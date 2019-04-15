import * as path from 'path';
import * as os from 'os';

export function getUserDir() {
  const homedir = os.homedir();

  if (process.platform === 'darwin') {
    return path.join(homedir, `Library/Application Support/SlackDevMode`);
  } else if (process.platform === 'win32') {
    return path.join(homedir, `AppData/Roaming/SlackDevMode`);
  } else {
    throw new Error(`Platform ${process.platform} not implemented yet`);
  }
}
