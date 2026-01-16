/**
 * Token Save Hook
 *
 * Handles saving token changes with reason to the API.
 */

import { useCallback, useState } from 'react';
import type { Token } from '../api/token-loader';

interface SaveState {
  saving: boolean;
  error: string | null;
  success: boolean;
}

interface UseTokenSaveReturn {
  saveToken: (
    namespace: string,
    name: string,
    value: unknown,
    reason: string,
  ) => Promise<Token | null>;
  state: SaveState;
  reset: () => void;
}

/**
 * Hook for saving token changes with reason
 */
export function useTokenSave(): UseTokenSaveReturn {
  const [state, setState] = useState<SaveState>({
    saving: false,
    error: null,
    success: false,
  });

  const reset = useCallback(() => {
    setState({ saving: false, error: null, success: false });
  }, []);

  const saveToken = useCallback(
    async (
      namespace: string,
      name: string,
      value: unknown,
      reason: string,
    ): Promise<Token | null> => {
      setState({ saving: true, error: null, success: false });

      try {
        const response = await fetch(`/api/token/${namespace}/${name}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value, reason }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to save token');
        }

        setState({ saving: false, error: null, success: true });
        return data.token as Token;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setState({ saving: false, error: message, success: false });
        return null;
      }
    },
    [],
  );

  return { saveToken, state, reset };
}
