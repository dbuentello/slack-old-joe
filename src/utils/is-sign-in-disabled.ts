import { AppState } from '../renderer/state';

export function isSignInDisabled(appState: AppState) {
  const signInTest = appState.availableTestFiles.find(
    v => v.name === 'Sign in'
  );
  return signInTest && signInTest.disabled;
}
