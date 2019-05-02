import * as robot from 'robotjs';

import { runAppleScript, runAppleScriptFile } from '../utils/applescript';
import { clickDockMenuItem } from '../helpers/click-dock-menu-item';
import { clickWindowMenuItem } from '../helpers/click-window-menu-item';
import { enterMessage } from '../helpers/enter-message';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { getDevToolsWindowHandle } from '../helpers/get-devtools-window';
import { getRendererWindowHandle } from '../helpers/get-renderer-window';
import { getPostWindowHandle } from '../helpers/get-posts-window';
import { getSignInWindow } from '../helpers/get-sign-in-window';
import { getSlackPath } from '../helpers/get-slack-path';
import { getTeamsCount } from '../helpers/get-teams-count';
import {
  openBrowserAndSignIn,
  openBrowserAndWaitForSignIn
} from '../helpers/open-browser-and-sign-in';
import { openQuickSwitcher } from '../helpers/open-quick-switcher';
import { runPowerShellScript } from '../utils/powershell';
import {
  sendKeyboardEvent,
  sendNativeKeyboardEvent
} from '../helpers/send-keyboard-event';
import { openPreferences, closePreferences } from '../helpers/open-preferences';
import { switchToChannel } from '../helpers/switch-channel';
import { waitForFile, waitForFileInDir } from '../helpers/wait-for-file';
import { switchToTeam } from '../helpers/switch-teams';
import {
  sendPointerEvent,
  sendClickElement
} from '../helpers/send-pointer-event';
import { enableWifi, disableWifi } from '../native-commands/wifi';
import { getGpuWindowHandle } from '../helpers/get-gpu-info-window';
import { openGpuInfoWindow } from '../helpers/open-gpu-info-window';
import { getAboutWindowHandle } from '../helpers/get-about-window';
import { getAboutBoxValue } from '../native-commands/mac-about-dialog';
import { getStartupItems } from '../helpers/get-startup-items';
import { getRunningSlackProcessesCount } from '../helpers/get-running-slack-processes';
import { focus } from '../native-commands/focus';
import { traceClicks } from '../helpers/trace-clicks';
import { wait } from '../utils/wait';

export function registerHelpers() {
  window['helpers'] = {
    clickDockMenuItem,
    clickWindowMenuItem,
    closePreferences,
    disableWifi,
    enableWifi,
    enterMessage,
    focus,
    getAboutBoxValue,
    getAboutWindowHandle,
    getBrowserViewHandle,
    getDevToolsWindowHandle,
    getGpuWindowHandle,
    getPostWindowHandle,
    getRendererWindowHandle,
    getRunningSlackProcessesCount,
    getSignInWindow,
    getSlackPath,
    getStartupItems,
    getTeamsCount,
    openBrowserAndSignIn,
    openBrowserAndWaitForSignIn,
    openGpuInfoWindow,
    openPreferences,
    openQuickSwitcher,
    runAppleScript,
    runAppleScriptFile,
    runPowerShellScript,
    sendClickElement,
    sendKeyboardEvent,
    sendNativeKeyboardEvent,
    sendPointerEvent,
    switchToChannel,
    switchToTeam,
    traceClicks,
    wait,
    waitForFile,
    waitForFileInDir
  };

  window['robot'] = robot;
}
