import * as fs from 'fs-extra';

export function waitForFile(filePath: string, timeout = 3000): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
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