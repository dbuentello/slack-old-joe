import { test as loginTest } from './1-login';
import { test as messagingTest } from './2-messaging';
import { test as downloadTest } from './3-upload-download';
import { test as windowTest } from './4-app-window';
import { test as reloadTest } from './5-reloads-resets';
import { test as menuTest } from './6-menus';
import { test as logTest } from './7-logs';
import { test as childWindowTest } from './8-child-windows';
import { test as deepLinkTest } from './9-deep-links';
import { test as networkTest } from './10-network';
import { test as devToolsTest } from './11-devtools';
import { test as preferencesTest } from './12-preferences';
import { test as logoutTest } from './99-logout';

import { TestFile } from '../interfaces';

export const SMOKE_TESTS: Array<TestFile> = [
  { name: 'Sign in', test: loginTest },
  { name: 'Messaging', test: messagingTest },
  { name: 'File Up- and Download', test: downloadTest },
  { name: 'App Window', test: windowTest },
  { name: 'Reloading', test: reloadTest },
  { name: 'Menus', test: menuTest },
  { name: 'Logs', test: logTest },
  { name: 'Child Windows', test: childWindowTest },
  { name: 'Deep links', test: deepLinkTest },
  { name: 'Network', test: networkTest },
  { name: 'Developer Tools', test: devToolsTest },
  { name: 'Preferences', test: preferencesTest },
  { name: 'Sign out', test: logoutTest }
];
