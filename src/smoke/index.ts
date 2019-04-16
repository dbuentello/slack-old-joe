import { test as loginTest } from './1-login';
import { test as messagingTest } from './2-messaging';
import { test as logoutTest } from './3-logout';

export const SMOKE_TESTS = [
  { name: 'sign in', test: loginTest },
  { name: 'messaging', test: messagingTest },
  { name: 'logout', test: logoutTest }
];
