import * as path from 'path';

import { isWin } from '../utils/os';
import { runPowerShellScript } from '../utils/powershell';

export interface StartupItem {
  name: string;
  command: string;
}

export async function getStartupItems(
  searchName: string = '*slack.slack'
): Promise<Array<StartupItem>> {
  if (isWin()) {
    const scriptPath = path.join(
      __dirname,
      '../../static/powershell/startup-items.ps1'
    );

    // Name     : com.squirrel.slack_pilot.slack
    // command  : "C:\Users\felix\AppData\Local\slack_pilot\Update.exe" --processStart "slack.exe" --process-start-args "--startup"
    //
    // Location : HKU\S-1-5-21-2415327196-3281830115-3356737544-1001\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
    //
    // User     : LAPTOP-Q7QE2RR7\felix
    const psOutput = await runPowerShellScript(
      scriptPath,
      `-name "${searchName}"`
    );

    // OneDrive
    // command  : "C:\Users\felix\AppData\Local\Microsoft\OneDrive\OneDrive.exe" /background
    // Location : HKU\S-1-5-21-2415327196-3281830115-3356737544-1001\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
    // User     : LAPTOP-Q7QE2RR7\felix
    const entries = psOutput
      .split(/Name *:/)
      .map(l => l.trim())
      .filter(l => !!l)
      .map(entry => {
        const name = (entry.split('\n')[0] || '').trim();
        const commandMatch = /.*command *: (.*)/.exec(entry);
        const command = (commandMatch && commandMatch[1]) || '';

        return { name, command };
      });

    return entries;
  }

  return [];
}
