const shell = require('shelljs');

export async function findWindow(name: string): Promise<any> {
  // const stringOfWindows = await sh("wmctrl -l");
  shell.config.execPath = shell.which('node');
  console.log(shell.exec('wmctrl -l').stdout);
  const s:string = shell.exec('wmctrl -l');
  return s.includes(name);
  // sh("wmctrl -l").then(function(res: { stdout: any; stderr: any; }) {
  //   console.log("Output from Linux command wmctrl -l : ", res.stdout);
  //   console.log(`Does output contain ${name}? ${res.stdout.contains(name)}`);
  // }, function(err: any) {
  //   console.log("Error running `times`: " + err);
  // });
  // console.log(stringOfWindows);
  // filter for string given .contains? (in this case will be reset slack?)
  // if present, return true. 
}