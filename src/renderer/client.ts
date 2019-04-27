import { remote } from 'webdriverio';

import { Options } from '../interfaces';
import { registerHelpers } from './helpers';
import { wait } from '../helpers/wait';

let _client: null | BrowserObject = null;

export async function getClient(input: Options) {
  if (_client) {
    await _client.closeApp();
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

  _client = await remote(options);
  _client['restart'] = async () => {
    await getClient(input);
    await wait(2000);
  };

  return (window['client'] = _client);
}

registerHelpers();
