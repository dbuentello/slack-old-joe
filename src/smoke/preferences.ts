import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { selectNextTeamShortcut } from '../helpers/switch-teams';
import { openPreferences, closePreferences } from '../helpers/open-preferences';
import { wait } from '../utils/wait';
import { enterMessage } from '../helpers/enter-message';
import { getGpuWindowHandle } from '../helpers/get-gpu-info-window';
import { getIsGpuEnabled } from '../helpers/get-gpu-enabled';
import { openGpuInfoWindow } from '../helpers/open-gpu-info-window';

export const test: SuiteMethod = async ({ it, afterAll, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
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
    assert.isFalse(
      setting,
      `hardware acceleration (as noted by Slack's preference store)`
    );
  });

  it('can open the `/slackgpuinfo` window by typing it into the message box', async () => {
    await closePreferences(window.client);
    await enterMessage(window.client, '/slackgpuinfo', true);
    await wait(300);

    assert.ok(
      await getGpuWindowHandle(window.client),
      'the chrome:///gpu window'
    );
  });

  it('has hardware acceleration enabled by default (and is actually using it)', async () => {
    assert.isTrue(
      await getIsGpuEnabled(window.client),
      'hardware acceleration (as reported by Chrome)'
    );

    // Close the window
    await window.client.closeWindow();
    await getBrowserViewHandle(window.client);
  });

  it('persists these setting across teams', async () => {
    await selectNextTeamShortcut(window.client);
    await openPreferences(window.client, 'Advanced');

    const checkboxes = await window.client.$$('.c-input_checkbox');
    const disableHwCheckbox = checkboxes[checkboxes.length - 1];
    assert.ok(
      await disableHwCheckbox.getAttribute('checked'),
      'hardware acceleration checkbox'
    );

    // Switch back
    await closePreferences(window.client);
    await wait(100);
    await selectNextTeamShortcut(window.client);
  });

  it('launches without hardware acceleration on next launch', async () => {
    // The setting should now be at "off", so let's relaunch
    await window.client.restart();

    await openGpuInfoWindow(window.client);

    assert.isFalse(await getIsGpuEnabled(window.client));
    //await window.client.closeWindow();
  });

  it('can enable hardware acceleration', async () => {
    await openPreferences(window.client, 'Advanced');

    const disableHwButton = await window.client.$(
      'strong=Disable hardware acceleration'
    );
    await disableHwButton.click();
    await wait(200);

    const setting = await window.client.executeScript(
      'return desktop.app.getPreference("useHwAcceleration")',
      []
    );
    assert.isTrue(
      setting,
      `hardware acceleration (as noted by Slack's preference store)`
    );
  });

  it('launches with hardware acceleration on next launch', async () => {
    // The setting should now be at "off", so let's relaunch
    await window.client.restart();
    await openGpuInfoWindow(window.client);

    assert.isTrue(
      await getIsGpuEnabled(window.client),
      'hardware acceleration (as reported by Chrome)'
    );

    await window.client.closeWindow();
  });

  it('can enable launch on login', async () => {}, ['win32']);

  it('can disable launch on login', async () => {}, ['win32']);

  it('has Windows notification methods', async () => {}, ['win32']);
};
