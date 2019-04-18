import { promisify } from 'util';

const execString = require('applescript').execString;
const execStringPromise = promisify(execString);

export function runAppleScript(script: string) {
  return execStringPromise(script);
}

const execFile = require('applescript').execFile;
const execFilePromise = promisify(execFile);

export function runAppleScriptFile(script: string) {
  return execFilePromise(script);
}
