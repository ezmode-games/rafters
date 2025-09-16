# CI/CD Pipeline Documentation

This document describes the comprehensive CI/CD pipeline for the Rafters monorepo, designed specifically for AI-first design system development with Cloudflare Workers deployment.

## Pipeline Overview

The CI/CD pipeline consists of 7 main workflows optimized for:
- **pnpm monorepo** with selective testing and building
- **Changeset-driven releases** with automated NPM publishing
- **Cloudflare Workers/Pages deployment** with preview environments
- **AI-first design system** validation and intelligence preservation
- **Security-first approach** with comprehensive scanning
- **Performance monitoring** with regression detection

## Workflows

### 1. Main CI/CD Pipeline (`ci.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main`

**Key Features:**
- Quality gates with changeset integration
- Selective testing based on affected packages
- Automated security scanning
- Deployment coordination
- Status reporting with PR comments

**Jobs:**
1. **Quality Gates** - Change detection, type checking, linting, security audit
2. **Build & Test** - Affected package building and preflight checks
3. **Changeset Release** - Automated package versioning and publishing
4. **Deploy Coordination** - Creates deployment records for tracking
5. **Security Scan** - Vulnerability scanning and code analysis
6. **Status Report** - Comprehensive pipeline status reporting

### 2. Release Management (`release.yml`)

**Triggers:**
- Push to `main` with changeset changes
- Manual workflow dispatch
- Published releases

**Key Features:**
- Automated changeset processing
- Selective package publishing
- Pre-release validation
- Security verification
- NPM publication with provenance
- GitHub release creation

**Jobs:**
1. **Release Analysis** - Determine packages to release
2. **Pre-release Validation** - Comprehensive testing and validation
3. **Package Publishing** - NPM publication with verification
4. **Dry Run Simulation** - Test releases without publishing
5. **Post-release Actions** - GitHub releases and notifications
6. **Release Monitoring** - NPM availability verification

### 3. Cloudflare Deployment (`deploy-cloudflare.yml`)

**Triggers:**
- Push to `main` (production deployment)
- Pull requests (preview deployment)
- Manual workflow dispatch

**Key Features:**
- Environment-specific deployments
- Cloudflare Pages (website) and Workers (API)
- Preview deployments for PRs
- Automated testing of deployed services
- PR comments with preview links

**Jobs:**
1. **Deployment Planning** - Determine affected apps and environment
2. **Build Applications** - Build website and API for deployment
3. **Deploy Website** - Cloudflare Pages deployment
4. **Deploy API** - Cloudflare Workers deployment
5. **Post-deployment Verification** - Health checks and integration tests

### 4. Preview Cleanup (`preview-cleanup.yml`)

**Triggers:**
- PR closure
- Scheduled cleanup (daily)
- Manual workflow dispatch

**Key Features:**
- Automatic preview cleanup on PR close
- Scheduled stale preview removal
- Cloudflare resource cleanup
- GitHub deployment record cleanup

**Jobs:**
1. **Cleanup Strategy Planning** - Determine cleanup scope
2. **Cleanup Pages Previews** - Remove Cloudflare Pages deployments
3. **Cleanup Workers Previews** - Remove Cloudflare Workers
4. **Cleanup GitHub Deployments** - Clean deployment records
5. **Cleanup Reporting** - Status and metrics collection

### 5. Package Publishing (`package-publishing.yml`)

**Triggers:**
- Package version changes
- Release events
- Manual workflow dispatch

**Key Features:**
- Selective package analysis
- Security scanning before publishing
- Dry run capability
- Publication verification
- GitHub release creation

**Jobs:**
1. **Package Analysis** - Determine packages to publish
2. **Pre-publish Validation** - Security and quality checks
3. **Security Scan** - Vulnerability and secret scanning
4. **Package Publishing** - NPM publication
5. **Dry Run** - Simulation mode
6. **Post-publish Actions** - Release creation and notifications

### 6. Security & Dependency Scanning (`security.yml`)

**Triggers:**
- Push to main branches
- Pull requests
- Scheduled daily scans
- Manual workflow dispatch

**Key Features:**
- Comprehensive security scanning
- Dependency vulnerability analysis
- Code security analysis with CodeQL
- Supply chain security verification
- Secret detection
- Container security scanning

**Jobs:**
1. **Scan Planning** - Determine scan scope
2. **Dependency Scan** - Vulnerability and outdated package detection
3. **Code Security Scan** - CodeQL and custom pattern analysis
4. **Supply Chain Scan** - Package integrity verification
5. **Secret Scanning** - Hardcoded secret detection
6. **Container Scan** - Dockerfile security analysis
7. **Security Report** - Comprehensive reporting and alerting

### 7. Performance Monitoring (`performance.yml`)

**Triggers:**
- Push to main (bundle analysis)
- Pull requests (regression detection)
- Scheduled performance testing
- Manual workflow dispatch

**Key Features:**
- Bundle size analysis
- Lighthouse performance audits
- API performance testing
- Regression detection
- Cloudflare Workers constraint verification

**Jobs:**
1. **Bundle Analysis** - Size analysis and optimization recommendations
2. **Lighthouse Audit** - Website performance scoring
3. **API Performance** - Load testing and latency analysis
4. **Benchmark Tests** - Performance regression testing
5. **Regression Detection** - Comparison with baselines

## Environment Configuration

### Required Secrets

```bash
# NPM Publishing
NPM_TOKEN=npm_xxxxxxxxxx

# Cloudflare
CLOUDFLARE_API_TOKEN=cloudflare_token
CLOUDFLARE_ACCOUNT_ID=account_id

# External APIs (for functionality)
CLAUDE_API_KEY=sk-ant-api03-xxxxx

# Optional: Performance Monitoring
LHCI_GITHUB_APP_TOKEN=github_token
CODECOV_TOKEN=codecov_token
```

### Environment Variables

```bash
# Turbo (optional, for build optimization)
TURBO_TOKEN=turbo_token
TURBO_TEAM=team_name
```

## Deployment Environments

### Production
- **Website:** `rafters.realhandy.tech`
- **API:** `api.rafters.realhandy.tech`
- **Trigger:** Push to `main`
- **Features:** Full security scanning, performance monitoring

### Staging
- **Website:** `staging.rafters.realhandy.tech`
- **API:** `api-staging.rafters.realhandy.tech`
- **Trigger:** Manual deployment
- **Features:** Integration testing, pre-production validation

### Preview
- **Website:** `pr-{number}.rafters.realhandy.tech`
- **API:** `api-pr-{number}.rafters.realhandy.tech`
- **Trigger:** Pull requests
- **Features:** Feature testing, design validation

## Quality Gates

### Pre-commit (Lefthook)
- Biome formatting and linting
- TypeScript compilation
- Basic test execution

### Pre-push (Lefthook)
- Full preflight checks
- Integration tests
- Component tests

### CI Pipeline
- Comprehensive security scanning
- Performance regression detection
- Accessibility validation
- Bundle size analysis

## Changeset Workflow

### Creating Changes
```bash
# Add a changeset for your changes
pnpm changeset

# Choose affected packages and change types
# Write descriptive change summary
```

### Release Process
1. **Automatic**: Changesets trigger releases on main branch push
2. **Manual**: Use "Release Management" workflow dispatch
3. **Validation**: Pre-release validation ensures quality
4. **Publishing**: Selective NPM publishing based on package.json settings
5. **Verification**: Automated testing of published packages

### Package Publishing Rules
- Only packages with `"private": false` are published
- Packages must pass all quality gates
- Security scanning must pass
- Version bumps must be properly documented

## Monorepo Optimization

### Selective Testing
- Only affected packages are tested in PRs
- Dependency graph analysis determines impact
- Full test suite runs on main branch

### Build Optimization
- Turbo caching for faster builds
- Parallel job execution
- Artifact sharing between jobs

### Resource Management
- Efficient pnpm caching
- Selective deployment based on changes
- Preview cleanup to manage resources

## Security Features

### Vulnerability Management
- Daily dependency scanning
- Automated security updates via Dependabot
- Critical vulnerability blocking

### Secret Detection
- Pre-commit secret scanning
- GitHub secret scanning integration
- Custom pattern detection

### Supply Chain Security
- Package integrity verification
- License compliance checking
- Dependency tree analysis

## Performance Monitoring

### Bundle Analysis
- Cloudflare Workers 1MB limit compliance
- Tree-shaking effectiveness
- Dependency duplication detection

### Runtime Performance
- Lighthouse scoring
- API response time monitoring
- Core Web Vitals tracking

### Regression Detection
- Bundle size change detection
- Performance metric comparison
- Automated alerting

## Integration Points

### Design System Intelligence
- Component intelligence validation
- Semantic token verification
- Accessibility compliance checking

### AI Agent Support
- JSDoc intelligence preservation
- Component metadata validation
- Design reasoning verification

### External Services
- Cloudflare Pages/Workers deployment
- NPM package registry
- GitHub release management
- Security scanning services

## Troubleshooting

### Common Issues

1. **Failed Changeset Release**
   - Check package.json validity
   - Verify NPM token permissions
   - Ensure all tests pass

2. **Deployment Failures**
   - Verify Cloudflare API tokens
   - Check bundle size limits
   - Review environment configuration

3. **Security Scan Failures**
   - Review vulnerability reports
   - Update dependencies
   - Fix detected secrets

4. **Performance Regressions**
   - Analyze bundle size changes
   - Review performance reports
   - Optimize affected components

### Monitoring and Alerts

- **Security**: Critical vulnerabilities block releases
- **Performance**: Regression detection in PRs
- **Deployment**: Health checks verify successful deployments
- **Quality**: Failed tests block merges

## Future Enhancements

- **A/B Testing**: Feature flag integration
- **Monitoring**: Advanced APM integration
- **Analytics**: Usage and performance tracking
- **Automation**: AI-driven optimization suggestions