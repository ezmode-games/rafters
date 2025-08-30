import Anthropic from '@anthropic-ai/sdk';

interface ClaudeClientConfig {
  apiKey: string;
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
  private client: Anthropic;

  constructor(config: ClaudeClientConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  async generateText({ model, maxTokens, messages }: ClaudeRequest): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model,
        max_tokens: maxTokens,
        messages,
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude API');
      }

      return content.text;
    } catch (error) {
      throw new Error(
        `Claude API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

// Cache client instances by API key to reuse connections
const claudeClients: Map<string, ClaudeClient> = new Map();

export function getClaudeClient(apiKey: string): ClaudeClient {
  if (!claudeClients.has(apiKey)) {
    claudeClients.set(apiKey, new ClaudeClient({ apiKey }));
  }
  return claudeClients.get(apiKey)!;
}
