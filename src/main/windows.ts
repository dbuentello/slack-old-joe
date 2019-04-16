import { BrowserWindow, shell, screen } from 'electron';

// Keep a global reference of the window objects, if we don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
export let browserWindows: Array<BrowserWindow> = [];

/**
 * Gets default options for the main window
 *
 * @returns {Electron.BrowserWindowConstructorOptions}
 */
export function getMainWindowOptions(): Electron.BrowserWindowConstructorOptions {
  const display = screen.getPrimaryDisplay();
  const width = 400;
  const height = 800;
  const x = display.bounds.width - width - 50;
  const y = display.bounds.height - height - 50;

  return {
    width,
    height,
    x,
    y,
    acceptFirstMouse: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      webviewTag: false
    }
  };
}

/**
 * Creates a new main window.
 *
 * @export
 * @returns {Electron.BrowserWindow}
 */
export function createMainWindow(): Electron.BrowserWindow {
  console.log(`Creating main window`);
  const browserWindow = new BrowserWindow(getMainWindowOptions());
  browserWindow.loadFile('./dist/static/index.html');

  browserWindow.webContents.once('dom-ready', () => {
    browserWindow.show();
  });

  browserWindow.on('closed', () => {
    browserWindows = browserWindows.filter(bw => browserWindow !== bw);
  });

  browserWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  browserWindow.webContents.on('will-navigate', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  browserWindows.push(browserWindow);

  return browserWindow;
}

/**
 * Gets or creates the main window, returning it in both cases.
 *
 * @returns {Electron.BrowserWindow}
 */
export function getOrCreateMainWindow(): Electron.BrowserWindow {
  return (
    BrowserWindow.getFocusedWindow() || browserWindows[0] || createMainWindow()
  );
}
