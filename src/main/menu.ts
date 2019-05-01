import { app } from 'electron';
import menu from 'electron-create-menu';
import contextMenu from 'electron-context-menu';

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

    return defaultMenu;
  });
  contextMenu();
}
