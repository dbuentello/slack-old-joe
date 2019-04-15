import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

export async function getSlackPath(version: string): Promise<string | null> {
  let expectedPath;
  let expectedDir;

  if (process.platform === 'win32') {
    ({ expectedDir, expectedPath } = await getSlackPathWindows(version));
  }

  if (process.platform === 'darwin') {
    ({ expectedDir, expectedPath } = await getSlackPathMac());
  }

  if (fs.existsSync(expectedPath)) {
    return expectedPath;
  } else {
    const contents = `\n - ` + (await fs.readdir(expectedDir)).join(`\n - `);
    const warning = `Could not find Slack for v${version}. Here is what we have: ${contents}`;

    console.log(warning);
  }

  return null;
}

async function getSlackPathWindows(version: string) {
  const homedir = os.homedir();
  const slackDir = path.join(homedir, `AppData/Local/slack`);
  const slackExe = path.join(slackDir, `app-${version}/slack.exe`);

  return {
    expectedDir: slackDir,
    expectedPath: slackExe
  };
}

async function getSlackPathMac() {
  const slackDir = path.join(`/Applications/Slack.app`);
  const slackBin = path.join(slackDir, `Contents/MacOS/Slack`);

  return {
    expectedDir: slackDir,
    expectedPath: slackBin
  };
}
