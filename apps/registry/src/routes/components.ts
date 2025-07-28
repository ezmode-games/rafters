/**
 * Component endpoints
 *
 * Provides access to individual components with their source code,
 * intelligence metadata, and AI training stories.
 */

import { Hono } from 'hono';
import { getComponent, getComponentRegistry } from '../services/componentService';

export const components = new Hono();

// List all available components
components.get('/', async (c) => {
  try {
    const registryData = await getComponentRegistry();

    return c.json({
      components: registryData.components.map((component) => ({
        name: component.name,
        description: component.description,
        version: component.version,
        category: component.category,
        intelligence: {
          cognitiveLoad: component.intelligence.cognitiveLoad,
          attentionEconomics: component.intelligence.attentionEconomics,
          accessibility: component.intelligence.accessibility,
        },
        files: component.files.map((f) => f.name),
        dependencies: component.dependencies,
        lastUpdated: component.lastUpdated,
      })),
      total: registryData.components.length,
    });
  } catch (error) {
    console.error('Error listing components:', error);
    return c.json(
      {
        error: 'Failed to list components',
        message: 'Unable to load component list',
      },
      500
    );
  }
});

// Get specific component by name
components.get('/:name', async (c) => {
  try {
    const componentName = c.req.param('name');
    const component = await getComponent(componentName);

    if (!component) {
      return c.json(
        {
          error: 'Component not found',
          message: `Component '${componentName}' does not exist in the registry`,
          availableComponents: (await getComponentRegistry()).components.map((c) => c.name),
        },
        404
      );
    }

    return c.json(component);
  } catch (error) {
    console.error('Error fetching component:', error);
    return c.json(
      {
        error: 'Failed to fetch component',
        message: 'Unable to load component data',
      },
      500
    );
  }
});

// Get component source code
components.get('/:name/source', async (c) => {
  try {
    const componentName = c.req.param('name');
    const component = await getComponent(componentName);

    if (!component) {
      return c.json(
        {
          error: 'Component not found',
          message: `Component '${componentName}' does not exist in the registry`,
        },
        404
      );
    }

    const sourceFile = component.files.find(
      (f) => f.name.endsWith('.tsx') && !f.name.includes('.stories.')
    );

    if (!sourceFile) {
      return c.json(
        {
          error: 'Source not found',
          message: 'Component source file not available',
        },
        404
      );
    }

    return c.text(sourceFile.content, 200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Component-Name': componentName,
      'X-Component-Version': component.version,
    });
  } catch (error) {
    console.error('Error fetching component source:', error);
    return c.json(
      {
        error: 'Failed to fetch source',
        message: 'Unable to load component source code',
      },
      500
    );
  }
});

// Get component stories (AI training scenarios)
components.get('/:name/stories', async (c) => {
  try {
    const componentName = c.req.param('name');
    const component = await getComponent(componentName);

    if (!component) {
      return c.json(
        {
          error: 'Component not found',
          message: `Component '${componentName}' does not exist in the registry`,
        },
        404
      );
    }

    const storyFiles = component.files.filter((f) => f.name.includes('.stories.'));

    return c.json({
      component: componentName,
      stories: storyFiles.map((story) => ({
        name: story.name,
        type: story.type,
        content: story.content,
      })),
      totalStories: storyFiles.length,
    });
  } catch (error) {
    console.error('Error fetching component stories:', error);
    return c.json(
      {
        error: 'Failed to fetch stories',
        message: 'Unable to load component training stories',
      },
      500
    );
  }
});
