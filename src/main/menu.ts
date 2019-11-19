import { app, shell, dialog, BrowserWindow } from 'electron';
import menu from 'electron-create-menu';
import contextMenu from 'electron-context-menu';
import * as fs from 'fs-extra';

import { getOsaScriptPath } from '../utils/osascript';

function getShowItem(fileGetter: () => string, name: string): Electron.MenuItemConstructorOptions {
  return {
    label: `Show "${name}" in Finder`,
    click() {
      try {
        const filePath = fileGetter();

        if (!filePath) {
          throw new Error(`Could not get path for ${name}`);
        }

        if (!fs.existsSync(filePath)) {
          throw new Error(`Expected ${name} at ${filePath}, but it does not exist`);
        }

        shell.showItemInFolder(filePath);
      } catch (error) {
        dialog.showErrorBox(`Error`, `Could not show ${name}: ${error}`);
      }
    }
  }
}

function getHowToAutomationItem(): Electron.MenuItemConstructorOptions {
  return {
    label: 'How to enable automation',
    click() {
      const window = BrowserWindow.getAllWindows()[0];

      if (window) {
        dialog.showMessageBox(
          {
            title: 'How to enable automation?',
            message: 'In order for Old Joe to function properly on macOS, you need to allow its automation properties. Open the macOS System Preferences and find the "Security" settings. Then, add all the items in this menu to the "Automation" and "Accessibility" groups.',
            buttons: [ 'Ok' ],
            type: 'info',

          },
          () => {}
        )
      }
    }
  }
}

/**
 * Setup the menu
 *
 * @export
 */
export function setupMenu() {
  menu((defaultMenu: Array<Electron.MenuItemConstructorOptions>) => {
    if (Array.isArray(defaultMenu[0].submenu)) {
      defaultMenu[0].submenu.push({
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          app.quit();
        }
      });
    }

    // Add links to tools we need
    if (process.platform === 'darwin') {
      const helpMenu = defaultMenu[defaultMenu.length - 1].submenu;

      if (Array.isArray(helpMenu)) {
        helpMenu.push(
          getShowItem(getOsaScriptPath, 'osascript'),
          getShowItem(() => `/System/Library/CoreServices/System Events.app`, 'System Events'),
          getShowItem(() => process.execPath, 'old-joe'),
          { type: 'separator' },
          getHowToAutomationItem()
        );
      }
    }


    return defaultMenu;
  });

  contextMenu();
}
