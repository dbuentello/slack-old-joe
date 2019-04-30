import * as fs from 'fs-extra';
import * as path from 'path';

import { getUserDir } from './get-user-dir';

/**
 * Unzips a user data dir with existing sessions
 * to the user data dir. Avoids having to sign in.
 */
export async function seedUserDataDir() {
  console.groupCollapsed(`Seeding user data dir`);
  const extract = require('extract-zip');
  const userDir = getUserDir();
  const zipFile = path.join(__dirname, `../../static/data/SlackDevMode.zip`);

  await fs.mkdirp(userDir);
  await new Promise((resolve, reject) => {
    extract(zipFile, { dir: userDir }, (err?: Error) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
  console.groupEnd();
}
