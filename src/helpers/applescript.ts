import { promisify } from 'util';

const execString = require('applescript').execString;
const execStringPromise = promisify(execString);

export async function runAppleScript(script: string) {
  console.log(`Running AppleScript`, script);
  return execStringPromise(script);
}

const execFile = require('applescript').execFile;
const execFilePromise = promisify(execFile);

export async function runAppleScriptFile(script: string) {
  console.log(`Running AppleScript`, script);
  return execFilePromise(script);
}
