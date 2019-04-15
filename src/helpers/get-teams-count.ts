import * as path from 'path';
import * as fs from 'fs-extra';

import { getUserDir } from './get-user-dir';

export async function getTeamsCount() {
  const userDir = getUserDir();
  const file = path.join(userDir, `storage/slack-appTeams`);
  const fileContent = await fs.readJSON(file);
  let result = 0;

  if (fileContent && fileContent.teamsByIndex) {
    result = fileContent.teamsByIndex.length || 0;
  }

  return result;
}
