import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { selectNextTeamShortcut } from '../helpers/switch-teams';
import { openPreferences, closePreferences } from '../helpers/open-preferences';
import { isWin } from '../helpers/os';
import { wait } from '../helpers/wait';

export const test: SuiteMethod = async (client, { it, afterAll, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  afterAll(async () => {
    await closePreferences(client);
  })

  it('can open the preferences', async () => {
    assert.ok(await openPreferences(client), 'could not open preferences');
  });

  it('can disable hardware acceleration', async () => {
    const advancedButton = await client.$('button=Advanced');
    await advancedButton.click();
    await wait(100);

    const disableHwButton = await client.$('strong=Disable hardware acceleration');
    await disableHwButton.waitForExist(1000);
    await disableHwButton.click();
    await wait(200);

    const setting = await client.executeScript('return desktop.app.getPreference("useHwAcceleration")', []);
    assert.equal(setting, false, 'Setting has not been disabled');
  });

  it('persists these setting across teams', async () => {
    await selectNextTeamShortcut(client);
    await openPreferences(client);

    const advancedButton = await client.$('button=Advanced');
    await advancedButton.click();
    await wait(100);

    const checkboxes = await client.$$('.c-input_checkbox');
    const disableHwCheckbox = checkboxes[checkboxes.length - 1];
    assert.ok(await disableHwCheckbox.getAttribute('checked'), 'checkbox is not checked');

    // Switch back
    await closePreferences(client);
    await wait(100);
    await selectNextTeamShortcut(client);
  });

  it('can enable hardware acceleration', async () => {
    const disableHwButton = await client.$('strong=Disable hardware acceleration');
    await disableHwButton.click();
    await wait(200);

    const setting = await client.executeScript('return desktop.app.getPreference("useHwAcceleration")', []);
    assert.equal(setting, true, 'Setting has not been enabled');
  });

  it('can enable launch on login (Windows)', async () => {
    if (!isWin()) return;
  });

  it('can disable launch on login (Windows)', async () => {
    if (!isWin()) return;
  });

  it('has Windows notification methods', async () => {
    if (!isWin()) return;
  });
};
