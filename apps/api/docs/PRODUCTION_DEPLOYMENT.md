# Production Deployment Guide

Comprehensive guide for deploying the Rafters Color Intelligence API to production with optimal performance, security, and monitoring.

## Pre-deployment Checklist

### Code Quality
- [ ] All tests pass (`pnpm test:preflight`)
- [ ] TypeScript compiles without errors (`pnpm typecheck`)
- [ ] Code passes linting (`pnpm lint`)
- [ ] Dependencies are up to date and security-audited
- [ ] No console.log statements in production code

### Environment Configuration
- [ ] Production secrets configured in Cloudflare
- [ ] Wrangler.jsonc has correct production routes
- [ ] Domain routing properly configured
- [ ] Rate limiting and security headers configured

### Infrastructure
- [ ] Vectorize index created and configured
- [ ] Cloudflare Queue created with proper naming
- [ ] AI Gateway configured for cost optimization
- [ ] DNS routing configured for custom domain

## Environment Setup

### 1. Production Secrets

```bash
# Set all required secrets for production
pnpm wrangler secret put SEED_QUEUE_API_KEY --env production
pnpm wrangler secret put CLAUDE_API_KEY --env production
pnpm wrangler secret put CF_TOKEN --env production
pnpm wrangler secret put CLAUDE_GATEWAY_URL --env production

# Verify secrets are set
pnpm wrangler secret list --env production
```

**Secret Generation:**
```bash
# Generate secure 64-character API key
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Wrangler Configuration

**Production wrangler.jsonc:**
```json
{
  "name": "rafters-api",
  "main": "src/index.ts",
  "compatibility_date": "2025-08-30",
  "observability": {
    "enabled": true
  },
  "routes": [
    {
      "pattern": "rafters.realhandy.tech/api/*",
      "zone_id": "your-production-zone-id"
    }
  ],
  "vectorize": [
    {
      "binding": "VECTORIZE",
      "index_name": "rafters-color-intel-prod"
    }
  ],
  "ai": {
    "binding": "AI"
  },
  "queues": {
    "producers": [
      {
        "queue": "color-processing-queue-prod",
        "binding": "COLOR_SEED_QUEUE"
      }
    ],
    "consumers": [
      {
        "queue": "color-processing-queue-prod"
      }
    ]
  },
  "limits": {
    "cpu_ms": 30000
  }
}
```

### 3. Production Infrastructure

#### Vectorize Index
```bash
# Create production vector index
pnpm wrangler vectorize create rafters-color-intel-prod \
  --dimensions 384 \
  --metric cosine

# Verify index configuration
pnpm wrangler vectorize info rafters-color-intel-prod
```

#### Cloudflare Queue
```bash
# Create production queue
pnpm wrangler queues create color-processing-queue-prod

# Configure consumer settings
pnpm wrangler queues consumer update color-processing-queue-prod \
  --max-batch-size 10 \
  --max-wait-time 5000 \
  --max-retries 3
```

## Deployment Process

### 1. Staging Deployment

```bash
# Deploy to staging first
pnpm wrangler deploy --env staging

# Run staging tests
curl -H "X-API-Key: $STAGING_API_KEY" \
     https://staging.rafters.realhandy.tech/api/seed-queue/status

# Test critical paths
./scripts/test-staging.sh
```

### 2. Production Deployment

```bash
# Deploy to production
pnpm wrangler deploy --env production

# Verify deployment
curl https://rafters.realhandy.tech/api/seed-queue/status \
  -H "X-API-Key: $PRODUCTION_API_KEY"
```

### 3. Post-deployment Verification

```bash
# Test color intelligence endpoint
curl -X POST https://rafters.realhandy.tech/api/color-intel \
  -H "Content-Type: application/json" \
  -d '{"oklch": {"l": 0.65, "c": 0.12, "h": 240}}'

# Test queue system
curl -H "X-API-Key: $API_KEY" \
     -H "Content-Type: application/json" \
     -X POST https://rafters.realhandy.tech/api/seed-queue/single \
     -d '{"oklch": {"l": 0.55, "c": 0.15, "h": 355}}'

# Verify vector storage is working
pnpm wrangler vectorize list-vectors rafters-color-intel-prod --limit 5
```

## Performance Optimization

### 1. AI Gateway Configuration

**Benefits:**
- Request caching for repeated queries
- Cost optimization through intelligent routing
- Rate limiting and analytics
- Fallback handling

**Setup:**
```bash
# Create AI Gateway in Cloudflare Dashboard
# AI Gateway > Create Gateway

# Configure endpoint
CLAUDE_GATEWAY_URL="https://gateway.ai.cloudflare.com/v1/your-account/rafters-claude/anthropic"
```

### 2. Vector Index Optimization

**Index Configuration:**
- **Dimensions**: 384 (matches color intelligence vectors)
- **Metric**: Cosine similarity (optimal for semantic search)
- **Namespace Strategy**: Use for environment separation

```bash
# Monitor index performance
pnpm wrangler vectorize info rafters-color-intel-prod

# Expected metrics:
# - Query latency: <200ms
# - Index size: Scales with color count
# - Memory usage: Efficient with cosine metric
```

### 3. Queue Performance Tuning

**Consumer Configuration:**
```bash
# Optimize batch processing
pnpm wrangler queues consumer update color-processing-queue-prod \
  --max-batch-size 10 \
  --max-wait-time 5000 \
  --max-retries 3 \
  --retry-delay 30000
```

**Performance Targets:**
- **Throughput**: 400 messages/second (Cloudflare limit)
- **Latency**: <3 seconds per color (including AI processing)
- **Error Rate**: <1% (with retry handling)
- **Queue Depth**: Maintain <1000 pending messages

## Security Configuration

### 1. API Key Management

**Best Practices:**
- Use 64-character random hex strings
- Rotate keys quarterly
- Separate keys for different environments
- Monitor usage patterns for anomalies

**Key Rotation Process:**
```bash
# Generate new key
NEW_API_KEY=$(openssl rand -hex 32)

# Update secret
pnpm wrangler secret put SEED_QUEUE_API_KEY --env production

# Update client configurations
# Monitor for authentication failures
# Remove old key after verification
```

### 2. Rate Limiting

**Implementation:**
```typescript
// Add to middleware stack
app.use('*', rateLimiter({
  windowMs: 60 * 1000,      // 1 minute
  max: 100,                 // 100 requests per minute
  keyGenerator: (req) => req.headers['cf-connecting-ip'],
  standardHeaders: true
}));
```

### 3. Security Headers

**CORS Configuration:**
```typescript
app.use('*', cors({
  origin: [
    'https://rafters.realhandy.tech',
    'https://studio.rafters.realhandy.tech'
  ],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-API-Key'],
  credentials: false
}));
```

### 4. Request Validation

**Zod Validation:**
- All request bodies validated with Zod schemas
- OKLCH values bounded (L: 0-1, C: 0+, H: 0-360)
- Batch size limits enforced (max 1000 colors)
- Request size limits (max 256KB)

## Monitoring and Observability

### 1. Cloudflare Analytics

**Key Metrics:**
- **Request Volume**: Requests per second/minute/hour
- **Response Time**: P50, P95, P99 latencies
- **Error Rate**: 4xx/5xx response codes
- **Geographic Distribution**: Traffic by region

**Dashboard Setup:**
- Cloudflare Dashboard > Workers & Pages > rafters-api > Analytics
- Set up alerts for error rate > 5%
- Monitor request volume spikes

### 2. Queue Monitoring

**Metrics to Watch:**
- Queue depth (pending messages)
- Processing rate (messages/second)
- Error rate (failed messages)
- Dead letter queue size

**Alerting:**
```bash
# Monitor via Wrangler
pnpm wrangler queues list --show-producers
pnpm wrangler queues consumer list color-processing-queue-prod

# Set up Cloudflare Dashboard alerts:
# - Queue depth > 5000 messages
# - Error rate > 2%
# - Processing delay > 30 seconds
```

### 3. Vector Database Monitoring

**Performance Metrics:**
- Query latency
- Index size growth
- Memory usage
- Query volume

**Optimization Triggers:**
- Query latency > 500ms: Consider index optimization
- Memory usage > 80%: Review vector dimensions
- Query volume spikes: Scale vector index if needed

### 4. AI Service Monitoring

**Cost Tracking:**
- Claude API usage and costs
- Cloudflare AI Workers usage
- AI Gateway cache hit rates

**Performance Tracking:**
- AI response times
- Generation quality metrics
- Fallback usage rates

## Scaling Considerations

### 1. Traffic Growth

**Current Capacity:**
- **Queue**: 400 messages/second
- **Vector Queries**: ~1000 queries/second
- **AI Processing**: ~200 colors/second (limited by AI service)

**Scaling Strategies:**
- **Horizontal**: Deploy to multiple regions
- **Caching**: Implement Redis for frequently requested colors
- **Optimization**: Batch vector operations
- **Load Balancing**: Use Cloudflare Load Balancer

### 2. Storage Growth

**Vector Storage:**
- **Current**: 384 dimensions × 4 bytes × color count
- **Projected**: Scales linearly with color database growth
- **Optimization**: Regular index maintenance and cleanup

### 3. Cost Optimization

**Cost Centers:**
- AI service calls (largest cost)
- Vector storage and queries
- Workers CPU time
- Queue operations

**Optimization Strategies:**
- AI Gateway caching (50-80% cost reduction)
- Efficient vector indexing
- Queue batch processing
- Cloudflare AI as fallback

## Disaster Recovery

### 1. Backup Strategy

**Data Protection:**
- Vector index backups (manual snapshots)
- Queue message durability (built-in)
- Configuration backups (git repository)
- Secret management (separate secure storage)

### 2. Rollback Plan

```bash
# Quick rollback to previous version
pnpm wrangler rollback --env production

# Verify rollback
curl https://rafters.realhandy.tech/api/seed-queue/status

# Restore from backup if needed
pnpm wrangler vectorize restore rafters-color-intel-prod --backup-file backup.json
```

### 3. Incident Response

**Escalation Process:**
1. **Monitor alerts**: Automated notifications
2. **Quick assessment**: Check dashboards and logs
3. **Immediate mitigation**: Rollback if necessary
4. **Root cause analysis**: Investigate and document
5. **Prevention**: Implement safeguards

## Maintenance

### 1. Regular Tasks

**Weekly:**
- Review performance metrics
- Check error logs for patterns
- Monitor cost trends
- Verify backup integrity

**Monthly:**
- Update dependencies
- Security audit
- Performance optimization review
- Documentation updates

**Quarterly:**
- API key rotation
- Disaster recovery testing
- Capacity planning review
- Security penetration testing

### 2. Updates and Patches

```bash
# Update dependencies
pnpm update

# Test in staging
pnpm wrangler deploy --env staging
./scripts/test-staging.sh

# Deploy to production
pnpm wrangler deploy --env production
```

### 3. Performance Tuning

**Regular Optimization:**
- Vector index maintenance
- Queue consumer tuning
- AI service optimization
- Cache configuration

This production deployment guide ensures a robust, scalable, and secure deployment of the Rafters Color Intelligence API with comprehensive monitoring and maintenance procedures.