import * as fs from 'fs-extra';
import * as path from 'path';
import { getUserDir } from './get-user-dir';

export async function setSonicBoot() {
  const userDir = getUserDir();
  const settingsPath = path.join(userDir, 'local-settings.json');
  let settingsToWrite: Record<string, any> = {};

  if (fs.existsSync(settingsPath)) {
    settingsToWrite = await fs.readJSON(settingsPath);
  }

  settingsToWrite.bootSonic = 'always';

  await fs.mkdirp(userDir);
  await fs.writeJSON(settingsPath, settingsToWrite);
}
