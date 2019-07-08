import * as shell from 'shelljs';

/**
 * This function tells you whether or not you have a window with the title you give it.
 * @param name the name of the window you are looking for
 */
export async function findWindow(name: string): Promise<Boolean> {
  // set the execPath
  shell.config.execPath = String(shell.which('node'));
  // does the list of windows contain what we are looking for?
  return shell.exec('wmctrl -l').includes(name);
}
