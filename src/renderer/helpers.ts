import { runAppleScript, runAppleScriptFile } from '../helpers/applescript';
import { clickDockMenuItem } from '../helpers/click-dock-menu-item';
import {
  clickWindowMenuItem,
  clickWindowSubMenuItem
} from '../helpers/click-window-menu-item';
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
import { runPowerShellScript } from '../helpers/powershell';
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

export function registerHelpers() {
  window['helpers'] = {
    clickDockMenuItem,
    clickWindowMenuItem,
    clickWindowSubMenuItem,
    closePreferences,
    disableWifi,
    enableWifi,
    enterMessage,
    getBrowserViewHandle,
    getDevToolsWindowHandle,
    getGpuWindowHandle,
    getPostWindowHandle,
    getRendererWindowHandle,
    getSignInWindow,
    getSlackPath,
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
    waitForFile,
    waitForFileInDir
  };
}
