import { assert } from 'chai';
import * as fs from 'fs-extra';
import * as path from 'path';
import { remote } from 'electron';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { waitForFile } from '../helpers/wait-for-file';
import { wait } from '../utils/wait';
import { switchToChannel } from '../helpers/switch-channel';

const DOWNLOADS_DIR = remote.app.getPath('downloads');

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  it('can download a file in-channel', async () => {
    // Switch to the downloads channel
    await switchToChannel(window.client, 'downloads');

    // Wait for the description to show up
    const fileDesc = await window.client.$('span=test-file');
    await fileDesc.waitForExist(1000);
    await fileDesc.click();

    const expectedFilePath = path.join(DOWNLOADS_DIR, `test-file`);
    assert.ok(await waitForFile(expectedFilePath));
  });

  it('downloads a file that has the right contents', async () => {
    const expectedFilePath = path.join(DOWNLOADS_DIR, `test-file`);
    const fileContents = await fs.readFile(expectedFilePath, 'utf-8');
    assert.equal(fileContents, 'I am a test file');

    // Cleanup, or attempted - Windows is weird sometimes
    try {
      await fs.remove(expectedFilePath);
    } catch (error) {
      console.warn(`Could not remove download file`, error);
    }
  });

  it('can pause and resume a download', async () => {
    // Switch to the downloads channel
    await switchToChannel(window.client, 'downloads');

    // Open the downloads panel
    (await window.client.$('#flex_menu_toggle')).click();
    const downloadsBtn = await window.client.$('#downloads');
    assert.ok(await downloadsBtn.waitForDisplayed(2000));
    await downloadsBtn.click();

    // Wait for the panel to show up
    const downloadsHeader = await window.client.$('span=Downloads');
    await downloadsHeader.waitForExist(2000);
    await wait(500);

    // Download the large file
    const fileDesc = await window.client.$('span=test-large-file.zip');
    await fileDesc.click();

    // Pause the download right away
    const pauseBtn = await window.client.$('.p-download_item__link--pause');
    assert.ok(await pauseBtn.waitForDisplayed(5000));
    await pauseBtn.click();

    // We should now have a resume button
    const resumeBtn = await window.client.$('.p-download_item__link--resume');
    assert.ok(await resumeBtn.waitForDisplayed(5000));

    // Let the network pipes cool down (not required, I just want to wait a sec)
    // and check if the file is actually no longer downloading
    const expectedFilePath = path.join(DOWNLOADS_DIR, `test-large-file.zip`);
    const beforeBytes = fs.statSync(expectedFilePath).size;
    await wait(1000);
    const afterBytes = fs.statSync(expectedFilePath).size;
    assert.equal(beforeBytes, afterBytes);

    // Cleanup, or attempted - Windows is weird sometimes
    try {
      await fs.remove(expectedFilePath);
    } catch (error) {
      console.warn(`Could not remove download file`, error);
    }
  });
};
