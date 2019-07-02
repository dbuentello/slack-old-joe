import { sh } from 'run-sh'

export async function findWindow(name: string): Promise<any> {
  // const stringOfWindows = await sh("wmctrl -l");
  sh("wmctrl -l").then(function(res: { stdout: any; stderr: any; }) {
    console.log("Current server time: ", res.stdout);
  }, function(err: any) {
    console.log("Error running `times`: " + err);
  });
  // console.log(stringOfWindows);
  // filter for string given .contains? (in this case will be reset slack?)
  // if present, return true. 
}