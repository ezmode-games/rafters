import { expect, test } from '@playwright/test';

test.describe('Registry API Endpoints', () => {
  test('should serve registry root endpoint', async ({ page }) => {
    const response = await page.goto('/registry/index.json');
    expect(response?.status()).toBe(200);

    const data = await response?.json();
    expect(data).toHaveProperty('$schema', 'https://rafters.dev/schemas/registry.json');
    expect(data).toHaveProperty('name', 'Rafters AI Design Intelligence Registry');
    expect(data).toHaveProperty('components');
    expect(Array.isArray(data.components)).toBe(true);
  });

  test('should serve components list endpoint', async ({ page }) => {
    const response = await page.goto('/registry/components/index.json');
    expect(response?.status()).toBe(200);

    const data = await response?.json();
    expect(data).toHaveProperty('components');
    expect(Array.isArray(data.components)).toBe(true);
    expect(data.components.length).toBeGreaterThan(0);
  });

  test('should serve individual component endpoints', async ({ page }) => {
    // Test container component (cognitive load 0)
    const containerResponse = await page.goto('/registry/components/container.json');
    expect(containerResponse?.status()).toBe(200);

    const containerData = await containerResponse?.json();
    expect(containerData).toHaveProperty('name', 'container');
    expect(containerData).toHaveProperty(
      '$schema',
      'https://ui.shadcn.com/schema/registry-item.json'
    );
    expect(containerData.meta?.rafters?.intelligence?.cognitiveLoad).toBe(0);
  });

  test('should serve grid component with correct intelligence', async ({ page }) => {
    const response = await page.goto('/registry/components/grid.json');
    expect(response?.status()).toBe(200);

    const data = await response?.json();
    expect(data).toHaveProperty('name', 'grid');
    expect(data.meta?.rafters?.intelligence?.cognitiveLoad).toBe(4);
    expect(data.meta?.rafters?.usagePatterns?.dos).toContain(
      'Linear - Product catalogs, image galleries, equal-priority content'
    );
  });

  test('should return 404 for non-existent component', async ({ page }) => {
    const response = await page.goto('/registry/components/non-existent.json');
    expect(response?.status()).toBe(404);
  });

  test('should have proper CORS headers', async ({ page }) => {
    const response = await page.goto('/registry/index.json');
    expect(response?.headers()['access-control-allow-origin']).toBe('*');
    expect(response?.headers()['access-control-allow-methods']).toBe('GET, OPTIONS');
  });

  test('should have immutable cache headers', async ({ page }) => {
    const response = await page.goto('/registry/components/button.json');
    expect(response?.headers()['cache-control']).toBe('public, max-age=31536000, immutable');
  });
});

test.describe('LLMs.txt Endpoint', () => {
  test('should serve llms.txt with correct content', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-type']).toBe('text/plain; charset=utf-8');

    const content = await response?.text();
    expect(content).toContain('# Rafters Design Intelligence System');
    expect(content).toContain('## System Overview');
  });

  test('should prioritize components by cognitive load', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response?.text();

    // Container (0/10) should be listed first
    expect(content).toContain('### 1. Container (Cognitive Load: 0/10)');
    // Grid (4/10) should be listed second
    expect(content).toContain('### 2. Grid (Cognitive Load: 4/10)');

    const containerIndex = content.indexOf('### 1. Container');
    const gridIndex = content.indexOf('### 2. Grid');
    expect(containerIndex).toBeLessThan(gridIndex);
  });

  test('should include component intelligence summaries', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response?.text();

    // Container intelligence
    expect(content).toContain('**Purpose**: Invisible layout structure');
    expect(content).toContain('**Key Intelligence**: Use padding (not margins)');

    // Grid intelligence
    expect(content).toContain('**Purpose**: Intelligent layout system with 4 semantic presets');
    expect(content).toContain('Mathematical spacing (golden ratio)');
  });

  test('should include design decision framework', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    const content = await response?.text();

    expect(content).toContain('## Design Decision Framework');
    expect(content).toContain(
      '1. **Cognitive Load**: Choose components appropriate for user mental capacity'
    );
    expect(content).toContain('2. **Attention Economics**: Respect visual hierarchy');
  });

  test('should have proper cache headers', async ({ page }) => {
    const response = await page.goto('/llms.txt');
    expect(response?.headers()['cache-control']).toBe('public, max-age=3600, must-revalidate');
  });
});
