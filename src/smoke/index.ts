import { test as loginTest } from './1-login';
import { test as messagingTest } from './2-messaging';
import { test as downloadTest } from './3-upload-download';
import { test as logoutTest } from './4-logout';

export const SMOKE_TESTS = [
  { name: 'sign in', test: loginTest },
  { name: 'messaging', test: messagingTest },
  { name: 'file upload & download', test: downloadTest },
  { name: 'logout', test: logoutTest }
];
