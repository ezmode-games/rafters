# Pull Request

## Description
Brief description of the changes in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring (no functional changes)
- [ ] Tests (adding or updating tests)
- [ ] CI/CD changes
- [ ] Dependency updates

## Affected Packages
- [ ] `@rafters/ui`
- [ ] `@rafters/design-tokens`
- [ ] `@rafters/color-utils`
- [ ] `@rafters/shared`
- [ ] `@rafters/website`
- [ ] `@rafters/api`
- [ ] `@rafters/cli`

## Changeset Required
- [ ] Yes - This change affects published packages and requires a changeset
- [ ] No - This change only affects internal tooling/apps/documentation

If yes, have you added a changeset?
- [ ] Added changeset with `pnpm changeset`

## Testing
- [ ] Tests pass locally with `pnpm preflight`
- [ ] Added tests for new functionality
- [ ] Updated existing tests for modified functionality
- [ ] Manual testing completed

## Design Intelligence (if UI/UX changes)
- [ ] Consulted Sami agent for design intelligence integration
- [ ] Consulted Sally agent for accessibility review
- [ ] Updated component JSDoc intelligence annotations
- [ ] Verified semantic token usage (no hardcoded values)
- [ ] Applied proper cognitive load and trust-building patterns

## Quality Checklist
- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code performed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] No console.log statements or debugging code left in
- [ ] No TODO comments without issue references
- [ ] Type safety maintained (no `any` types)
- [ ] Error handling implemented where appropriate

## Security Considerations
- [ ] No hardcoded secrets or API keys
- [ ] Proper input validation for user data
- [ ] Dependencies audited for vulnerabilities
- [ ] No unsafe operations (eval, innerHTML, etc.)

## Performance Impact
- [ ] No performance regressions introduced
- [ ] Bundle size impact considered (if applicable)
- [ ] Database queries optimized (if applicable)
- [ ] Cloudflare Workers constraints respected (1MB compressed, 10ms CPU)

## Documentation
- [ ] README updated (if needed)
- [ ] Component documentation updated (if UI changes)
- [ ] API documentation updated (if API changes)
- [ ] Breaking changes documented

## Deployment Notes
- [ ] No special deployment steps required
- [ ] Database migrations included (if applicable)
- [ ] Environment variables updated (if needed)
- [ ] Feature flags configured (if applicable)

## Additional Context
Add any other context, screenshots, or information about the PR here.

## Pre-submission Checklist
- [ ] Ran `pnpm preflight` successfully
- [ ] All CI checks pass
- [ ] Requested review from appropriate team members
- [ ] Linked to relevant issues/tickets