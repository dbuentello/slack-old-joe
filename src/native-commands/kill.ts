import * as path from 'path';

import { isWin } from '../utils/os';
import { runPowerShellScript } from '../utils/powershell';

export async function killSlack() {
  if (isWin()) {
    const scriptPath = path.join(__dirname, '../../static/powershell/kill.ps1');

    await runPowerShellScript(scriptPath);
  }
}
