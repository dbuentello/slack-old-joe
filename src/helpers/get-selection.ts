export async function getSelection(client: BrowserObject) {
  return client.executeScript(`return window.getSelection().toString()`, []);
}