export async function enterMessage(client: BrowserObject, message: string) {
  const msgInput = await client.$('#msg_input .ql-editor');
  await msgInput.click();

  // Enter out time stamp, followed by the enter key
  await client.sendKeys([...message.split(''), '\uE007']);
}
