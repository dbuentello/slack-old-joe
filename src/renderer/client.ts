import { remote } from 'webdriverio';

import { Options } from '../interfaces';
import { registerHelpers } from './helpers';

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

  registerHelpers();
  return (window['client'] = _client = await remote(options));
}
