export async function waitUntilElementGone(
  client: BrowserObject,
  selector: string,
  timeout: number = 1000
) {
  const element = await client.$(selector);
  const test = async () => !(await element.isExisting());
  let timeLeft = timeout;

  return new Promise(async (resolve, reject) => {
    const scheduleTest = () =>
      setTimeout(async () => {
        if (await test()) return resolve(true);

        timeLeft = timeLeft - 50;

        if (timeLeft <= 0) {
          return reject('Timeout reached');
        } else {
          scheduleTest();
        }
      }, 50);

    scheduleTest();
  });
}
