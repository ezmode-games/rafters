/**
 * SSE Token Events Hook
 *
 * Listens to /api/events for real-time token change notifications.
 * Invalidates TanStack Query cache when tokens change, enabling
 * multi-tab support and external tool integration.
 */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { tokenKeys } from '../lib/query';

interface TokenChangeEvent {
  type: 'token-change';
  namespace: string;
  timestamp: number;
}

/**
 * Subscribe to SSE token change events.
 * Automatically invalidates the token query cache on changes
 * from other sources (other tabs, CLI, etc).
 */
export function useTokenEvents(): void {
  const queryClient = useQueryClient();

  useEffect(() => {
    const source = new EventSource('/api/events');

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { type: string; namespace?: string };
        if (data.type === 'token-change') {
          const change = data as TokenChangeEvent;
          // Invalidate specific namespace and the "all tokens" query
          queryClient.invalidateQueries({ queryKey: tokenKeys.namespace(change.namespace) });
          queryClient.invalidateQueries({ queryKey: tokenKeys.all });
        }
      } catch {
        // Ignore malformed events
      }
    };

    source.onerror = () => {
      // EventSource auto-reconnects, no manual handling needed
    };

    return () => {
      source.close();
    };
  }, [queryClient]);
}
