import { remote } from 'electron';
import { appState } from '../state';

export function chooseFolder() {
  const currentWindow = remote.BrowserWindow.getAllWindows()[0];
  
  const filePaths = remote.dialog.showOpenDialog(
    currentWindow,
    {
      title: 'Choose where to add report',
      properties: ['openDirectory']
    }
  );
  if (filePaths != undefined) {
    appState.absPath = filePaths[0];
  }
}

export function chooseFolderAsString() {
  const currentWindow = remote.BrowserWindow.getAllWindows()[0];
  const results = remote.dialog.showOpenDialog(currentWindow, {
    title: 'Choose where to add report',
    properties: ['openDirectory']
  });
  return (results && results[0]) ? results[0] : '';
}
