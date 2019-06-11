import { BrowserObject } from 'webdriverio';

const methodText = () =>
  `
window.addEventListener("click", event => {
  let dot = document.createElement("div");
  dot.style.height = "8px";
  dot.style.width = "8px";
  dot.style.zIndex = 99999999;
  dot.style.position = "absolute";
  dot.style.background = "red";
  dot.style.left = (event.pageX - 4) + "px";
  dot.style.top = (event.pageY - 4) + "px";
  document.body.appendChild(dot);
});`
    .split('\n')
    .join('');

export async function traceClicks(client: BrowserObject) {
  return client.executeScript(methodText(), []);
}
