import * as robot from 'robotjs';

import { runAppleScript, runAppleScriptFile } from '../utils/applescript';
import { clickDockMenuItem } from '../helpers/click-dock-menu-item';
import { clickWindowMenuItem } from '../helpers/click-window-menu-item';
import { enterMessage } from '../helpers/enter-message';
import { getDevToolsWindowHandle } from '../helpers/get-devtools-window';
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
  sendClickElement,
  sendClickElementRobot
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
import { clickContextMenuItem } from '../helpers/click-context-menu-item';
import { closeFullscreenModal } from '../helpers/close-fullscreen-modal';
import { clearMessageInput } from '../helpers/clear-message-input';
import { centerMouse } from '../native-commands/center-mouse';
import { findHwnds } from '../native-commands/find-hwnds';
import { getIsResetAppDataSheetOpen } from '../native-commands/get-reset-app-data-sheet';
import { getIsNetLogSheetOpen } from '../native-commands/get-restart-net-log-sheet';
import { openContextMenuForElement } from '../helpers/open-context-menu';
import { setSelection } from '../helpers/set-selection';
import { getSonicWindow } from '../helpers/get-sonic-window';
import { getZoomLevel } from '../helpers/get-zoom';
import { sendNotification } from '../helpers/send-notification';
import { moveCursorToElement } from '../helpers/move-cursor';
import { topLeftMouse } from '../native-commands/top-left-mouse';
import { getDockBadgeText } from '../helpers/get-dock-badge-text';

export function registerHelpers() {
  window['helpers'] = {
    centerMouse,
    clearMessageInput,
    clickContextMenuItem,
    clickDockMenuItem,
    clickWindowMenuItem,
    closeFullscreenModal,
    closePreferences,
    disableWifi,
    enableWifi,
    enterMessage,
    findHwnds,
    focus,
    getAboutBoxValue,
    getAboutWindowHandle,
    getDevToolsWindowHandle,
    getDockBadgeText,
    getGpuWindowHandle,
    getIsNetLogSheetOpen,
    getIsResetAppDataSheetOpen,
    getPostWindowHandle,
    getRunningSlackProcessesCount,
    getSignInWindow,
    getSlackPath,
    getSonicWindow,
    getStartupItems,
    getTeamsCount,
    getZoomLevel,
    moveCursorToElement,
    openBrowserAndSignIn,
    openBrowserAndWaitForSignIn,
    openContextMenuForElement,
    openGpuInfoWindow,
    openPreferences,
    openQuickSwitcher,
    runAppleScript,
    runAppleScriptFile,
    runPowerShellScript,
    sendClickElement,
    sendClickElementRobot,
    sendKeyboardEvent,
    sendNativeKeyboardEvent,
    sendNotification,
    sendPointerEvent,
    setSelection,
    switchToChannel,
    switchToTeam,
    topLeftMouse,
    traceClicks,
    wait,
    waitForFile,
    waitForFileInDir
  };

  window['robot'] = robot;
}
