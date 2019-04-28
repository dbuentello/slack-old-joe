import { remote } from 'webdriverio';

import { Options, JoeBrowserObject } from '../interfaces';
import { registerHelpers } from './helpers';
import { wait } from '../helpers/wait';
import { waitForClientReady } from '../helpers/wait-for-client-ready';

let _client: null | JoeBrowserObject = null;

export async function getClient(input: Options) {
  if (_client) {
    await _client.deleteSession();
  }

  const options: any = {
    port: 9515, // "9515" is the port opened by chrome driver.
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        binary: input.binary,
        args: ['--remote-debugging-port=12209'] // Optional, perhaps 'app=' + /path/to/your/app/
      }
    }
  };

  _client = (await remote(options)) as any;
  _client!.restart = async () => {
    await getClient(input);
    await wait(1000);
    await waitForClientReady(window.client);
  };

  return (window.client = _client!);
}
