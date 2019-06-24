import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { openPreferences, closePreferences } from '../helpers/open-preferences';
import { wait } from '../utils/wait';
import { enterMessage } from '../helpers/enter-message';
import { getGpuWindowHandle } from '../helpers/get-gpu-info-window';
import { getIsGpuEnabled } from '../helpers/get-gpu-enabled';
import { openGpuInfoWindow } from '../helpers/open-gpu-info-window';
import { getStartupItems } from '../helpers/get-startup-items';
import { focus } from '../native-commands/focus';
import { sendClickElement, PointerEvents } from '../helpers/send-pointer-event';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { getPreference } from '../helpers/get-preference';
import { getSonicWindow } from '../helpers/get-sonic-window';

export const test: SuiteMethod = async ({ it, beforeAll }) => {
  beforeAll(async () => {
    await getSonicWindow(window.client);
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
    await wait(500);

    const disableHwButton = await window.client.$(
      'strong=Disable hardware acceleration'
    );
    await disableHwButton.waitForExist(1000);
    await disableHwButton.click();
    await wait(500);

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
    await wait(500);

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
    await getSonicWindow(window.client);
  });

  it('launches without hardware acceleration on next launch', async () => {
    // The setting should now be at "off", so let's relaunch
    await window.client.restart();
    await focus();

    await openGpuInfoWindow(window.client);

    assert.isFalse(await getIsGpuEnabled(window.client));
  });

  it('can enable hardware acceleration', async () => {
    await focus();
    await openPreferences(window.client, 'Advanced');

    const disableHwButton = await window.client.$(
      'strong=Disable hardware acceleration'
    );
    await disableHwButton.click();
    await wait(500);

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
    await focus();
    await openGpuInfoWindow(window.client);

    assert.isTrue(
      await getIsGpuEnabled(window.client),
      'hardware acceleration (as reported by Chrome)'
    );

    await window.client.closeWindow();
  });

  it(
    'can enable launch on login',
    async () => {
      await focus();
      await openPreferences(window.client, 'Advanced');
      const launchOnLoginSpan = await window.client.$(
        `span=Launch app on login`
      );
      await launchOnLoginSpan.waitForExist(1000);

      // Currently enabled?
      const currentStartupItems = await getStartupItems();
      const currentlyEnabled = currentStartupItems.length > 0;

      // If currently enabled, we can apparently enable it
      if (currentlyEnabled) {
        assert.ok(currentlyEnabled, 'Slack launch on login');
      } else {
        await launchOnLoginSpan.click();
        await wait(1000);

        const newStartupItems = await getStartupItems();
        const newEnabled = newStartupItems.length > 0;

        assert.ok(newEnabled, 'Slack launch on login');
      }
    },
    { platforms: ['win32'] }
  );

  it(
    'can disable launch on login',
    async () => {
      // Because of the last test, launch on login should be enabled
      // Let's disable it
      const launchOnLoginSpan = await window.client.$(
        `span=Launch app on login`
      );
      await launchOnLoginSpan.click();
      await wait(1000);

      const startupItems = await getStartupItems();

      assert.equal(startupItems.length, 0, 'number of Slack startup items');
    },
    { platforms: ['win32'] }
  );

  it(
    'has Windows notification methods',
    async () => {
      await openPreferences(window.client, 'Notifications');

      const notificationsButton = await window.client.$(
        '#winssb_notification_method_button'
      );
      await notificationsButton.waitForExist(1000);
      await notificationsButton.click();

      // We're expecting three options
      const options = [
        '#winssb_notification_method_option_0',
        '#winssb_notification_method_option_1',
        '#winssb_notification_method_option_2'
      ];

      for (const option of options) {
        const element = await window.client.$(option);
        await element.waitForExist(1000);
        assert.ok(await element.isExisting());
      }
    },
    { platforms: ['win32'] }
  );

  it(
    'can select the HTML notifications',
    async () => {
      await sendClickElement(window.client, {
        selector: '#winssb_notification_method_option_1',
        rightClick: false,
        type: PointerEvents.MOUSEDOWN
      });
      await sendClickElement(window.client, {
        selector: '#winssb_notification_method_option_1',
        rightClick: false,
        type: PointerEvents.MOUSEUP
      });

      const notificationsButton = await window.client.$(
        '#winssb_notification_method_button'
      );
      await notificationsButton.waitForExist(1000);
      await notificationsButton.click();

      await sendClickElement(window.client, {
        selector: '#winssb_notification_method_option_0',
        rightClick: false,
        type: PointerEvents.MOUSEDOWN
      });
      await sendClickElement(window.client, {
        selector: '#winssb_notification_method_option_0',
        rightClick: false,
        type: PointerEvents.MOUSEUP
      });

      // Click somewhere else
      await sendNativeKeyboardEvent({ text: 'escape' });
      await closePreferences(window.client);

      const notificatonMethod = await getPreference(
        window.client,
        'notificationMethod'
      );
      assert.equal(notificatonMethod, 'html');
    },
    { platforms: ['win32'] }
  );
};
