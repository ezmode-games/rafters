import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),

  // Registry API routes
  route('api/registry', 'routes/api.registry.tsx'),
  route('api/registry/components', 'routes/api.registry.components.tsx'),
  route('api/registry/components/:name', 'routes/api.registry.components.$name.tsx'),
  route('api/registry/health', 'routes/api.registry.health.tsx'),
] satisfies RouteConfig;
