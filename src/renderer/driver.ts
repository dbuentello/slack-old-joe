import * as path from 'path';
import { ChildProcess } from 'child_process';

const debug = require('debug')('chromedriver');
const spawn = require('cross-spawn');

let driver: ChildProcess;

export const DRIVER_VERSION = 4;

export function spawnChromeDriver(): Promise<ChildProcess> {
  return new Promise<ChildProcess>(resolve => {
    const driverPath = path.join(
      __dirname,
      '../../node_modules/.bin/chromedriver'
    );

    driver = spawn(driverPath, ['--url-base=wd/hub', '--port=9515']);

    if (!driver.stderr || !driver.stdout) {
      throw new Error('Could not create stdout and stderr streams');
    }

    const checkIfLaunched = (data: Buffer) => {
      if (data.toString().includes(`Only local connections are allowed.`)) {
        driver.stdout!.removeListener('data', checkIfLaunched);
        resolve(driver);
      }
    };

    driver.stdout.addListener('data', checkIfLaunched);
    driver.stdout.addListener('data', data => debug(data.toString()));
    driver.stderr.addListener('data', data => debug(data.toString()));
    driver.addListener('close', code =>
      debug(`Chromedriver exited with code ${code}`)
    );
  });
}
