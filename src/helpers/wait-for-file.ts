import * as fs from 'fs-extra';
import { wait } from '../utils/wait';

export function waitForFile(
  filePath: string,
  timeout = 3000
): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    const checkTimeout = setTimeout(() => {
      clearInterval(checkInterval);
      resolve(false);
    }, timeout);

    const checkInterval = setInterval(() => {
      if (fs.existsSync(filePath)) {
        clearInterval(checkInterval);
        clearTimeout(checkTimeout);
        resolve(true);
      }
    }, 200);
  });
}

export function waitForFileInDir(
  dirPath: string,
  testFn: (dirContents: Array<string>) => boolean,
  timeout = 3000
): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    const checkTimeout = setTimeout(() => {
      clearInterval(checkInterval);
      resolve(false);
    }, timeout);

    const checkInterval = setInterval(async () => {
      const contents = await fs.readdir(dirPath);
      if (testFn(contents)) {
        clearInterval(checkInterval);
        clearTimeout(checkTimeout);

        // On Windows, the file might still be in-write
        await wait(500);
        resolve(true);
      }
    }, 500);
  });
}
