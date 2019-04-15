import { exec } from 'child_process';

export function openBrowserAndSignIn() {
  const url = 'https://my.slack.com/ssb/signin_redirect';
  const start = process.platform === 'darwin'
    ? 'open'
    : process.platform === 'win32' ? 'start': 'xdg-open';

  exec(`${start} ${url}`);
}
