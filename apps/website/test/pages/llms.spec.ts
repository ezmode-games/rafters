import { describe, expect, it } from 'vitest';

describe('llms.txt behavior', () => {
  it('should generate content with proper structure', async () => {
    // Import the GET function from the llms.txt endpoint
    const { GET } = await import('../../src/pages/llms.txt');

    const response = await GET();
    const content = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(content).toContain('# Rafters Design Intelligence System');
  });

  it('should include system overview section', async () => {
    const { GET } = await import('../../src/pages/llms.txt');
    const response = await GET();
    const content = await response.text();

    expect(content).toContain('## System Overview');
    expect(content).toContain('AI-first design system');
    expect(content).toContain('Human-AI Collaboration Model');
  });

  it('should include core design principles', async () => {
    const { GET } = await import('../../src/pages/llms.txt');
    const response = await GET();
    const content = await response.text();

    expect(content).toContain('## Core Design Principles');
    expect(content).toContain('### Cognitive Load Management');
    expect(content).toContain('### Attention Economics');
    expect(content).toContain('### Trust Building Patterns');
    expect(content).toContain('### Accessibility Intelligence');
  });

  it('should prioritize Container and Grid components correctly', async () => {
    const { GET } = await import('../../src/pages/llms.txt');
    const response = await GET();
    const content = await response.text();

    expect(content).toContain('### 1. Container (Cognitive Load: 0/10)');
    expect(content).toContain('### 2. Grid (Cognitive Load: 4/10)');

    // Container should appear before Grid
    const containerIndex = content.indexOf('### 1. Container');
    const gridIndex = content.indexOf('### 2. Grid');
    expect(containerIndex).toBeLessThan(gridIndex);
  });

  it('should include decision framework for AI agents', async () => {
    const { GET } = await import('../../src/pages/llms.txt');
    const response = await GET();
    const content = await response.text();

    expect(content).toContain('## Design Decision Framework');
    expect(content).toContain('1. **Cognitive Load**');
    expect(content).toContain('2. **Attention Economics**');
    expect(content).toContain('3. **Trust Building**');
    expect(content).toContain('4. **Accessibility**');
  });

  it('should reference registry API endpoints', async () => {
    const { GET } = await import('../../src/pages/llms.txt');
    const response = await GET();
    const content = await response.text();

    expect(content).toContain('/registry/index.json');
    expect(content).toContain('/registry/components/index.json');
    expect(content).toContain('/registry/components/{name}.json');
  });

  it('should include semantic token guidance', async () => {
    const { GET } = await import('../../src/pages/llms.txt');
    const response = await GET();
    const content = await response.text();

    expect(content).toContain('## Semantic Token System');
    expect(content).toContain('bg-primary vs bg-blue-500');
    expect(content).toContain('contextual intent');
  });

  it('should have proper caching headers', async () => {
    const { GET } = await import('../../src/pages/llms.txt');
    const response = await GET();

    expect(response.headers.get('Cache-Control')).toBe('public, max-age=3600, must-revalidate');
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });
});
