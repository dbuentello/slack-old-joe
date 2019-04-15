import * as spawn from 'cross-spawn';
import * as path from 'path';
import { ChildProcess } from 'child_process';

const debug = require('debug')('chromedriver')

let driver: ChildProcess;

export function spawnChromeDriver(): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve) => {
    const driverPath = path.join(__dirname, '../node_modules/.bin/chromedriver')

    driver = spawn(driverPath, ['--url-base=wd/hub', '--port=9515']);

    const checkIfLaunched = (data) => {
      if (data.toString().includes(`Only local connections are allowed.`)) {
        driver.stdout.removeListener('data', checkIfLaunched);
        resolve(driver)
      }
    }

    driver.stdout.addListener('data', checkIfLaunched);
    driver.stdout.addListener('data', debug);
    driver.stderr.addListener('data', debug);
    driver.addListener('close', (code) => debug(`Chromedriver exited with code ${code}`));
  })
}
