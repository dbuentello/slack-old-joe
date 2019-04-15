export async function getSignInWindow(
  client: BrowserObject
): Promise<null | string> {
  const windows = await client.getWindowHandles();
  let signInWindow = null;

  for (const window of windows) {
    await client.switchToWindow(window);

    if ((await client.getTitle()) === `Sign in | Slack`) {
      signInWindow = window;
    }
  }

  return signInWindow;
}
