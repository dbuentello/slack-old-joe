import { assert } from 'chai';
import { shell } from 'electron';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { smokeTeams } from '../smoke-teams';

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('can open a workspace via deep link', async () => {
    for (const { id, name } of smokeTeams) {
      shell.openExternal(`slack://open?team=${id}`);
      await getBrowserViewHandle(client, 300);
      assert.include(await client.getTitle(), name);
    }
  });
};
