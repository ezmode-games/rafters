interface ClaudeClientConfig {
  apiKey: string;
  gatewayUrl?: string; // Optional CF Gateway URL
  cfToken?: string; // CF AI Gateway authentication token
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeRequest {
  model: string;
  maxTokens: number;
  messages: ClaudeMessage[];
}

export class ClaudeClient {
  private apiKey: string;
  private baseUrl: string;
  private cfToken?: string;

  constructor(config: ClaudeClientConfig) {
    this.apiKey = config.apiKey;
    this.cfToken = config.cfToken;
    // Use CF Gateway if provided, otherwise direct Anthropic API
    this.baseUrl = config.gatewayUrl || 'https://api.anthropic.com';
  }

  async generateText({ model, maxTokens, messages }: ClaudeRequest): Promise<string> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      };

      if (this.cfToken && this.baseUrl.includes('gateway.ai.cloudflare.com')) {
        // Using CF Gateway - need both CF token AND Claude API key
        headers['cf-aig-authorization'] = `Bearer ${this.cfToken}`;
        headers['x-api-key'] = this.apiKey;
      } else {
        // Direct API - use Claude API key only
        headers['x-api-key'] = this.apiKey;
      }

      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.content?.[0]?.text) {
        throw new Error('Invalid response format from Claude API');
      }

      return data.content[0].text;
    } catch (error) {
      throw new Error(
        `Claude API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Cache client instances by API key to reuse connections
const claudeClients: Map<string, ClaudeClient> = new Map();

export function getClaudeClient(
  apiKey: string,
  gatewayUrl?: string,
  cfToken?: string
): ClaudeClient {
  const cacheKey = `${apiKey}:${gatewayUrl || 'direct'}:${cfToken || 'no-token'}`;
  if (!claudeClients.has(cacheKey)) {
    claudeClients.set(cacheKey, new ClaudeClient({ apiKey, gatewayUrl, cfToken }));
  }
  return claudeClients.get(cacheKey)!;
}
