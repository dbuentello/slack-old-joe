import { remote } from 'webdriverio';

import { JoeBrowserObject } from '../interfaces';
import { wait } from '../helpers/wait';
import { waitUntilSlackReady } from '../helpers/wait-until-slack-ready';
import { waitForSlackClosed } from '../helpers/wait-until-slack-closed';
import { AppState } from './state';

let _client: null | JoeBrowserObject = null;

export async function getClient(appState: AppState) {
  const options: any = {
    port: 9515, // "9515" is the port opened by chrome driver.
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        binary: appState.appToTest,
        args: ['--remote-debugging-port=12209'] // Optional, perhaps 'app=' + /path/to/your/app/
      }
    }
  };

  _client = await remote(options) as JoeBrowserObject;
  _client.restart = async function restart () {
    await this.stop();
    await getClient(appState);
    await wait(1000);
    await waitUntilSlackReady(window.client);
  };

  _client.stop = async function stop() {
    await this.deleteSession();
    await waitForSlackClosed(appState.appToTest);
  }

  return window.client = _client;
}
