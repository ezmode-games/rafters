import chalk from 'chalk';
import { ASCII_LOGO } from '@rafters/shared';
export function getRaftersLogo() {
    return chalk.cyan(ASCII_LOGO);
}
export function getRaftersTitle() {
    return chalk.blue.bold('🏗️  RAFTERS') + chalk.gray(' Design Intelligence CLI');
}
