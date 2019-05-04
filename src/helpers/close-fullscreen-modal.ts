export async function closeFullscreenModal(client: BrowserObject) {
  const closeBtn = await client.$('button#fs_modal_close_btn');
  await closeBtn.waitForExist(1000);
  await closeBtn.click();
}
