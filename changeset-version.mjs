import { exec } from 'child_process';

console.log('Running changeset version...');
exec('pnpm changeset version');

console.log('Installing dependencies...');
exec('pnpm install');