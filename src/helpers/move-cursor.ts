import * as robot from 'robotjs';

import { BrowserObject } from 'webdriverio';

export async function moveCursorToElement(
  client: BrowserObject,
  selector: string
) {
  // desktop.window.getGeometryForWindow({ window_token: 1 })

  // Step 1: Get element's location
  const elementLocation = await (await client.$(selector)).getLocation();

  // Step 2: Get the window's location
  const script = `return desktop.window.getGeometryForWindow({ window_token: 1 })`;
  const windowLocation: any = await client.execute(script, []);

  robot.moveMouse(
    elementLocation.x + windowLocation.x,
    elementLocation.y + windowLocation.y
  );
}
