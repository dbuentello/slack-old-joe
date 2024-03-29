import { app } from 'electron';

import { getOrCreateMainWindow } from './windows';
import { shouldQuit } from './squirrel';
import { setupMenu } from './menu';
import { setupReporter } from './reporter';
import { deleteOldJoeFolders } from '../helpers/clean-restore';

/**
 * Handle the app's "ready" event. This is essentially
 * the method that takes care of booting the application.
 */
export async function onReady() {
  setupMenu();
  getOrCreateMainWindow();
}

/**
 * Handle the "before-quit" event
 *
 * @export
 */
export function onBeforeQuit() {
  deleteOldJoeFolders();
  (global as any).isQuitting = true;
}

/**
 * All windows have been closed, quit on anything but
 * macOS.
 */
export function onWindowsAllClosed() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  deleteOldJoeFolders();
  app.quit();
}

/**
 * The main method - and the first function to run
 * when Fiddle is launched.
 *
 * Exported for testing purposes.
 */
export function main() {
  // Handle creating/removing shortcuts on Windows when
  // installing/uninstalling.
  if (shouldQuit()) {
    app.quit();
    return;
  }

  // Set the app's name
  app.setName('Old Joe');

  // Launch
  app.on('ready', onReady);
  app.on('before-quit', onBeforeQuit);
  app.on('window-all-closed', onWindowsAllClosed);
  app.on('activate', getOrCreateMainWindow);

  setupReporter();
}

main();
