import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { fullscreen } from '../native-commands/fullscreen';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { maximize } from '../native-commands/maximize';
import { minimize } from '../native-commands/minimize';
import { getIsHidden } from '../helpers/get-is-hidden';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  it('can maximize the window', async () => {
    const beforeDimensions = await window.client.executeScript(
      'return window.outerHeight',
      []
    );

    await maximize();
    await wait(1000);

    const afterDimensions = await window.client.executeScript(
      'return window.outerHeight',
      []
    );

    console.log(beforeDimensions, afterDimensions);

    assert.notEqual(beforeDimensions, afterDimensions);

    // Restore
    await maximize();
    await wait(1000);
  });

  it('can fullscreen the window', async () => {
    const beforeDimensions = await window.client.executeScript(
      'return window.outerHeight',
      []
    );

    await fullscreen();
    await wait(1000);

    const afterDimensions = await window.client.executeScript(
      'return window.outerHeight',
      []
    );

    console.log(beforeDimensions, afterDimensions);

    assert.notEqual(beforeDimensions, afterDimensions);

    // Restore
    await fullscreen();
    await wait(1000);
  });

  it('can minimize the window', async () => {
    assert.ok(!(await getIsHidden(window.client)), 'document.hidden');

    await minimize();
    await wait(1000);

    assert.ok(await getIsHidden(window.client), 'document.hidden');

    // Restore
    await minimize(true);
    await wait(1000);
  });
};
