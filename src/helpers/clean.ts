import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

export async function clean() {
  let pathToClean: string;

  if (process.platform === 'win32') {
    pathToClean = getWindowsDir();
  } else if (process.platform === 'darwin') {
    pathToClean = getDarwinDir();
  } else {
    throw new Error(`Platform ${process.platform} not implemented yet!`);
  }

  await fs.emptyDir(pathToClean);
}

function getWindowsDir() {
  const homedir = os.homedir();
  const slackDir = path.join(homedir, `AppData/Roaming/SlackDevMode`);

  return slackDir;
}

function getDarwinDir() {
  const homedir = os.homedir();
  const slackDir = path.join(
    homedir,
    `~/Library/Application Support/SlackDevMode`
  );

  return slackDir;
}
