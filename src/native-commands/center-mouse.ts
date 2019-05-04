import * as robot from 'robotjs';

import { wait } from '../utils/wait';

export async function centerMouse() {
  const { width, height } = robot.getScreenSize();
  robot.moveMouse(Math.round(width / 2), Math.round(height / 2));
  await wait(500);
}
