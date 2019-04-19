import * as fs from 'fs-extra';
import * as assert from 'assert';
import { remote } from 'electron';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { clickWindowSubMenuItem } from '../helpers/click-window-menu-item';
import { waitForFileInDir } from '../helpers/wait-for-file';

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('can reveals log (window menu) in the downloads folder', async () => {
    const targetDir = remote.app.getPath('downloads');

    // Make sure that we make a blacklist of logs files we won't
    // accept because they already exist
    const blacklist = await fs.readdir(targetDir);

    await clickWindowSubMenuItem(
      'Help',
      'Troubleshooting',
      'Show Logs in Finder'
    );

    const logFileCreated = await waitForFileInDir(targetDir, contents => {
      const logFiles = contents.filter(file => file.startsWith('logs-'));
      return !logFiles.find(file => !blacklist.includes(file));
    });

    assert.ok(logFileCreated);
  });
};
