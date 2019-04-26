import * as fs from 'fs-extra';
import { assert } from 'chai';
import * as path from 'path';
import { remote } from 'electron';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { clickWindowSubMenuItem } from '../helpers/click-window-menu-item';
import { waitForFileInDir } from '../helpers/wait-for-file';

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  const targetDir = remote.app.getPath('downloads');
  let createdLogFile = '';

  beforeAll(async () => {
    await getBrowserViewHandle(client);
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

    await waitForFileInDir(targetDir, contents => {
      const logFiles = contents.filter(file => file.startsWith('logs-'));
      return !logFiles.find(file => {
        const notInBlackList = !blacklist.includes(file);

        if (!notInBlackList) {
          createdLogFile = path.join(targetDir, file);
        }

        return notInBlackList;
      });
    });

    assert.ok(createdLogFile);
  });

  it('creates a log file more than 10 files inside', async () => {
    assert.ok(createdLogFile);

    const fileName = path.basename(createdLogFile).replace('.zip', '');
    const unzipDir = path.join(targetDir, fileName);
    const extract = require('extract-zip');

    await new Promise(resolve => {
      extract(createdLogFile, { dir: unzipDir }, (err?: Error) => {
        assert.ok(!err);
        resolve();
      });
    });

    const contents = await fs.readdir(unzipDir);
    assert.ok(contents.length > 10);
  });
};
