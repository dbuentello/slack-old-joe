import * as spawn from 'cross-spawn';
import * as path from 'path';
import { ChildProcess } from 'child_process';

const debug = require('debug')('chromedriver')

let driver = null;

export function spawnChromeDriver(): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve) => {
    const driverPath = path.join(__dirname, '../node_modules/.bin/chromedriver')

    driver = spawn(driverPath, ['--url-base=wd/hub', '--port=9515']);

    const checkIfLaunched = (data) => {
      if (data.toString().includes(`Only local connections are allowed.`)) {
        driver.stdout.off('data', checkIfLaunched)
        resolve(driver)
      }
    }

    driver.stdout.on('data', checkIfLaunched);
    // driver.stdout.on('data', debug);
    // driver.stderr.on('data', debug);
    driver.on('close', (code) => debug(`Chromedriver exited with code ${code}`));
  })
}
