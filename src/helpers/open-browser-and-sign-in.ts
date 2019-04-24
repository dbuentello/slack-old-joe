import { shell } from 'electron';

import { getTeamsCount } from './get-teams-count';

export function openBrowserAndSignIn(teamName: string) {
  shell.openExternal(`https://${teamName}.slack.com/ssb/signin_redirect`);
}

export async function openBrowserAndWaitForSignIn(
  teamName: string,
  timeout = 10000
): Promise<boolean> {
  const teamsCount = await getTeamsCount();

  openBrowserAndSignIn(teamName);

  return new Promise<boolean>(async (resolve, reject) => {
    const testInterval = setInterval(async () => {
      if (teamsCount < (await getTeamsCount())) {
        clearInterval(testInterval);
        clearTimeout(runawayTimeout);

        // Let's give Slack some time to settle the teams
        // Say... 5 seconds?
        setTimeout(() => resolve(true), 5000);
      }
    }, 1000);

    const runawayTimeout = setTimeout(() => {
      clearInterval(testInterval);

      reject(`Sign-in failed, timeout reached (${timeout}ms)`);
    }, timeout);
  });
}
