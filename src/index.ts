import * as path from 'path';
import * as fs from 'fs-extra';

import { getClient } from './client';
import { spawnChromeDriver } from './driver';
import { SuiteMethodResults, SuiteMethods } from './interfaces';
import { clean } from './helpers/clean';
import { runTests } from './runnter';

async function main() {
  await clean();

  const driver = await spawnChromeDriver();
  const client = await getClient({ version: `3.4.1-betaaa231d3` });

  setTimeout(async () => {
    const result = await runTests(client);

    // await client.deleteSession();
    // await driver.kill();

    console.log(result);

    // process.exit();
  }, 3000)
}

main()
