import { createRouter } from '@/lib/create-app';

import * as handlers from './tokens.handlers';
import * as routes from './tokens.routes';

const router = createRouter()
  // Getters
  .openapi(routes.getSystem, handlers.getSystem)
  .openapi(routes.getAllTokens, handlers.getAllTokens)
  .openapi(routes.getNamespace, handlers.getNamespace)
  .openapi(routes.getToken, handlers.getToken)
  // Setters
  .openapi(routes.setToken, handlers.setToken)
  .openapi(routes.batchSetTokens, handlers.batchSetTokens)
  .openapi(routes.clearOverride, handlers.clearOverride)
  // Reset
  .openapi(routes.resetNamespace, handlers.resetNamespace);

export default router;
