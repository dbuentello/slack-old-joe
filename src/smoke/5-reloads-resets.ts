import * as assert from 'assert';

import { SuiteMethod } from '../interfaces';
import { wait } from '../helpers/wait';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { reload } from '../native-commands/reload';

export const test: SuiteMethod = async (
  client,
  { it, beforeAll, afterAll, beforeEach, afterEach }
) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('can reload a workspace', async () => {
    // Leave a breadcrumb to check that we've reloaded
    assert.ok(
      await client.executeScript('return window.__old_joe_was_here = true', [])
    );

    await reload();
    await wait(500);

    // Wait for the client ui
    await (await client.$('#client-ui')).waitForExist(10000);

    // Our breadcrumb should be gone now
    assert.ok(
      !(await client.executeScript('return window.__old_joe_was_here', []))
    );
  });
};
