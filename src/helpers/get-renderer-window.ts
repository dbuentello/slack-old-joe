export async function getRendererWindowHandle(client: BrowserObject) {
  const windows = await client.getWindowHandles();
  let handle: string = '';
  let url: string = '';

  for (const window of windows) {
    await client.switchToWindow(window);
    url = await client.getUrl();

    if (url.startsWith('file://')) {
      handle = window;
      break;
    }
  }

  return {
    handle
  };
}
