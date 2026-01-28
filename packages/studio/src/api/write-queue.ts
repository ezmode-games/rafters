/**
 * Write Queue for serializing concurrent token updates
 *
 * Ensures that file writes don't race and corrupt token files.
 * Each namespace has its own queue to allow parallel writes to different namespaces.
 */

type WriteOperation<T> = () => Promise<T>;

interface QueueEntry<T> {
  operation: WriteOperation<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

/**
 * Simple queue that serializes async operations
 */
export class WriteQueue {
  private queues = new Map<string, QueueEntry<unknown>[]>();
  private processing = new Set<string>();

  /**
   * Enqueue a write operation for a specific namespace
   *
   * Operations are processed in order per namespace.
   * Different namespaces can be written concurrently.
   */
  async enqueue<T>(namespace: string, operation: WriteOperation<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      // Get or create queue for this namespace
      if (!this.queues.has(namespace)) {
        this.queues.set(namespace, []);
      }

      const queue = this.queues.get(namespace);
      if (!queue) return;
      queue.push({
        operation: operation as WriteOperation<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });

      // Start processing if not already
      this.processQueue(namespace);
    });
  }

  private async processQueue(namespace: string): Promise<void> {
    // Prevent concurrent processing of the same namespace
    if (this.processing.has(namespace)) {
      return;
    }

    this.processing.add(namespace);

    try {
      const queue = this.queues.get(namespace);
      if (!queue) return;

      while (queue.length > 0) {
        const entry = queue.shift();
        if (!entry) continue;

        try {
          const result = await entry.operation();
          entry.resolve(result);
        } catch (error) {
          entry.reject(error);
        }
      }
    } finally {
      this.processing.delete(namespace);

      // Clean up empty queues
      const queue = this.queues.get(namespace);
      if (queue && queue.length === 0) {
        this.queues.delete(namespace);
      }
    }
  }

  /**
   * Wait for all pending namespace queues to drain, then run an operation.
   * Ensures no concurrent reads of partially-written files during save-all.
   */
  async drainThenRun<T>(operation: WriteOperation<T>): Promise<T> {
    // Wait for all currently processing namespaces to finish
    const namespaces = [...this.processing];
    if (namespaces.length > 0) {
      await Promise.all(
        namespaces.map(
          (ns) =>
            new Promise<void>((resolve) => {
              const check = () => {
                if (!this.processing.has(ns)) {
                  resolve();
                } else {
                  setTimeout(check, 10);
                }
              };
              check();
            }),
        ),
      );
    }

    return operation();
  }

  /**
   * Get current queue lengths (for debugging)
   */
  getQueueStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const [namespace, queue] of this.queues) {
      stats[namespace] = queue.length;
    }
    return stats;
  }
}

// Singleton instance for the studio server
export const writeQueue = new WriteQueue();
