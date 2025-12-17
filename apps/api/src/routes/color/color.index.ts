import { createRouter } from '@/lib/create-app';

import * as handlers from './color.handlers';
import * as routes from './color.routes';

const router = createRouter()
  .openapi(routes.searchColors, handlers.searchColors) // Must come before :oklch to avoid conflict
  .openapi(routes.getColor, handlers.getColor);

export default router;
