import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { selectNextTeamShortcut } from '../helpers/switch-teams';
import { openPreferences, closePreferences } from '../helpers/open-preferences';
import { isWin } from '../helpers/os';
import { wait } from '../helpers/wait';

export const test: SuiteMethod = async ({ it, afterAll, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  afterAll(async () => {
    await closePreferences(window.client);
  });

  it('can open the preferences', async () => {
    assert.ok(
      await openPreferences(window.client),
      'could not open preferences'
    );
  });

  it('can disable hardware acceleration', async () => {
    const advancedButton = await window.client.$('button=Advanced');
    await advancedButton.click();
    await wait(100);

    const disableHwButton = await window.client.$(
      'strong=Disable hardware acceleration'
    );
    await disableHwButton.waitForExist(1000);
    await disableHwButton.click();
    await wait(200);

    const setting = await window.client.executeScript(
      'return desktop.app.getPreference("useHwAcceleration")',
      []
    );
    assert.equal(setting, false, 'Setting has not been disabled');
  });

  it('persists these setting across teams', async () => {
    await selectNextTeamShortcut(window.client);
    await openPreferences(window.client);

    const advancedButton = await window.client.$('button=Advanced');
    await advancedButton.click();
    await wait(100);

    const checkboxes = await window.client.$$('.c-input_checkbox');
    const disableHwCheckbox = checkboxes[checkboxes.length - 1];
    assert.ok(
      await disableHwCheckbox.getAttribute('checked'),
      'checkbox is not checked'
    );

    // Switch back
    await closePreferences(window.client);
    await wait(100);
    await selectNextTeamShortcut(window.client);
  });

  it('can enable hardware acceleration', async () => {
    const disableHwButton = await window.client.$(
      'strong=Disable hardware acceleration'
    );
    await disableHwButton.click();
    await wait(200);

    const setting = await window.client.executeScript(
      'return desktop.app.getPreference("useHwAcceleration")',
      []
    );
    assert.equal(setting, true, 'Setting has not been enabled');
  });

  it('can enable launch on login (Windows)', async () => {
    if (!isWin()) return;
  });

  it('can disable launch on login (Windows)', async () => {
    if (!isWin()) return;
  });

  it('has Windows notification methods (Windows)', async () => {
    if (!isWin()) return;
  });
};
