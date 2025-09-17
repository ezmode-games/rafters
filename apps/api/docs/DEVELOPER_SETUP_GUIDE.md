# Developer Setup and Troubleshooting Guide

Complete guide for setting up the Rafters Color Intelligence API locally and troubleshooting common issues.

## Prerequisites

### Required Tools
- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (workspace management)
- **Wrangler**: Latest version (`pnpm add -g wrangler`)
- **Cloudflare Account**: For Workers, Vectorize, and Queues

### Required Services
- **Cloudflare Workers**: Runtime environment
- **Cloudflare Vectorize**: Vector database for similarity search
- **Cloudflare Queues**: Asynchronous processing
- **Cloudflare AI Workers**: For color intelligence generation
- **Claude API**: Alternative AI service for color analysis

## Initial Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/real-handy/rafters.git
cd rafters/apps/api
pnpm install
```

### 2. Environment Configuration

Create your environment configuration:

```bash
# Copy example environment
cp .dev.vars.example .dev.vars

# Generate secure API key for queue endpoints
openssl rand -hex 32  # Copy this value

# Edit .dev.vars with your credentials
```

**Required Environment Variables:**

```bash
# .dev.vars file
SEED_QUEUE_API_KEY="your-64-character-hex-string"
CLAUDE_API_KEY="sk-ant-api03-your-claude-key"
CF_TOKEN="your-cloudflare-api-token"
CLAUDE_GATEWAY_URL="https://gateway.ai.cloudflare.com/v1/your-account/claude-gateway/anthropic"
```

### 3. Cloudflare Resources Setup

#### Create Vectorize Index

```bash
# Create the vector index for color intelligence
pnpm wrangler vectorize create rafters-color-intel \
  --dimensions 384 \
  --metric cosine

# Verify creation
pnpm wrangler vectorize list
```

#### Create Cloudflare Queue

```bash
# Create the color processing queue
pnpm wrangler queues create color-processing-queue

# Verify creation
pnpm wrangler queues list
```

#### Configure Wrangler Bindings

Update `wrangler.jsonc` with your account details:

```json
{
  "routes": [{
    "pattern": "your-domain.com/api/*",
    "zone_id": "your-zone-id"
  }],
  "vectorize": [{
    "binding": "VECTORIZE",
    "index_name": "rafters-color-intel"
  }],
  "queues": {
    "producers": [{
      "queue": "color-processing-queue",
      "binding": "COLOR_SEED_QUEUE"
    }],
    "consumers": [{
      "queue": "color-processing-queue"
    }]
  }
}
```

### 4. Deploy Environment Secrets

```bash
# Set production secrets
pnpm wrangler secret put SEED_QUEUE_API_KEY
pnpm wrangler secret put CLAUDE_API_KEY
pnpm wrangler secret put CF_TOKEN
pnpm wrangler secret put CLAUDE_GATEWAY_URL

# Verify secrets
pnpm wrangler secret list
```

## Development Workflow

### 1. Local Development Server

```bash
# Start local development server
pnpm dev

# Server runs at http://localhost:8787
# API endpoints available at http://localhost:8787/api/*
```

### 2. Running Tests

```bash
# Run all tests
pnpm test:preflight

# Unit tests only
pnpm test

# Integration tests only (requires Cloudflare environment)
pnpm test:integration

# Watch mode for development
pnpm test --watch
```

### 3. Queue Testing

```bash
# Test single color queue (requires API key)
curl -H "X-API-Key: your-api-key" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:8787/api/seed-queue/single \
     -d '{"oklch": {"l": 0.65, "c": 0.12, "h": 240}}'

# Check queue status
curl -H "X-API-Key: your-api-key" \
     http://localhost:8787/api/seed-queue/status
```

### 4. Vector Search Testing

```bash
# List vectors in development
pnpm wrangler vectorize list-vectors rafters-color-intel --local

# Query similarity (requires existing vectors)
pnpm wrangler vectorize query rafters-color-intel \
  --vector-id oklch-0.65-0.12-240 \
  --top-k 5 \
  --local
```

## Deployment

### 1. Pre-deployment Checks

```bash
# Ensure all tests pass
pnpm test:preflight

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### 2. Deploy to Production

```bash
# Deploy worker to Cloudflare
pnpm deploy

# Verify deployment
curl https://your-domain.com/api/seed-queue/status \
  -H "X-API-Key: your-api-key"
```

### 3. Post-deployment Verification

```bash
# Test color intelligence API
curl -X POST https://your-domain.com/api/color-intel \
  -H "Content-Type: application/json" \
  -d '{"oklch": {"l": 0.65, "c": 0.12, "h": 240}}'

# Test queue system
curl -H "X-API-Key: your-api-key" \
     -H "Content-Type: application/json" \
     -X POST https://your-domain.com/api/seed-queue/single \
     -d '{"oklch": {"l": 0.55, "c": 0.15, "h": 355}}'

# Monitor processing via Cloudflare Dashboard
# Workers & Pages > rafters-api > Observability
```

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem:** `401 Authentication required`

**Solutions:**
```bash
# Verify API key is set
pnpm wrangler secret list | grep SEED_QUEUE_API_KEY

# Test with correct header format
curl -H "X-API-Key: your-exact-api-key" \
     https://your-domain.com/api/seed-queue/status

# Regenerate API key if needed
openssl rand -hex 32
pnpm wrangler secret put SEED_QUEUE_API_KEY
```

#### 2. Vectorize Connection Issues

**Problem:** `Error: Could not connect to Vectorize`

**Solutions:**
```bash
# Verify index exists
pnpm wrangler vectorize list

# Check binding configuration in wrangler.jsonc
# Ensure "VECTORIZE" binding matches your index name

# Recreate index if necessary
pnpm wrangler vectorize delete rafters-color-intel
pnpm wrangler vectorize create rafters-color-intel \
  --dimensions 384 \
  --metric cosine
```

#### 3. Queue Processing Failures

**Problem:** Colors queued but not processed

**Solutions:**
```bash
# Check queue consumer logs
pnpm wrangler tail

# Verify queue consumer is deployed
pnpm wrangler queues consumer list color-processing-queue

# Monitor queue metrics in Cloudflare Dashboard
# Queues > color-processing-queue > Metrics

# Check dead letter queue for failed messages
pnpm wrangler queues consumer list --dlq
```

#### 4. AI Service Failures

**Problem:** `Error: Could not generate color intelligence`

**Solutions:**
```bash
# Verify Claude API key
curl -H "x-api-key: your-claude-key" \
     -H "content-type: application/json" \
     https://api.anthropic.com/v1/messages \
     -d '{"model": "claude-3-5-haiku-20241022", "max_tokens": 10, "messages": [{"role": "user", "content": "Hi"}]}'

# Check AI Gateway configuration
# Cloudflare Dashboard > AI Gateway > Your Gateway > Settings

# Use Cloudflare AI as fallback
# Ensure Workers AI binding is configured in wrangler.jsonc
```

#### 5. CORS Issues

**Problem:** Browser requests blocked by CORS

**Solutions:**
```bash
# Verify CORS headers in response
curl -I -H "Origin: https://your-frontend.com" \
     https://your-domain.com/api/color-intel

# Check CORS configuration in src/index.ts
# Ensure origins are properly configured for your domain
```

#### 6. Rate Limiting

**Problem:** `429 Too Many Requests`

**Solutions:**
```bash
# Check queue throughput limits
# Cloudflare Queues: 400 messages/second

# Implement exponential backoff in client
# Add delays between batch operations

# Monitor queue depth
pnpm wrangler queues list --show-producers
```

### Development Issues

#### 1. TypeScript Errors

**Problem:** Type checking failures

**Solutions:**
```bash
# Update dependencies
pnpm update

# Clear TypeScript cache
rm -rf node_modules/.cache
pnpm install

# Check for missing type definitions
pnpm typecheck --listFiles | grep missing
```

#### 2. Test Failures

**Problem:** Integration tests failing

**Solutions:**
```bash
# Ensure Cloudflare environment is available
pnpm wrangler dev --test

# Check test environment variables
cat vitest.config.cloudflare.ts

# Run tests with verbose output
pnpm test:integration --reporter=verbose

# Clear test cache
pnpm vitest run --no-cache
```

#### 3. Local Development Issues

**Problem:** `wrangler dev` not working

**Solutions:**
```bash
# Update wrangler to latest
pnpm update wrangler

# Clear wrangler cache
rm -rf ~/.wrangler

# Check Node.js compatibility
node --version  # Should be 18.0.0+

# Restart with fresh config
pnpm wrangler dev --compatibility-date=2025-08-30
```

### Performance Issues

#### 1. Slow Vector Queries

**Solutions:**
- Ensure proper vector dimensionality (384)
- Use cosine similarity metric
- Limit result set with `--top-k`
- Monitor Vectorize performance in dashboard

#### 2. Queue Processing Delays

**Solutions:**
- Check queue consumer scaling in dashboard
- Monitor queue depth and throughput
- Adjust batch sizes for optimal performance
- Implement proper error handling to avoid retries

### Monitoring and Observability

```bash
# Real-time logs
pnpm wrangler tail

# Queue metrics
pnpm wrangler queues list --show-consumers

# Vector index stats
pnpm wrangler vectorize info rafters-color-intel

# Worker analytics
# Cloudflare Dashboard > Workers & Pages > rafters-api > Analytics
```

### Getting Help

1. **Check logs first**: `pnpm wrangler tail`
2. **Review Cloudflare Dashboard**: Workers, Queues, Vectorize sections
3. **Test individual components**: API endpoints, queue operations, vector queries
4. **Verify environment configuration**: Secrets, bindings, routes
5. **Check GitHub Issues**: Known problems and solutions
6. **Contact support**: Include error messages, logs, and reproduction steps

This guide covers the most common setup and troubleshooting scenarios. For specific issues not covered here, check the Cloudflare documentation and GitHub repository for updates.