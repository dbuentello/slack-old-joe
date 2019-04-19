import { test as loginTest } from './1-login';
import { test as messagingTest } from './2-messaging';
import { test as downloadTest } from './3-upload-download';
import { test as windowTest } from './4-app-window';
import { test as reloadTest } from './5-reloads-resets';
import { test as menuTest } from './6-menus';
import { test as logoutTest } from './99-logout';

export const SMOKE_TESTS = [
  { name: 'sign in', test: loginTest },
  { name: 'messaging', test: messagingTest },
  { name: 'file upload & download', test: downloadTest },
  { name: 'app window', test: windowTest },
  { name: 'reload', test: reloadTest },
  { name: 'menus', test: menuTest },
  { name: 'logout', test: logoutTest }
];
