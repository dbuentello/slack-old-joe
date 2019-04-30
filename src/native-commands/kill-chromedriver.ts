import * as path from 'path';

import { isWin } from '../utils/os';
import { runPowerShellScript } from '../utils/powershell';

/**
 * During rapid development, Chromedriver often sticks around. I'm lazy.
 */
export async function killChromedriver() {
  if (isWin()) {
    const scriptPath = path.join(
      __dirname,
      '../../static/powershell/kill-chromedriver.ps1'
    );

    await runPowerShellScript(scriptPath);
  }
}
