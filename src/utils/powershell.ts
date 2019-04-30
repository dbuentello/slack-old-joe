import { ChildProcess } from 'child_process';

const spawn = require('cross-spawn');

export function runPowerShellScript(
  scriptPath: string,
  scriptArgs: string = ''
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const psArgs = `& {& '${scriptPath}' ${scriptArgs} }`;
    const args = [
      '-ExecutionPolicy',
      'Bypass',
      '-NoProfile',
      '-NoLogo',
      psArgs
    ];
    const child: ChildProcess = spawn('powershell.exe', args);
    const output: Array<string> = [];

    child.stdout!.on('data', data => output.push(data.toString()));
    child.stderr!.on('data', data => output.push(data.toString()));
    child.on('exit', (code: number) => {
      if (code !== 0) {
        return reject(new Error(scriptPath + ' exited with code: ' + code));
      }

      // Clean newlines, both in raw and once joined
      const cleanOutput = output
        .filter(l => !!l && !!l.trim())
        .join('\n')
        .trim()
        .split('\n')
        .filter(l => !!l && !!l.trim())
        .join('\n')
        .trim();

      return resolve(cleanOutput);
    });

    child.stdin!.end();
  });
}
