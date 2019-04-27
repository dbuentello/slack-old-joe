import * as fs from 'fs-extra';
import * as path from 'path';
import * as shortId from 'shortid';
import { getUserDir, getAppDataDir } from './get-user-dir';

const debug = require('debug')('old-joe');

const userDir = getUserDir();
let backupUserDir = userDir.replace(
  'SlackDevMode',
  `SlackDevMode-${shortId.generate()}`
);

export async function clean() {
  const userDir = getUserDir();

  // Delete old "Old Joe" folder
  await deleteOldJoeFolders();

  if (fs.existsSync(userDir)) {
    // Make a backup!
    debug(
      `${userDir} already exists, renaming it to ${backupUserDir}. We'll restore it after the test!`
    );
    await fs.rename(userDir, backupUserDir);
  } else {
    backupUserDir = '';
  }

  await fs.mkdirp(userDir);
  await fs.outputFile(path.join(userDir, '.oldjoe'), '🐪');
}

export function restore() {
  if (backupUserDir) {
    debug(
      `Deleting ${userDir}, which was created during the test. We'll restore ${backupUserDir}`
    );

    fs.removeSync(userDir);
    fs.renameSync(backupUserDir, userDir);
  } else {
    fs.removeSync(userDir);
  }
}

export async function deleteOldJoeFolders() {
  const appDataDir = getAppDataDir();
  const slackDevModeBackupFolders = (await fs.readdir(appDataDir)).filter(
    f => f.startsWith('SlackDevMode-') && f.length === 22
  );

  for (const folder of slackDevModeBackupFolders) {
    const folderPath = path.join(appDataDir, folder);
    if (hasOldJoeFile(folderPath)) {
      await fs.remove(folderPath);
    }
  }
}

export function hasOldJoeFile(folder: string) {
  return fs.existsSync(path.join(folder, '.oldjoe'));
}
