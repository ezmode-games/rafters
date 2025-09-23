/**
 * Queue Callback Implementation (Future)
 *
 * Publishes registry change events to message queue for Rafters+ deployments
 */

import type { RegistryChangeCallback, RegistryEvent } from '../types/events.js';

// Future: Queue client interface for Rafters+
interface QueueClient {
  publish(topic: string, message: RegistryEvent): void;
}

export function createQueueCallback(queueClient: QueueClient): RegistryChangeCallback {
  return (event: RegistryEvent): void => {
    switch (event.type) {
      case 'token-changed':
        queueClient.publish('design-system.token-changed', event);
        break;
      case 'tokens-batch-changed':
        queueClient.publish('design-system.tokens-batch-changed', event);
        break;
      case 'registry-initialized':
        queueClient.publish('design-system.registry-initialized', event);
        break;
    }
  };
}
