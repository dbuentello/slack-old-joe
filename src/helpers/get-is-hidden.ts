export function getIsHidden(client: BrowserObject) {
  return client.executeScript('return document.hidden', []);
}
