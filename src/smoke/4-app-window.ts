import * as assert from 'assert';

import { SuiteMethod } from '../interfaces';
import { wait } from '../helpers/wait';
import { fullscreen } from '../native-commands/fullscreen';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { maximize } from '../native-commands/maximize';

export const test: SuiteMethod = async (
  client,
  { it, beforeAll, afterAll, beforeEach, afterEach }
) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('can maximize the window', async () => {
    const beforeDimensions = await client.executeScript('return window.outerHeight', []);

    await maximize();
    await wait(1000);

    const afterDimensions = await client.executeScript('return window.outerHeight', []);

    console.log(beforeDimensions, afterDimensions);

    assert.notEqual(beforeDimensions, afterDimensions);

    // Restore
    await maximize();
    await wait(1000);
  });

  it('can fullscreen the window', async () => {
    const beforeDimensions = await client.executeScript('return window.outerHeight', []);

    await fullscreen();
    await wait(1000);

    const afterDimensions = await client.executeScript('return window.outerHeight', []);

    console.log(beforeDimensions, afterDimensions);

    assert.notEqual(beforeDimensions, afterDimensions);

    // Restore
    await fullscreen();
    await wait(1000);
  });
};
