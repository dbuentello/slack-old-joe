import { execSync } from 'child_process';

export function getOsaScriptPath(): string {
  try {
    const result = execSync('which osascript');

    return result.toString().trim();
  } catch (error) {
    console.warn(`Could not find osascript path`, error);

    return '';
  }
}
