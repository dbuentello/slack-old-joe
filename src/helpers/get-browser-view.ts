export async function getBrowserViewHandle(client: BrowserObject) {
  const windows = await client.getWindowHandles();
  let handle: string = '';
  let title: string = '';

  for (const window of windows) {
    await client.switchToWindow(window);
    title = await client.getTitle();

    if (title.endsWith('Slack')) {
      const isHidden = await client.executeScript(`return document.hidden`, []);

      if (!isHidden) {
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
