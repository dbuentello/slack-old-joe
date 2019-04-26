import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import { getBrowserViewHandle } from '../helpers/get-browser-view';
import { selectNextTeamShortcut } from '../helpers/switch-teams';
import { openPreferences } from '../helpers/open-preferences';
import { isWin } from '../helpers/os';

export const test: SuiteMethod = async (client, { it, beforeAll }) => {
  beforeAll(async () => {
    await getBrowserViewHandle(client);
  });

  it('can open the preferences', async () => {
    assert.ok(await openPreferences(client), 'could not open preferences');
  });

  it('can disable hardware acceleration', async () => {});

  it('can enable launch on login', async () => {});

  it('can disable launch on login', async () => {});

  it('persists these setting accross teams', async () => {
    await selectNextTeamShortcut(client);
    await openPreferences(client);

    // Todo: Verify that settings are checked
  });

  it('has Windows notification methods', async () => {
    if (!isWin()) return;
  });
};
