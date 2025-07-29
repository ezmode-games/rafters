import { ASCII_LOGO } from '@rafters/shared';
import chalk from 'chalk';

export function getRaftersLogo(): string {
  return chalk.cyan(ASCII_LOGO);
}

export function getRaftersTitle(): string {
  return chalk.blue.bold('🏗️  RAFTERS') + chalk.gray(' Design Intelligence CLI');
}
