import { remote } from 'webdriverio';

import { JoeBrowserObject } from '../interfaces';
import { wait } from '../utils/wait';
import { waitUntilSlackReady } from '../helpers/wait-until-slack-ready';
import { waitUntilSlackClosed } from '../helpers/wait-until-slack-closed';
import { AppState } from './state';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { isMac } from '../utils/os';
import { isSignInDisabled } from '../utils/is-sign-in-disabled';

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

  _client = (await remote(options)) as JoeBrowserObject;
  _client.restart = async function restart() {
    await this.stop();

    await getClient(appState);
    await wait(1000);
    await waitUntilSlackReady(window.client, !isSignInDisabled(appState));
  };

  _client.stop = async function stop() {
    const sessions = await this.getSessions();

    if (sessions.length > 0) {
      // Simply stopping the session means that Slack will
      // likely not have time to save preferences and clean up
      // before being killed
      await sendNativeKeyboardEvent({
        cmd: isMac(),
        ctrl: !isMac(),
        text: 'q'
      });
      await waitUntilSlackClosed(appState.appToTest);
      await this.deleteSession();
    }
  };

  return (window.client = _client);
}
