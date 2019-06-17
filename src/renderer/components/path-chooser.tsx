
import { remote } from 'electron';
import { AppState, appState } from '../state';
import { writeReport } from '../../report';

export async function chooseFolder() {
    console.log("💁‍♀️");
    const currentWindow = remote.BrowserWindow.getAllWindows()[0];

    remote.dialog.showOpenDialog(
        currentWindow,
        {
        title: 'Choose where to add report',
        properties: ['openDirectory']
        // defaultPath: path.dirname("Documents/")
        },
        filePaths => {
            if (filePaths[0]) {
                console.log(filePaths);
                writeReport(appState.results, filePaths[0]);
            }
        }
    );
}
