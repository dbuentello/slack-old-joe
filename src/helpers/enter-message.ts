export async function enterMessage(
  client: BrowserObject,
  message: string,
  send?: boolean
) {
  const msgInput = await client.$('#msg_input .ql-editor');
  await msgInput.click();

  // Enter out time stamp, followed by the enter key
  const keys = [...message.split('')];
  if (send) keys.push('\uE007');
  await client.sendKeys(keys);
}
