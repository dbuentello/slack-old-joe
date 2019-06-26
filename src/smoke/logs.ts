import * as fs from 'fs-extra';
import { assert } from 'chai';
import * as path from 'path';
import { remote } from 'electron';

import { SuiteMethod } from '../interfaces';
import { clickWindowMenuItem } from '../helpers/click-window-menu-item';
import { waitForFileInDir } from '../helpers/wait-for-file';
import { wait } from '../utils/wait';
import { waitUntilSlackReady } from '../helpers/wait-until-slack-ready';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { isWin, isMac } from '../utils/os';
import { getNetLogWindowHandle } from '../helpers/get-netlog-window';
import { getSonicWindow } from '../helpers/get-sonic-window';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  const targetDir = remote.app.getPath('downloads');
  let createdLogFile = '';

  function getFindLogFileTest(blacklist: Array<string>) {
    return (contents: Array<string>) => {
      const logFiles = contents.filter(file => file.startsWith('logs-'));

      // Do we have a file in contents that's not on the blacklist
      // and was around before we started looking for a while?
      const fileNotInBlacklist = logFiles.find(file => {
        const inBlackList = blacklist.includes(file);

        if (!inBlackList) {
          createdLogFile = path.join(targetDir, file);
          return true;
        }

        return false;
      });

      return !!fileNotInBlacklist;
    };
  }

  async function extractLogFile(): Promise<Array<string>> {
    return new Promise(async (resolve, reject) => {
      const fileName = path.basename(createdLogFile).replace('.zip', '');
      const unzipDir = path.join(targetDir, fileName);
      const extract = require('extract-zip');

      await fs.mkdirp(unzipDir);
      extract(createdLogFile, { dir: unzipDir }, async (error?: Error) => {
        if (error) {
          reject(error);
        }

        resolve(await fs.readdir(unzipDir));
      });
    });
  }

  beforeAll(async () => {
    await getSonicWindow(window.client);
  });

  it('can reveal logs (window menu) in the downloads folder', async () => {
    // Make sure that we make a blacklist of logs files we won't
    // accept because they already exist
    const blacklist = await fs.readdir(targetDir);
    const findOrExplorer = isMac() ? 'Finder' : isWin() ? 'Explorer' : '';

    await clickWindowMenuItem([
      'Help',
      'Troubleshooting',
      `Show Logs in ${findOrExplorer}`
    ]);

    await waitForFileInDir(targetDir, getFindLogFileTest(blacklist));

    // Give Slack a second to show us the file in the Finder
    await wait(2000);

    assert.ok(createdLogFile, 'Unable to reveal logs in the downloads folder');
  });

  it('creates a log file more than 10 files inside', async () => {
    assert.ok(createdLogFile, 'log file does not exist.');

    const contents = await extractLogFile();
    assert.ok(
      contents.length > 10,
      'log file should have more than 10 files inside.'
    );
  });

  it('restarts and collects net logs', async () => {
    const blacklist = await fs.readdir(targetDir);

    await clickWindowMenuItem([
      'Help',
      'Troubleshooting',
      'Restart and Collect Net Logs…'
    ]);
    await wait(600);
    await sendNativeKeyboardEvent({ text: 'enter', noFocus: true });

    // A bit of wait padding on both sides to make things more robust
    await wait(700);
    await waitUntilSlackReady(window.client, false);
    await wait(700);

    await getNetLogWindowHandle(window.client);
    const stopLoggingBtn = await window.client.$('button=Stop Logging');
    await stopLoggingBtn.click();

    // Check disk
    await waitForFileInDir(targetDir, getFindLogFileTest(blacklist));

    // Close window, go back to main window
    const closeWindowBtn = await window.client.$('button=Close Window');
    await closeWindowBtn.click();
    await getSonicWindow(window.client, 500);
  });

  it('saves a log file zip with a net.log in it', async () => {
    const contents = await extractLogFile();
    assert.include(
      contents,
      'net.log',
      'a net log file should have been saved'
    );
  });
};
