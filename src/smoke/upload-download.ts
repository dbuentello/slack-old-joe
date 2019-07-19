import { assert } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import { remote } from 'electron';
import * as robot from 'robotjs';

import { SuiteMethod } from '../interfaces';
import { waitForFile } from '../helpers/wait-for-file';
import { wait } from '../utils/wait';
import { switchToChannel } from '../helpers/switch-channel';
import { switchToTeam } from '../helpers/switch-teams';
import { setPreference } from '../helpers/set-preference';
import { openPreferences, closePreferences } from '../helpers/open-preferences';
import { getPreference } from '../helpers/get-preference';
import { getSonicWindow } from '../helpers/get-sonic-window';
import { topLeftMouse } from '../native-commands/top-left-mouse';

const DOWNLOADS_DIR = remote.app.getPath('downloads');

export const test: SuiteMethod = async ({ it, beforeAll, beforeEach }) => {
  const desktop = remote.app.getPath('desktop');
  const newDir = path.join(desktop, 'old-joe-download-dir');
  let oldDir = '';

  beforeAll(async () => {
    await getSonicWindow(window.client);
    await switchToTeam(0);

    oldDir = await getPreference(window.client, 'PrefSSBFileDownloadPath');
  });

  beforeEach(async () => {
    await topLeftMouse();
  });

  it('can download a file in-channel', async () => {
    // Switch to the downloads channel
    await switchToChannel(window.client, 'downloads');

    // Wait for the description to show up
    const fileDesc = await window.client.$(
      'a[aria-label="Download test-file"]'
    );
    await fileDesc.waitForExist(1000);
    await fileDesc.moveTo();
    await fileDesc.click();

    const expectedFilePath = path.join(DOWNLOADS_DIR, `test-file`);
    assert.ok(
      await waitForFile(expectedFilePath),
      `file not fetched under expectedFilePath:${expectedFilePath}`
    );
  });

  it('downloads a file that has the right contents', async () => {
    const expectedFilePath = path.join(DOWNLOADS_DIR, `test-file`);
    const fileContents = await fs.readFile(expectedFilePath, 'utf-8');
    assert.equal(
      fileContents,
      'I am a test file',
      "fileContents do not equal 'I am a test file'"
    );

    // Cleanup, or attempted - Windows is weird sometimes
    try {
      await fs.remove(expectedFilePath);
    } catch (error) {
      console.warn(`Could not remove download file`, error);
    }
  });

  it(
    'can pause and resume a download',
    async () => {
      // Switch to the downloads channel
      await switchToChannel(window.client, 'downloads');

      // Open the downloads panel
      (await window.client.$(
        'button.p-classic_nav__right__button--flexpanes'
      )).click();
      const downloadsBtn = await window.client.$(
        'div.c-menu_item__label=Downloads'
      );
      assert.ok(
        await downloadsBtn.waitForExist(2000),
        'downloaddsBtn does not exist.'
      );
      await wait(500);
      await downloadsBtn.moveTo();
      await downloadsBtn.click();

      // Sometimes, the menu stays open. Close it by hitting ESC
      await robot.keyTap('escape');
      await wait(500);

      // Wait for the panel to show up
      const downloadsHeader = await window.client.$('span=Downloads');
      await downloadsHeader.waitForExist(2000);
      await wait(500);

      // Download the large file
      const fileDesc = await window.client.$(
        'a[aria-label="Download test-large-file.zip"]'
      );
      await fileDesc.moveTo();
      await wait(300);
      await fileDesc.click();

      // Pause the download right away
      const pauseBtn = await window.client.$(
        'button.p-download_item__link--pause'
      );
      assert.ok(await pauseBtn.waitForExist(5000), 'pauseBtn does not exist.');
      await pauseBtn.moveTo();
      await wait(300);
      await pauseBtn.click();

      // We should now have a resume button
      const resumeBtn = await window.client.$(
        'button.p-download_item__link--resume'
      );
      assert.ok(
        await resumeBtn.waitForExist(5000),
        'resumtBtn does not exist.'
      );

      // Let the network pipes cool down (not required, I just want to wait a sec)
      // and check if the file is actually no longer downloading
      await wait(500);
      const expectedFilePath = path.join(DOWNLOADS_DIR, `test-large-file.zip`);
      const beforeBytes = fs.statSync(expectedFilePath).size;
      await wait(1000);
      const afterBytes = fs.statSync(expectedFilePath).size;
      assert.equal(
        beforeBytes,
        afterBytes,
        `beforeBytes:${beforeBytes} is not equal to afterBytes:${afterBytes}`
      );
    },
    {
      cleanup: async () => {
        const expectedFilePath = path.join(
          DOWNLOADS_DIR,
          `test-large-file.zip`
        );

        // Cleanup, or attempted - Windows is weird sometimes
        try {
          await fs.remove(expectedFilePath);
        } catch (error) {
          console.warn(`Could not remove download file`, error);
        }
      },
      retries: 2
    }
  );

  it('can cancel a download', async () => {
    const cancelBtn = await window.client.$('.p-download_item__link--cancel');
    assert.ok(
      await cancelBtn.waitForDisplayed(5000),
      'cancelBtn is not displayed.'
    );
    await cancelBtn.moveTo();
    await wait(300);
    await cancelBtn.click();
    await wait(300);

    // Let the network pipes cool down (not required, I just want to wait a sec)
    // and check if the file is actually no longer downloading
    const expectedFilePath = path.join(DOWNLOADS_DIR, `test-large-file.zip`);
    assert.notOk(fs.existsSync(expectedFilePath), 'the file on disk');
  });

  it('can change the download location', async () => {
    // First, make a new download location
    await fs.mkdirp(newDir);
    await fs.outputFile(
      path.join(newDir, 'what is this.txt'),
      'Old Joe uses this for testing changes to the download location'
    );

    // We'll do this real quick
    await setPreference(window.client, 'PrefSSBFileDownloadPath', newDir);

    // But check that it worked
    await openPreferences(window.client, 'Advanced');
    const downloadsPref = await window.client.$('#app_download_path_input');
    await downloadsPref.waitForExist(1000);
    const downloadsPrefValue = await downloadsPref.getProperty('value');

    // Should be the same
    assert.equal(
      downloadsPrefValue,
      newDir,
      `the preference value in settings downloadsPrefValue:${downloadsPrefValue} is not equal to newDir:${newDir}`
    );
  });

  it(
    'can download a file to the new location',
    async () => {
      const expectedFilePath = path.join(newDir, 'second test file.txt');

      // Download a file there
      await closePreferences(window.client);

      // Remove old file
      if (fs.existsSync(expectedFilePath)) {
        await fs.remove(expectedFilePath);
      }

      // Download a file
      const fileDesc = await window.client.$(
        'a[aria-label="Download second-test-file'
      );
      await fileDesc.moveTo();
      await wait(300);
      await fileDesc.click();
      await wait(1000);

      assert.ok(
        fs.existsSync(expectedFilePath),
        `the downloaded file does not exist. expectedFilePath:${expectedFilePath}`
      );
    },
    {
      cleanup: async () => {
        await setPreference(window.client, 'PrefSSBFileDownloadPath', oldDir);
      }
    }
  );
};
