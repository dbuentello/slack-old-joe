import * as path from 'path';
import { remote } from 'electron';
import { ChildProcess } from 'child_process';
import { Driver } from '../interfaces';

const debug = require('debug')('chromedriver');
const spawn = require('cross-spawn');

let driver: ChildProcess;

export const DRIVER_VERSION = 6;

function handleChromeDriverData(data: Buffer) {
  const message = data.toString();

  debug(message);

  if (message.includes('IPv6 port not available. Exiting')) {
    remote.dialog.showErrorBox(
      'IPv6 port not available',
      'Chromedriver reports that it cannot launch due to an IPv6 port conflict. The easiest and often quickest way to deal with this issue is to look for a chromedriver process and to kill it - or to restart your computer. Old Joe will now exit.'
    );

    remote.app.exit(1);
  }
}

export function spawnChromeDriver(): Promise<ChildProcess> {
  return new Promise<ChildProcess>(resolve => {
    const driverPath = path.join(
      __dirname,
      '../../node_modules/electron-chromedriver/bin/chromedriver'
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
    driver.stdout.addListener('data', handleChromeDriverData);
    driver.stderr.addListener('data', handleChromeDriverData);
    driver.addListener('close', code =>
      debug(`Chromedriver exited with code ${code}`)
    );

    const killChromeDriver = () => {
      try {
        driver.kill();
      } catch (ignored) {}
    };

    driver['restart'] = spawnChromeDriver;
    window.driver = driver as Driver;

    process.on('exit', killChromeDriver);
    process.on('SIGTERM', killChromeDriver);
  });
}
