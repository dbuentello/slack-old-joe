import { AppState } from '../renderer/state';

export function isSignInDisabled(appState: AppState) {
  const signInTest = appState.availableTestFiles.find(
    v => v.name === 'sign in'
  );
  return signInTest && signInTest.disabled;
}
