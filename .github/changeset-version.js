const { exec } = require('child_process');

console.log('🔄 Running changeset version...');
exec('npx changeset version');

console.log('📦 Installing dependencies...');
exec('pnpm install');