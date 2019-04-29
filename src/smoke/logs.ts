import * as fs from 'fs-extra';
import { assert } from 'chai';
import * as path from 'path';
import { remote } from 'electron';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { clickWindowSubMenuItem } from '../helpers/click-window-menu-item';
import { waitForFileInDir } from '../helpers/wait-for-file';
import { wait } from '../utils/wait';
import { waitUntilSlackReady } from '../helpers/wait-until-slack-ready';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { getGpuWindowHandle } from '../helpers/get-gpu-info-window';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  const targetDir = remote.app.getPath('downloads');
  let createdLogFile = '';

  function getFindLogFileTest(blacklist: Array<string>) {
    return (contents: Array<string>) => {
      const logFiles = contents.filter(file => file.startsWith('logs-'));
      return !logFiles.find(file => {
        const notInBlackList = !blacklist.includes(file);

        if (!notInBlackList) {
          createdLogFile = path.join(targetDir, file);
        }

        return notInBlackList;
      });
    }
  }

  async function extractLogFile() {
    const fileName = path.basename(createdLogFile).replace('.zip', '');
    const unzipDir = path.join(targetDir, fileName);
    const extract = require('extract-zip');

    await new Promise(resolve => {
      extract(createdLogFile, { dir: unzipDir }, (err?: Error) => {
        assert.ok(!err);
        resolve();
      });
    });

    return fs.readdir(unzipDir);
  }

  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  it('can reveals log (window menu) in the downloads folder', async () => {
    // Make sure that we make a blacklist of logs files we won't
    // accept because they already exist
    const blacklist = await fs.readdir(targetDir);

    await clickWindowSubMenuItem(
      'Help',
      'Troubleshooting',
      'Show Logs in Finder'
    );

    await waitForFileInDir(targetDir, getFindLogFileTest(blacklist));

    assert.ok(createdLogFile);
  });

  it('creates a log file more than 10 files inside', async () => {
    assert.ok(createdLogFile);

    const contents = await extractLogFile();
    assert.ok(contents.length > 10);
  });

  it('restarts and collects net logs', async () => {
    const blacklist = await fs.readdir(targetDir);

    await clickWindowSubMenuItem(
      'Help',
      'Troubleshooting',
      'Restart and Collect Net Logs…'
    );
    await wait(100);
    await sendNativeKeyboardEvent({ text: 'enter' });

    // A bit of wait padding on both sides to make things more robust
    await wait(500);
    await waitUntilSlackReady(window.client);
    await wait(200);

    await getGpuWindowHandle(window.client);
    const stopLoggingBtn = await window.client.$('button=Stop Logging');
    await stopLoggingBtn.click();

    // Check disk
    await waitForFileInDir(targetDir, getFindLogFileTest(blacklist));

    // Close window, go back to browserView
    const closeWindowBtn = await window.client.$('button=Close Window');
    await closeWindowBtn.click();
    await getBrowserViewHandle(window.client);
  });

  it('saves a log file zip with a net.log in it', async () => {
    const contents = await extractLogFile();
    assert.include(contents, 'net.log', 'a net log file');
  });
};
