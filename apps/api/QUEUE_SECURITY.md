# Queue Security Configuration

## API Key Protection

The seed queue endpoints are protected by API key authentication to prevent unauthorized access and abuse.

### Environment Variables

Set this in your Cloudflare Workers environment:

```bash
SEED_QUEUE_API_KEY=your-secure-random-api-key-here
```

**Generate a secure API key:**
```bash
# Generate a 32-character random key
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Protected Endpoints

All seed queue endpoints require the `X-API-Key` header:

```bash
curl -H "X-API-Key: your-api-key" \
     -H "Content-Type: application/json" \
     -X POST https://rafters.realhandy.tech/api/seed-queue/spectrum \
     -d '{"lightnessSteps": 9, "chromaSteps": 5, "hueSteps": 12}'
```

### Security Features

1. **Timing-safe comparison** - Prevents timing attacks on API key validation
2. **Request logging** - Unauthorized attempts are logged with IP and user agent
3. **Environment isolation** - Different keys for dev/staging/production
4. **Header standardization** - Accepts both `X-API-Key` and `x-api-key`

### Error Responses

**Missing API Key (401):**
```json
{
  "error": "Authentication required",
  "message": "Missing X-API-Key header",
  "code": "MISSING_API_KEY"
}
```

**Invalid API Key (403):**
```json
{
  "error": "Invalid API key",
  "message": "The provided API key is not valid",
  "code": "INVALID_API_KEY"
}
```

### Rate Limiting

Even with valid API keys, queue endpoints respect Cloudflare Queues limits:
- **400 messages/second** per queue
- **100 messages/batch** maximum
- **128 KB** per message maximum
- **256 KB** per batch maximum

### Deployment

Remember to set the `SEED_QUEUE_API_KEY` in:
1. **Wrangler secrets:** `wrangler secret put SEED_QUEUE_API_KEY`
2. **Cloudflare Dashboard:** Workers & Pages > Your Worker > Settings > Variables
3. **CI/CD:** Set as encrypted secret in your deployment pipeline