import * as path from 'path';
import * as fs from 'fs-extra';

import { getUserDir } from './get-user-dir';

export async function getTeamsCount() {
  const userDir = getUserDir();
  const file = path.join(userDir, `storage/slack-workspaces`);
  let result = 0;

  try {
    const fileContent = await fs.readJSON(file);

    if (fileContent) {
      result = Object.keys(fileContent).length || 0;
    }
  } catch (error) {
    console.warn(`Could not read slack-workspaces`, error);
  }

  return result;
}
