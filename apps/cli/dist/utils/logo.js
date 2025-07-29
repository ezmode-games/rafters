import { ASCII_LOGO } from '@rafters/shared';
import chalk from 'chalk';
export function getRaftersLogo() {
    return chalk.cyan(ASCII_LOGO);
}
export function getRaftersTitle() {
    return chalk.blue.bold('🏗️  RAFTERS') + chalk.gray(' Design Intelligence CLI');
}
