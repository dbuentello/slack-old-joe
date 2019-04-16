import { remote } from 'webdriverio';

import { getSlackPath } from '../helpers/get-slack-path';
import { Options } from '../interfaces';

let _client: null | BrowserObject = null;

export async function getClient(input: Options) {
  if (_client) {
    await _client.closeApp();
  }

  const options: WebDriver.Options = {
    port: 9515, // "9515" is the port opened by chrome driver.
    capabilities: {
      browserName: 'chrome',
      chromeOptions: {
        binary: await getSlackPath(input.version),
        args: ['--remote-debugging-port=12209'] // Optional, perhaps 'app=' + /path/to/your/app/
      }
    }
  };

  return (_client = await remote(options));
}
