import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as semver from 'semver';

export function getBinaryPath(appPath: string): string {
  switch (process.platform) {
    case 'darwin':
      return path.join(appPath, 'Contents/MacOS/Slack');
    default:
      return appPath;
  }
}
export async function getSlackPath(version?: string): Promise<string> {
  let expectedPath = '';
  let expectedDir = '';

  if (process.platform === 'win32') {
    ({ expectedDir, expectedPath } = await getSlackPathWindows(version));
  }

  if (process.platform === 'darwin') {
    ({ expectedDir, expectedPath } = await getSlackPathMac());
  }

  if (process.platform === 'linux') {
    ({ expectedDir, expectedPath } = await getSlackPathLinux());
  }

  if (!fs.existsSync(expectedPath)) {
    const contents = `\n - ` + (await fs.readdir(expectedDir)).join(`\n - `);
    const warning = `Could not find Slack for v${version}. Here is what we have: ${contents}`;

    console.log(warning);
  }

  console.log(`getSlackPath(): Returning ${expectedPath}`);

  return expectedPath;
}

async function getSlackPathWindows(version?: string) {
  const homedir = os.homedir();
  const slackDir = path.join(homedir, `AppData/Local/slack`);
  let versionToUse = version;

  if (!versionToUse) {
    // Let's find the latest version
    const slackDirContents = await fs.readdir(slackDir);
    const versions: Array<string> = [];

    for (const item of slackDirContents) {
      const itemPath = path.join(slackDir, item);
      const isDir = (await fs.stat(itemPath)).isDirectory();
      const isApp = item.startsWith('app');

      if (isDir && isApp) {
        versions.push(item);
      }
    }

    versionToUse = versions.reduce((prevHighest, current) => {
      const cleanedValue = current.replace('app-', '');

      return semver.valid(cleanedValue) && semver.gt(cleanedValue, prevHighest)
        ? cleanedValue
        : prevHighest;
    }, '0.0.0');
  }

  const slackExe = path.join(slackDir, `app-${versionToUse}/slack.exe`);

  return {
    expectedDir: slackDir,
    expectedPath: slackExe
  };
}

async function getSlackPathMac() {
  const slackDir = path.join(`/Applications/Slack.app`);
  const slackBin = getBinaryPath(slackDir);

  return {
    expectedDir: slackDir,
    expectedPath: slackBin
  };
}

async function getSlackPathLinux() {
  const slackDir = `/usr/bin`;
  const slackBin = `slack`;

  return {
    expectedDir: slackDir,
    expectedPath: path.join(slackDir, slackBin)
  };
}
