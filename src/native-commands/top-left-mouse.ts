import * as robot from 'robotjs';

import { wait } from '../utils/wait';

export async function topLeftMouse() {
  robot.moveMouse(0, 0);
  await wait(500);
}
