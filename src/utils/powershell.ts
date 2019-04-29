import { ChildProcess } from 'child_process';

const spawn = require('cross-spawn');

export function runPowerShellScript(
  scriptPath: string,
  scriptArgs: string = ''
): Promise<ChildProcess> {
  return new Promise<ChildProcess>((resolve, reject) => {
    const psArgs = `& {& '${scriptPath}' ${scriptArgs} }`;
    const args = [
      '-ExecutionPolicy',
      'Bypass',
      '-NoProfile',
      '-NoLogo',
      psArgs
    ];
    const child = spawn('powershell.exe', args);

    child.on('exit', (code: number) => {
      if (code !== 0) {
        return reject(new Error(scriptPath + ' exited with code: ' + code));
      }

      return resolve();
    });

    child.stdin.end();
  });
}
