import * as assert from 'assert';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import {
  getAboutBoxValue,
  openAboutBox,
  closeAboutBox
} from '../native-commands/mac-about-dialog';

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('(Mac) opens about dialog and displays the correct version string', async () => {
    if (process.platform !== 'darwin') return;

    // Make sure that we make a blacklist of logs files we won't
    // accept because they already exist
    await openAboutBox();

    // What version do we expect?
    await getBrowserViewHandle(client);

    // Returns
    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko)
    // AtomShell/3.4.1-beta3179ea19 Chrome/69.0.3497.128 Electron/4.1.3 Safari/537.36 Slack_SSB/3.4.1"
    const userAgent: string = await client.executeScript(
      'return navigator.userAgent',
      []
    );
    const aboutBoxValue: string = await getAboutBoxValue();
    const simpleVersion = userAgent.slice(userAgent.indexOf('Slack_SSB') + 10);
    const fullVersion = userAgent.slice(
      userAgent.indexOf('AtomShell') + 10,
      userAgent.indexOf(' Chrome')
    );

    console.log(aboutBoxValue, simpleVersion, fullVersion);

    assert.ok(aboutBoxValue.includes(simpleVersion));

    if (fullVersion.includes('alpha') || fullVersion.includes('beta')) {
      // Covers alpha, beta, etc
      assert.ok(
        aboutBoxValue.toLowerCase().includes('alpha') ||
          aboutBoxValue.includes('beta')
      );
    }

    // Close window
    await closeAboutBox();
  });
};
