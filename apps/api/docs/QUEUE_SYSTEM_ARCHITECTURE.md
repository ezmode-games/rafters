# Queue System Architecture

The Rafters Color Intelligence system uses Cloudflare Queues to enable asynchronous, scalable color processing. This architecture separates heavy computational work from real-time HTTP requests, ensuring responsive user experiences while processing large color datasets.

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   HTTP Client   │────│  Seed Queue API  │────│  Cloudflare Queue  │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Vectorize     │◄───│  Color Intel API │◄───│   Queue Consumer   │
│   Vector Store  │    │    (Internal)    │    │                    │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

## Components

### 1. Queue Publisher (`src/lib/queue/publisher.ts`)

**Purpose**: Publishes color generation jobs to Cloudflare Queues

**Key Features**:
- **Single Color Publishing**: Process individual colors asynchronously
- **Batch Processing**: Handle up to 100 colors per batch (Cloudflare limit)
- **Spectrum Generation**: Create systematic color spaces for seeding
- **Rate Limiting**: Respects 400 messages/second queue throughput
- **Error Handling**: Graceful failure handling with detailed error responses

**Message Format**:
```typescript
interface ColorSeedMessage {
  oklch: OKLCH;           // Color to process
  token?: string;         // Semantic role (primary, danger, etc.)
  name?: string;          // Override suggested name
  requestId?: string;     // Tracking identifier
  timestamp: number;      // Queue timestamp
}
```

### 2. Queue Consumer (`src/lib/queue/consumer.ts`)

**Purpose**: Processes queued color messages by calling internal color-intel API

**Processing Flow**:
1. Receives batch of `ColorSeedMessage` from queue
2. Creates internal HTTP request to `/api/color-intel`
3. Calls main Hono app with full environment context
4. Acknowledges successful processing or retries on failure
5. Logs processing results for monitoring

**Error Handling**:
- **Success**: `message.ack()` - Remove from queue
- **Failure**: `message.retry()` - Retry with exponential backoff
- **Dead Letter Queue**: Failed messages after max retries

### 3. Queue Routes (`src/routes/seed-queue.ts`)

**Purpose**: HTTP API for triggering queue operations

**Endpoints**:
- `POST /api/seed-queue/single` - Queue single color
- `POST /api/seed-queue/batch` - Queue multiple colors
- `POST /api/seed-queue/spectrum` - Generate and queue color spectrum
- `GET /api/seed-queue/status` - Queue system status

**Security**: All endpoints require `X-API-Key` authentication

### 4. Queue Consumer Entry Point (`src/queue-consumer.ts`)

**Purpose**: Cloudflare Workers queue consumer handler

**Architecture**:
- Creates same Hono app structure as main index.ts
- Includes all routes for internal API calls
- Processes queue messages via `processColorSeedBatch`
- Maintains full environment context for vector storage

## Message Processing Flow

### 1. Queue Publishing

```typescript
// Client request to queue endpoint
POST /api/seed-queue/spectrum
{
  "lightnessSteps": 9,
  "chromaSteps": 5,
  "hueSteps": 12
}

// Publisher generates 540 ColorSeedMessage objects
// Batches into groups of 100 (Cloudflare limit)
// Publishes 6 batches with 250ms delays
```

### 2. Queue Consumption

```typescript
// Cloudflare triggers queue consumer
async queue(batch: MessageBatch<ColorSeedMessage>, env: CloudflareBindings) {
  for (const message of batch.messages) {
    // Create internal HTTP request
    const request = new Request('http://internal/api/color-intel', {
      method: 'POST',
      body: JSON.stringify(message.body)
    });

    // Process via main Hono app
    const result = await app.fetch(request, env);

    // Handle result
    if (result.status === 200) {
      message.ack();  // Success
    } else {
      message.retry(); // Retry
    }
  }
}
```

### 3. Vector Storage

Each processed color automatically generates:
- **384-dimensional vector** for similarity search
- **Complete color intelligence** with AI-generated metadata
- **Accessibility matrices** for WCAG compliance
- **Semantic relationships** for design system integration

## Configuration

### Wrangler Configuration (`wrangler.jsonc`)

```json
{
  "queues": {
    "producers": [{
      "queue": "color-processing-queue",
      "binding": "COLOR_SEED_QUEUE"
    }],
    "consumers": [{
      "queue": "color-processing-queue"
    }]
  },
  "vectorize": [{
    "binding": "VECTORIZE",
    "index_name": "rafters-color-intel"
  }]
}
```

### Environment Variables

**Required for Production**:
- `SEED_QUEUE_API_KEY` - Authentication for queue endpoints
- `CLAUDE_API_KEY` - AI service for color intelligence generation
- `CF_TOKEN` - Cloudflare API token
- `CLAUDE_GATEWAY_URL` - AI Gateway endpoint

## Performance Characteristics

### Queue Limits
- **Messages per batch**: 100 maximum
- **Queue throughput**: 400 messages/second
- **Message size**: 128 KB maximum
- **Batch size**: 256 KB maximum

### Processing Performance
- **Color generation**: ~2-3 seconds per color (includes AI processing)
- **Vector storage**: ~100-200ms per color
- **Batch processing**: Parallel within Cloudflare limits
- **Error retry**: Exponential backoff with jitter

### Scalability
- **Concurrent consumers**: Auto-scaling based on queue depth
- **Global distribution**: Edge processing via Cloudflare Workers
- **Storage**: Unlimited vector storage in Vectorize
- **Cost efficiency**: $0.0014 per color vs $62-125 traditional

## Monitoring and Observability

### Queue Metrics
```bash
# Check queue status
curl -H "X-API-Key: $API_KEY" \
     https://rafters.realhandy.tech/api/seed-queue/status

# View queue dashboard in Cloudflare
# Queues > color-processing-queue > Metrics
```

### Vector Storage Monitoring
```bash
# List recent vectors
pnpm wrangler vectorize list-vectors rafters-color-intel --limit 10

# Check index stats
pnpm wrangler vectorize info rafters-color-intel
```

### Logging
- **Queue consumer**: Logs successful processing with color names
- **Error handling**: Detailed error logging with request context
- **Security**: Unauthorized access attempts logged with IP/User-Agent

## Error Handling Patterns

### 1. Validation Errors
```typescript
// Invalid OKLCH values
{
  "error": "Validation failed",
  "details": "Lightness must be between 0 and 1"
}
```

### 2. Authentication Errors
```typescript
// Missing API key
{
  "error": "Authentication required",
  "message": "Missing X-API-Key header",
  "code": "MISSING_API_KEY"
}
```

### 3. Queue Processing Errors
```typescript
// Consumer processing failure
console.error('Failed to process color seed message:', error);
message.retry(); // Automatic retry
```

### 4. Rate Limiting
```typescript
// Publisher respects 400 msg/sec limit
if (index < batches.length - 1) {
  await this.delay(250); // 250ms between batches
}
```

## Best Practices

### 1. Batch Sizing
- Use spectrum generation for large datasets
- Batch related colors together for efficiency
- Monitor queue depth to avoid overwhelming consumers

### 2. Error Recovery
- Implement proper error handling in consumers
- Use retry mechanisms for transient failures
- Monitor dead letter queues for persistent failures

### 3. Security
- Always use API key authentication for queue endpoints
- Rotate API keys regularly
- Monitor unauthorized access attempts

### 4. Performance Optimization
- Use batch operations for multiple colors
- Leverage spectrum generation for systematic color spaces
- Monitor processing times and adjust batch sizes accordingly

This architecture enables the Rafters system to scale from individual color requests to massive color dataset processing while maintaining consistent performance and reliability.