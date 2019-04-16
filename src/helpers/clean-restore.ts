import * as fs from 'fs-extra';
import * as shortId from 'shortid';
import { getUserDir } from './get-user-dir';

const debug = require('debug')('old-joe');

const userDir = getUserDir();
let backupUserDir = userDir.replace(
  'SlackDevMode',
  `SlackDevMode-${shortId.generate()}`
);

export async function clean() {
  const userDir = getUserDir();

  if (fs.existsSync(userDir)) {
    // Make a backup!
    debug(
      `${userDir} already exists, renaming it to ${backupUserDir}. We'll restore it after the test!`
    );
    await fs.rename(userDir, backupUserDir);
  } else {
    backupUserDir = '';
  }
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
