export async function getDevToolsWindowHandle(client: BrowserObject) {
  const windows = await client.getWindowHandles();
  let handle: string = '';
  let url: string = '';

  for (const window of windows) {
    await client.switchToWindow(window);
    url = await client.getUrl();

    if (url.startsWith('chrome-devtools://devtools')) {
      handle = window;
      break;
    }
  }

  return {
    handle,
    url
  };
}
