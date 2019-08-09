import { assert } from 'chai';

import { SuiteMethod } from '../interfaces';
import {
  selectNextTeamWindowMenu,
  selectPreviousTeamWindowMenu,
  selectTeamWindowMenu,
  selectNextTeamShortcut,
  selectPreviousTeamShortcut
} from '../helpers/switch-teams';
import { clickDockMenuItem } from '../helpers/click-dock-menu-item';
import { smokeTeams } from '../smoke-teams';
import { getSonicWindow } from '../helpers/get-sonic-window';

export const test: SuiteMethod = async ({ it, beforeEach }) => {
  beforeEach(async () => {
    await getSonicWindow(window.client);
  });

  it('can select the "next" workspace using the window menu', async () => {
    await selectNextTeamWindowMenu();
    const beforeTitle = await window.client.getTitle();

    await selectNextTeamWindowMenu();
    const afterTitle = await window.client.getTitle();

    assert.notEqual(
      beforeTitle,
      afterTitle,
      'the titles should change (selecting next workspace)'
    );
  });

  it('can select the "previous" workspace using the window menu', async () => {
    const beforeTitle = await window.client.getTitle();
    await selectPreviousTeamWindowMenu();

    const afterTitle = await window.client.getTitle();
    assert.notEqual(
      beforeTitle,
      afterTitle,
      'the titles should change (selecting previous workspace)'
    );
  });

  it('can select a workspace by name using the window menu', async () => {
    await selectTeamWindowMenu(smokeTeams[0].name);
    const beforeTitle = await window.client.getTitle();
    assert.include(
      beforeTitle,
      smokeTeams[0].name,
      `beforeTitle does not include ${smokeTeams[0].name}`
    );

    await selectTeamWindowMenu(smokeTeams[1].name);
    const afterTitle = await window.client.getTitle();
    assert.include(
      afterTitle,
      smokeTeams[1].name,
      `afterTitle does not include ${smokeTeams[1].name}`
    );
  });

  it('can select the "next" workspace using the shortcut', async () => {
    const beforeTitle = await window.client.getTitle();
    await selectNextTeamShortcut();
    const afterTitle = await window.client.getTitle();

    assert.notEqual(
      beforeTitle,
      afterTitle,
      'unable to select the next workspace using the shortcut'
    );
  });

  it('can select the "previous" workspace using the shortcut', async () => {
    const beforeTitle = await window.client.getTitle();
    await selectPreviousTeamShortcut();
    const afterTitle = await window.client.getTitle();

    assert.notEqual(
      beforeTitle,
      afterTitle,
      `beforeTitle:${beforeTitle} should not be equal to afterTitle:${afterTitle}`
    );
  });

  it(
    'check that workspaces are present in the dock menu',
    async () => {
      // In the dock, "Old Joe" should be number five from the bottom
      await clickDockMenuItem(5);
      await getSonicWindow(window.client, 500);

      const beforeTitle = await window.client.getTitle();
      assert.include(
        beforeTitle,
        smokeTeams[0].name,
        `beforeTitle does not include ${smokeTeams[0].name}, got ${beforeTitle} instead.`
      );

      // In the dock, "Old Joe Two" should be number six from the bottom
      await clickDockMenuItem(6);
      await getSonicWindow(window.client, 500);
      const afterTitle = await window.client.getTitle();
      assert.include(
        afterTitle,
        smokeTeams[1].name,
        `beforeTitle does not include ${smokeTeams[1].name}, got ${beforeTitle} instead.`
      );
    },
    { platforms: ['darwin'] }
  );

  // Deactivated: This currently doesn't work in Sonic

  // it('can select a workspace using the Quick Switcher', async () => {
  //   await switchToTeam(1);
  //   await getSonicWindow(window.client, 300);
  //   await openQuickSwitcher(window.client);

  //   // Get quick switcher
  //   const element = await window.client.$('.c-search__input_and_close .ql-editor');

  //   await (window.client.elementSendKeys as any)((element as any).elementId, smokeTeams[0].name);
  //   await wait(100);
  //   await (window.client.elementSendKeys as any)((element as any).elementId, '\uE007');
  //   await getSonicWindow(window.client, 300);

  //   const afterTitle = await window.client.getTitle();
  //   assert.include(afterTitle, smokeTeams[0].name);
  // });
};
