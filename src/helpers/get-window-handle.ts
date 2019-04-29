export type GetWindowHandleTestFn = (
  url: string,
  title: string
) => boolean | Promise<boolean>;

export interface GetWindowResult {
  handle: string;
  url: string;
  title: string;
}

/**
 * Iterate over all window objects and return one that passes a test.
 * Will leave the client aimed at the found window object.
 *
 * @export
 * @param {BrowserObject} client
 * @param {GetWindowHandleTestFn} testFn
 * @returns {(Promise<GetWindowResult | null>)}
 */
export async function getWindowHandle(
  client: BrowserObject,
  testFn: GetWindowHandleTestFn
): Promise<GetWindowResult | null> {
  const windows = await client.getWindowHandles();

  for (const window of windows) {
    try {
      await client.switchToWindow(window);
      const title = await client.getTitle();
      const url = await client.getUrl();

      if (await testFn(url, title)) {
        return {
          handle: window,
          url,
          title
        };
      }
    } catch (error) {
      console.warn(
        `Could not complete window check, it might not exist anymore`,
        window,
        error
      );
    }
  }

  return null;
}
