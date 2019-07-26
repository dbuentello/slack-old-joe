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

    assert.notEqual(
      beforeDimensions,
      afterDimensions,
      'Window dimensions should not equal each other after maximizing the window.'
    );

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

    assert.notEqual(
      beforeDimensions,
      afterDimensions,
      `Fullscreen window should not have the same dimensions as the previous window. ${beforeDimensions} != ${afterDimensions} `
    );
  });

  // Is this test meant to be written this way? Ask Felix
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

    assert.notEqual(
      beforeDimensions,
      afterDimensions,
      `Window dimensions should not match after leaving fullscreen. ${beforeDimensions} != ${afterDimensions} `
    );
  });

  it(
    'can minimize the window',
    async () => {
      assert.ok(!(await getIsHidden(window.client)), 'Window is visible');

      await minimize();
      await wait(4000);

      assert.ok(await getIsHidden(window.client), 'Window is not minimized');
    },
    { platforms: ['win32', 'darwin'] }
  );

  it(
    'can un-minimize the window',
    async () => {
      await minimize(true);
      await wait(2000);

      assert.ok(!(await getIsHidden(window.client)), 'document.hidden');
    },
    { platforms: ['win32', 'darwin'] }
  );
};
