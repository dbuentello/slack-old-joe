import { ipcMain } from 'electron';
import { IpcChannels } from '../interfaces';

export function setupReporter() {
  ipcMain.on(IpcChannels.log, (_event: Electron.Event, message: string) => {
    console.log(message);
  });
}
