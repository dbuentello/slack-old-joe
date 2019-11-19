import { remote } from 'webdriverio';

import { JoeBrowserObject } from '../interfaces';
import { wait } from '../utils/wait';
import { waitUntilSlackReady } from '../helpers/wait-until-slack-ready';
import { waitUntilSlackClosed } from '../helpers/wait-until-slack-closed';
import { AppState } from './state';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { isMac } from '../utils/os';
import { getUserDir } from '../helpers/get-user-dir';

let _client: null | JoeBrowserObject = null;

export async function getClient(appState: AppState) {
  console.groupCollapsed('Creating client');
  const options: WebdriverIO.RemoteOptions = {
    port: 9515, // "9515" is the port opened by chrome driver.
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        binary: appState.appToTest,
        args: [
          '--remote-debugging-port=12209',
          '--test-type=webdriver',
          `--user-data-dir=${getUserDir()}`
        ]
      }
    }
  };

  _client = (await remote(options)) as JoeBrowserObject;
  _client.restart = async function restart() {
    console.groupCollapsed('Restarting client');
    await this.stop();

    await getClient(appState);
    await wait(1000);

    // We never expect sign-in here, we're not restarting
    // prior to having signed in
    await waitUntilSlackReady(window.client, false);
    console.groupEnd();
  };

  _client.stop = async function stop() {
    console.groupCollapsed('Stopping client');

    // Simply stopping the session means that Slack will
    // likely not have time to save preferences and clean up
    // before being killed
    await sendNativeKeyboardEvent({
      cmd: isMac(),
      ctrl: !isMac(),
      text: 'q'
    });

    await waitUntilSlackClosed(appState);
    await this.deleteSession();

    console.groupEnd();
  };

  _client.kill = async function kill() {
    await this.deleteSession();
    await waitUntilSlackClosed(appState);
  };

  console.groupEnd();

  return (window.client = _client);
}
