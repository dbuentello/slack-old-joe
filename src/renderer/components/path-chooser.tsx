import { remote } from 'electron';
import { appState } from '../state';

export function chooseFolder() {
  const currentWindow = remote.BrowserWindow.getAllWindows()[0];
  
  let filePaths = remote.dialog.showOpenDialog(
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
  let results = remote.dialog.showOpenDialog(currentWindow, {
    title: 'Choose where to add report',
    properties: ['openDirectory']
  });
  if (results != undefined) {
    return results[0];
  } else {
    return '';
  }
}
