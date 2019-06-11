import { BrowserObject } from 'webdriverio';

const getScriptText = (selector: string) =>
  `
let selection = window.getSelection();
let node = document.querySelector("${selector}");

if (selection.rangeCount > 0) {
  selection.removeAllRanges();
}

let range = document.createRange();
range.selectNode(node);
selection.addRange(range);`
    .trim()
    .replace('\n', ' ');

export async function setSelection(client: BrowserObject, selection: string) {
  const scriptText = getScriptText(selection);
  return client.executeScript(scriptText, []);
}
