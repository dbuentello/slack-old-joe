import * as path from 'path';
import { runPowerShellScript } from '../utils/powershell';

/**
 * Return the count of HWNDs matching the search string. PS1
 * script will use "-like".
 *
 * @export
 * @param {string} name
 * @returns {Promise<number>}
 */
export async function findHwnds(name: string): Promise<any> {
  const scriptPath = path.join(
    __dirname,
    '../../static/powershell/find-hwnd.ps1'
  );
  const scriptArgs = `-name "${name}"`;
  const result = await runPowerShellScript(scriptPath, scriptArgs);

  return parseInt(result, 10);
}
