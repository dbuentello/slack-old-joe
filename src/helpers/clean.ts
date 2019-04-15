import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

export async function clean() {
  const homedir = os.homedir();
  const slackDir = path.join(homedir, `AppData/Roaming/SlackDevMode`);

  await fs.emptyDir(slackDir);
}
