import * as menu from 'electron-create-menu';
import * as contextMenu from 'electron-context-menu';

/**
 * Setup the menu
 *
 * @export
 */
export function setupMenu() {
  menu();
  contextMenu();
}
