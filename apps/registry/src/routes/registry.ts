/**
 * Registry metadata endpoints
 *
 * Provides information about available components and registry structure
 * for AI agents and CLI tools to consume.
 */

import { Hono } from 'hono';
import { getComponentRegistry } from '../services/componentService';

export const registry = new Hono();

// Get complete registry metadata
registry.get('/', async (c) => {
  try {
    const registryData = await getComponentRegistry();

    return c.json({
      $schema: 'https://rafters.dev/schemas/registry.json',
      name: 'Rafters AI Design Intelligence Registry',
      version: '1.0.0',
      description: 'Components with embedded design reasoning for AI agents',
      baseUrl: 'https://rafters.realhandy.tech/registry',
      components: registryData.components.map((component) => ({
        name: component.name,
        description: component.description,
        version: component.version,
        type: component.type,
        category: component.category,
        cognitiveLoad: component.intelligence.cognitiveLoad,
        dependencies: component.dependencies,
        files: component.files.map((f) => f.name),
      })),
      totalComponents: registryData.components.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching registry:', error);
    return c.json(
      {
        error: 'Failed to fetch registry',
        message: 'Unable to load component registry data',
      },
      500
    );
  }
});

// Get registry statistics
registry.get('/stats', async (c) => {
  try {
    const registryData = await getComponentRegistry();

    const stats = {
      totalComponents: registryData.components.length,
      categories: {} as Record<string, number>,
      averageCognitiveLoad: 0,
      dependencyCount: 0,
    };

    let totalCognitiveLoad = 0;
    const allDependencies = new Set<string>();

    for (const component of registryData.components) {
      // Count by category
      stats.categories[component.category] = (stats.categories[component.category] || 0) + 1;

      // Calculate average cognitive load
      totalCognitiveLoad += component.intelligence.cognitiveLoad;

      // Track unique dependencies
      for (const dep of component.dependencies) {
        allDependencies.add(dep);
      }
    }

    stats.averageCognitiveLoad = totalCognitiveLoad / registryData.components.length;
    stats.dependencyCount = allDependencies.size;

    return c.json(stats);
  } catch (error) {
    console.error('Error fetching registry stats:', error);
    return c.json(
      {
        error: 'Failed to fetch stats',
        message: 'Unable to calculate registry statistics',
      },
      500
    );
  }
});
