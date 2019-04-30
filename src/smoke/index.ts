import { test as loginTest } from './login';
import { test as messagingTest } from './messaging';
import { test as downloadTest } from './upload-download';
import { test as windowTest } from './app-window';
import { test as reloadTest } from './reloads-resets';
import { test as menuTest } from './menus';
import { test as logTest } from './logs';
import { test as childWindowTest } from './child-windows';
import { test as deepLinkTest } from './deep-links';
import { test as networkTest } from './network';
import { test as devToolsTest } from './devtools';
import { test as preferencesTest } from './preferences';
import { test as spellcheckTest } from './spellcheck';
import { test as processesTest } from './processes';
import { test as notificationTest } from './notifications';
import { test as logoutTest } from './logout';

import { TestFile } from '../interfaces';

export const SMOKE_TESTS: Array<TestFile> = [
  { name: 'Sign in', test: loginTest },
  { name: 'Messaging', test: messagingTest },
  { name: 'Notifications', test: notificationTest },
  { name: 'File Up- and Download', test: downloadTest },
  { name: 'App Window', test: windowTest },
  { name: 'Reloading', test: reloadTest },
  { name: 'Menus', test: menuTest },
  { name: 'Child Windows', test: childWindowTest },
  { name: 'Deep links', test: deepLinkTest },
  { name: 'Network', test: networkTest },
  { name: 'Developer Tools', test: devToolsTest },
  { name: 'Preferences', test: preferencesTest },
  { name: 'Spellcheck', test: spellcheckTest },
  { name: 'Processes', test: processesTest },
  { name: 'Logs', test: logTest },
  { name: 'Sign out', test: logoutTest }
];
