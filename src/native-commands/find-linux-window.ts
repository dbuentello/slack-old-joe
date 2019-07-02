import shell = require('shelljs');
// import { shell } from 'shelljs'

export async function findWindow(name: string): Promise<Boolean> {
  // set the execPath 
  shell.config.execPath = String(shell.which('node'));
  // does the list of windows contain what we are looking for? 
  return (shell.exec('wmctrl -l')).includes(name);
}