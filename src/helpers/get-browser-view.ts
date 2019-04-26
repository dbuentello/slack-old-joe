import { wait } from './wait';

export async function getBrowserViewHandle(
  client: BrowserObject,
  waitForMsBefore = 0,
  teamUrl = ''
) {
  if (wait) await wait(waitForMsBefore);

  const windows = await client.getWindowHandles();
  let handle: string = '';
  let title: string = '';

  for (const window of windows) {
    await client.switchToWindow(window);
    title = await client.getTitle();

    if (title.endsWith('Slack')) {
      const isSelectedTest = `return desktop.store.getState().appTeams.selectedTeamId === window.teamId`;
      const isRemote = (await client.getUrl()).startsWith(`https://${teamUrl}`);
      const isSelected =
        isRemote && (await client.executeScript(isSelectedTest, []));

      if (isSelected && isRemote) {
        handle = window;
        break;
      }
    }
  }

  return {
    title: handle ? title : '',
    handle
  };
}
