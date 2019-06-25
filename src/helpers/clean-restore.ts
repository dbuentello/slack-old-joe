import * as fs from 'fs-extra';
import * as path from 'path';
import * as shortId from 'shortid';
import {
  getUserDir,
  getAppDataDir,
  USER_DATA_FOLDER_NAME
} from './get-user-dir';

const debug = require('debug')('old-joe');

const userDir = getUserDir();
let backupUserDir = userDir.replace(
  USER_DATA_FOLDER_NAME,
  `${USER_DATA_FOLDER_NAME}-${shortId.generate()}`
);

export async function clean() {
  console.groupCollapsed('clean');
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

  console.groupEnd();
}

export function restore() {
  console.groupCollapsed('restore');
  if (backupUserDir) {
    debug(
      `Deleting ${userDir}, which was created during the test. We'll restore ${backupUserDir}`
    );

    fs.removeSync(userDir);
    fs.renameSync(backupUserDir, userDir);
  } else {
    fs.removeSync(userDir);
  }
  console.groupEnd();
}

export async function deleteOldJoeFolders() {
  const appDataDir = getAppDataDir();
  const slackBackupFolders = (await fs.readdir(appDataDir)).filter(
    f => f.startsWith(`${USER_DATA_FOLDER_NAME}-`) && f.length === 22
  );
  
  if(slackBackupFolders.length > 1) {
    throw new Error("Should not have more than one backup folder.")
  }
  const folderPath = path.join(appDataDir, slackBackupFolders[0]);
  if (hasOldJoeFile(folderPath)) {
    await fs.remove(folderPath);
  }
}

export function hasOldJoeFile(folder: string) {
  return fs.existsSync(path.join(folder, '.oldjoe'));
}
