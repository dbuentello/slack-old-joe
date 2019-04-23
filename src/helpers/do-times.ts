export async function doTimes(howManyTimes: number, fn: () => void) {
  const length = Array(howManyTimes)
    .fill(null);

  console.log(`Calling method ${howManyTimes} times`, fn);

  for (const _notUsed of length) {
    await fn();
  }
}
