import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

export async function getSlackPath(version = '') {
  if (process.platform === 'win32') {
    const homedir = os.homedir();
    const slackDir = path.join(homedir, `AppData/Local/slack`);
    const slackExe = path.join(slackDir, `app-${version}/slack.exe`);

    if (fs.existsSync(slackExe)) {
      return slackExe
    } else {
      const contents = `\n - ` + (await fs.readdir(slackDir)).join(`\n - `)
      const warning = `Could not find Slack for v${version}. Here is what we have: ${contents}`

      console.log(warning)
    }
  }
}
