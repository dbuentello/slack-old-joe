import { exec } from 'child_process';

import { getTeamsCount } from './get-teams-count';

export function openBrowserAndSignIn() {
  const url = 'https://my.slack.com/ssb/signin_redirect';
  const start =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
      ? 'start'
      : 'xdg-open';

  exec(`${start} ${url}`);
}

export async function openBrowserAndWaitForSignIn(
  timeout = 10000
): Promise<boolean> {
  const teamsCount = await getTeamsCount();

  openBrowserAndSignIn();

  return new Promise<boolean>(async (resolve, reject) => {
    const testInterval = setInterval(async () => {
      if (teamsCount < (await getTeamsCount())) {
        clearInterval(testInterval);
        clearTimeout(runawayTimeout);

        // Let's give Slack some time to settle the teams
        // Say... 8 seconds?
        setTimeout(() => resolve(true), 8000);
      }
    }, 1000);

    const runawayTimeout = setTimeout(() => {
      clearInterval(testInterval);

      reject(`Sign-in failed, timeout reached (${timeout}ms)`);
    }, timeout);
  });
}
