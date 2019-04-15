import * as path from 'path';
import * as fs from 'fs-extra';
import { getUserDir } from './get-user-dir';

export async function clean() {
  await fs.emptyDir(getUserDir());
}
