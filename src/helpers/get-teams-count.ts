import * as path from 'path';
import * as fs from 'fs-extra';

import { getUserDir } from './get-user-dir';

export async function getTeamsCount() {
  const userDir = getUserDir();
  const file = path.join(userDir, `storage/slack-workspaces`);
  const fileContent = await fs.readJSON(file);
  let result = 0;

  if (fileContent) {
    result = Object.keys(fileContent).length || 0;
  }

  return result;
}
