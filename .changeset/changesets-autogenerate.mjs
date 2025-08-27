import { execSync } from 'node:child_process';
import fs from 'node:fs';

// Get the most recent commit message
const commitMessage = execSync('git log -1 --format=%s').toString().trim();

// Define valid scopes - only rafters CLI should be published
const validScopes = ['cli'];

// Define regex patterns
const commitPatterns = {
  major: /^BREAKING CHANGE: (.+)/,
  minor: /^feat\(([^)]+)\): (.+)/,
  patch: /^fix\(([^)]+)\): (.+)/,
};

// Identify type, package, and description
let packageName = null;
let changeType = null;
let description = null;

if (commitPatterns.major.test(commitMessage)) {
  changeType = 'major';
  description = commitMessage.match(commitPatterns.major)?.[1];
  packageName = 'cli'; // Major changes affect CLI
} else if (commitPatterns.minor.test(commitMessage)) {
  const scope = commitMessage.match(commitPatterns.minor)?.[1];
  if (validScopes.includes(scope)) {
    changeType = 'minor';
    packageName = scope;
    description = commitMessage.match(commitPatterns.minor)?.[2];
  }
} else if (commitPatterns.patch.test(commitMessage)) {
  const scope = commitMessage.match(commitPatterns.patch)?.[1];
  if (validScopes.includes(scope)) {
    changeType = 'patch';
    packageName = scope;
    description = commitMessage.match(commitPatterns.patch)?.[2];
  }
}

if (packageName && packageName === 'cli') {
  description = description?.trim() || 'No description provided.';

  const changesetContent = `---
'rafters': ${changeType}
'@rafters/design-tokens': patch
'@rafters/shared': patch
'@rafters/color-utils': patch
---
${description}
`;

  const timestamp = Date.now();
  fs.writeFileSync(`.changeset/auto-${timestamp}.md`, changesetContent);
  console.log('✅ Changeset file created for CLI and dependencies');
} else {
  console.log('⚠️ No valid package scope found in commit message. Valid scope is: cli');
  console.log('📝 Example: feat(cli): add new component scaffolding');
}
