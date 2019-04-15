import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';
import * as screenshot from 'screenshot-desktop';

const now = new Date().toLocaleTimeString().replace(/:/g, '-');
let screenshotCount = 0;

export async function takeScreenshot(name: string) {
  const desktop = path.join(os.homedir(), `Desktop`);
  const screenshotDir = path.join(desktop, `Old Joe Run at ${now}`);
  const screenshotPath = path.join(screenshotDir, `${screenshotCount} - ${name}.jpg`);
  await fs.mkdirp(screenshotDir);

  screenshotCount++;

  return screenshot({ filename: screenshotPath })
}
