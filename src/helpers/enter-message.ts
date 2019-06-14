import { BrowserObject } from 'webdriverio';

export async function enterMessage(
  client: BrowserObject,
  message: string,
  send?: boolean
) {
  const msgInput = await client.$('.p-message_input .ql-editor');
  await msgInput.click();

  await (client as any).elementSendKeys((msgInput as any).elementId, message);

  if (send) {
    await (client as any).elementSendKeys(
      (msgInput as any).elementId,
      '\uE007'
    );
  }
}
