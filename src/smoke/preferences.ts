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
import { getStartupItems } from '../helpers/get-startup-items';
import { getNotificationsWindowHandle } from '../helpers/get-notifications-window';
import { focus } from '../native-commands/focus';
import { sendClickElement, PointerEvents } from '../helpers/send-pointer-event';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { getPreference } from '../helpers/get-preference';

export const test: SuiteMethod = async ({ it, afterAll, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(window.client);
  });

  // it('can open the preferences', async () => {
  //   assert.ok(
  //     await openPreferences(window.client),
  //     'could not open preferences'
  //   );
  // });

  // it('can disable hardware acceleration', async () => {
  //   const advancedButton = await window.client.$('button=Advanced');
  //   await advancedButton.click();
  //   await wait(100);

  //   const disableHwButton = await window.client.$(
  //     'strong=Disable hardware acceleration'
  //   );
  //   await disableHwButton.waitForExist(1000);
  //   await disableHwButton.click();
  //   await wait(200);

  //   const setting = await window.client.executeScript(
  //     'return desktop.app.getPreference("useHwAcceleration")',
  //     []
  //   );
  //   assert.isFalse(
  //     setting,
  //     `hardware acceleration (as noted by Slack's preference store)`
  //   );
  // });

  // it('can open the `/slackgpuinfo` window by typing it into the message box', async () => {
  //   await closePreferences(window.client);
  //   await enterMessage(window.client, '/slackgpuinfo', true);
  //   await wait(300);

  //   assert.ok(
  //     await getGpuWindowHandle(window.client),
  //     'the chrome:///gpu window'
  //   );
  // });

  // it('has hardware acceleration enabled by default (and is actually using it)', async () => {
  //   assert.isTrue(
  //     await getIsGpuEnabled(window.client),
  //     'hardware acceleration (as reported by Chrome)'
  //   );

  //   // Close the window
  //   await window.client.closeWindow();
  //   await getBrowserViewHandle(window.client);
  // });

  // it('persists these setting across teams', async () => {
  //   await selectNextTeamShortcut(window.client);
  //   await openPreferences(window.client, 'Advanced');

  //   const checkboxes = await window.client.$$('.c-input_checkbox');
  //   const disableHwCheckbox = checkboxes[checkboxes.length - 1];
  //   assert.ok(
  //     await disableHwCheckbox.getAttribute('checked'),
  //     'hardware acceleration checkbox'
  //   );

  //   // Switch back
  //   await closePreferences(window.client);
  //   await wait(100);
  //   await selectNextTeamShortcut(window.client);
  // });

  // it('launches without hardware acceleration on next launch', async () => {
  //   // The setting should now be at "off", so let's relaunch
  //   await window.client.restart();
  //   await focus();

  //   await openGpuInfoWindow(window.client);

  //   assert.isFalse(await getIsGpuEnabled(window.client));
  //   await window.client.closeWindow();
  // });

  // it('can enable hardware acceleration', async () => {
  //   await focus();
  //   await openPreferences(window.client, 'Advanced');

  //   const disableHwButton = await window.client.$(
  //     'strong=Disable hardware acceleration'
  //   );
  //   await disableHwButton.click();
  //   await wait(200);

  //   const setting = await window.client.executeScript(
  //     'return desktop.app.getPreference("useHwAcceleration")',
  //     []
  //   );
  //   assert.isTrue(
  //     setting,
  //     `hardware acceleration (as noted by Slack's preference store)`
  //   );
  // });

  // it('launches with hardware acceleration on next launch', async () => {
  //   // The setting should now be at "off", so let's relaunch
  //   await window.client.restart();
  //   await focus();
  //   await openGpuInfoWindow(window.client);

  //   assert.isTrue(
  //     await getIsGpuEnabled(window.client),
  //     'hardware acceleration (as reported by Chrome)'
  //   );

  //   await window.client.closeWindow();
  // });

  it('can enable launch on login', async () => {
    await focus();
    await openPreferences(window.client, 'Advanced');
    const launchOnLoginSpan = await window.client.$(`span=Launch app on login`);
    await launchOnLoginSpan.waitForExist(1000);

    // Currently enabled?
    const currentStartupItems = await getStartupItems();
    const currentlyEnabled = currentStartupItems.length > 0;

    // If currently enabled, we can apparently enable it
    if (currentlyEnabled) {
      assert.ok(currentlyEnabled, 'Slack launch on login');
    } else {
      await launchOnLoginSpan.click();
      await wait(600);

      const newStartupItems = await getStartupItems();
      const newEnabled = newStartupItems.length > 0;

      assert.ok(newEnabled, 'Slack launch on login');
    }
  }, ['win32']);

  it('can disable launch on login', async () => {
    // Because of the last test, launch on login should be enabled
    // Let's disable it
    const launchOnLoginSpan = await window.client.$(`span=Launch app on login`);
    await launchOnLoginSpan.click();
    await wait(600);

    const startupItems = await getStartupItems();

    assert.equal(startupItems.length, 0, 'number of Slack startup items');
  }, ['win32']);

  it('has Windows notification methods', async () => {
    await openPreferences(window.client, 'Notifications');

    const notificationsButton = await window.client.$('#winssb_notification_method_button');
    await notificationsButton.waitForExist(1000);
    await notificationsButton.click();

    // We're expecting three options
    const options = [
      '#winssb_notification_method_option_0',
      '#winssb_notification_method_option_1',
      '#winssb_notification_method_option_2',
    ]

    for (const option of options) {
      const element = await window.client.$(option);
      await element.waitForExist(500);
      assert.ok(await element.isExisting());
    }
  }, ['win32']);

  it('can select the HTML notifications', async () => {
    await sendClickElement(window.client, '#winssb_notification_method_option_1', false, PointerEvents.MOUSEDOWN);
    await sendClickElement(window.client, '#winssb_notification_method_option_1', false, PointerEvents.MOUSEUP);

    const notificationsButton = await window.client.$('#winssb_notification_method_button');
    await notificationsButton.waitForExist(1000);
    await notificationsButton.click();

    await sendClickElement(window.client, '#winssb_notification_method_option_0', false, PointerEvents.MOUSEDOWN);
    await sendClickElement(window.client, '#winssb_notification_method_option_0', false, PointerEvents.MOUSEUP);

    // Click somewhere else
    await sendNativeKeyboardEvent({ text: 'escape' });
    await closePreferences(window.client);

    const notificatonMethod = await getPreference(window.client, 'notificationMethod');
    assert.equal(notificatonMethod, 'html');
  }, ['win32']);
};
