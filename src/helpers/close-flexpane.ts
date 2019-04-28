export async function closeFlexpane(client: BrowserObject) {
  const closeBtn = await window.client.$('button.p-flexpane_header__control');
  await closeBtn.click();
}
