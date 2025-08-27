import { exec } from 'node:child_process';

console.log('Running changeset version...');
exec('pnpm changeset version');

console.log('Installing dependencies...');
exec('pnpm install');
