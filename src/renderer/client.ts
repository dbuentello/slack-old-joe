import { remote } from 'webdriverio';

import { JoeBrowserObject } from '../interfaces';
import { wait } from '../utils/wait';
import { waitUntilSlackReady } from '../helpers/wait-until-slack-ready';
import { waitUntilSlackClosed } from '../helpers/wait-until-slack-closed';
import { AppState } from './state';
import { sendNativeKeyboardEvent } from '../helpers/send-keyboard-event';
import { isMac, isWin } from '../utils/os';

let _client: null | JoeBrowserObject = null;

export async function getClient(appState: AppState) {
  console.groupCollapsed('Creating client');
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
    const sessions = await this.getSessions();

    if (sessions.length > 0) {
      // Simply stopping the session means that Slack will
      // likely not have time to save preferences and clean up
      // before being killed. On Windows. Boy.
      if (!isWin()) await this.deleteSession();

      await sendNativeKeyboardEvent({
        cmd: isMac(),
        ctrl: !isMac(),
        text: 'q'
      });
      await waitUntilSlackClosed(appState);

      // See comment above
      if (isWin()) await this.deleteSession();
    }
    console.groupEnd();
  };

  console.groupEnd();

  return (window.client = _client);
}
