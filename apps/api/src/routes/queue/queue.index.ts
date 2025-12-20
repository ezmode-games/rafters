import { createRouter } from '@/lib/create-app';

import * as handlers from './queue.handlers';
import * as routes from './queue.routes';

const router = createRouter()
  .openapi(routes.queue, handlers.queue)
  .openapi(routes.batch, handlers.batch)
  .openapi(routes.spectrum, handlers.spectrum)
  .openapi(routes.list, handlers.list);

export default router;
