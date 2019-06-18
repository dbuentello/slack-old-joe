import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { wait } from '../utils/wait';
import { fullscreen } from '../native-commands/fullscreen';
import { maximize } from '../native-commands/maximize';
import { minimize } from '../native-commands/minimize';
import { getIsHidden } from '../helpers/get-is-hidden';
import { focus } from '../native-commands/focus';
import { getSonicWindow } from '../helpers/get-sonic-window';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getSonicWindow(window.client);
    await focus();
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
  });

  it('can leave fullscreen', async () => {
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

    assert.notEqual(beforeDimensions, afterDimensions);
  });

  it(
    'can minimize the window',
    async () => {
      assert.ok(!(await getIsHidden(window.client)), 'document.hidden');

      await minimize();
      await wait(1000);

      assert.ok(await getIsHidden(window.client), 'document.hidden');

      // Restore
      await minimize(true);
      await wait(1000);
    },
    { platforms: ['win32', 'darwin'] }
  );

  it(
    'can un-minimize the window',
    async () => {
      await minimize(true);
      await wait(1000);

      assert.ok(!(await getIsHidden(window.client), 'document.hidden'));
    },
    { platforms: ['win32', 'darwin'] }
  );
};
