import { runAppleScript } from '../helpers/applescript';

export async function focus() {
  if (process.platform === 'darwin') {
    await runAppleScript('tell application "Slack" to activate');
  }
}
