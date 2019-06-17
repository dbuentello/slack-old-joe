import { remote } from 'electron';
import { AppState, appState } from '../state';
import { writeReport } from '../../report';

export async function chooseFolder() {
  const currentWindow = remote.BrowserWindow.getAllWindows()[0];

  remote.dialog.showOpenDialog(
    currentWindow,
    {
      title: 'Choose where to add report',
      properties: ['openDirectory']
    },
    filePaths => {
      if (filePaths[0]) {
        writeReport(appState.results, filePaths[0]);
      }
    }
  );
}
