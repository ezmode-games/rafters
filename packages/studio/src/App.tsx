/**
 * Studio App
 *
 * Root component. Routes between first-run and workspace phases.
 * No header bar, no chrome. Logo + save float over content.
 */

import { QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FirstRun } from './components/first-run/FirstRun';
import { SaveButton } from './components/shared/SaveButton';
import { Workspace } from './components/workspaces/Workspace';
import { StudioProvider, useStudioDispatch, useStudioState } from './context/StudioContext';
import { fetchAllTokens, queryClient, tokenKeys } from './lib/query';

function StudioRouter() {
  const { phase } = useStudioState();
  const dispatch = useStudioDispatch();

  // Load tokens to detect first-run vs workspace
  const { data, isLoading } = useQuery({
    queryKey: tokenKeys.all,
    queryFn: fetchAllTokens,
  });

  // Detect first-run: primary color not set
  useEffect(() => {
    if (isLoading || !data) return;

    const colorTokens = data.tokens.color || [];
    const hasSemanticTokens = data.tokens.semantic && data.tokens.semantic.length > 0;
    const primaryToken = colorTokens.find(
      (t) => t.name === 'color-primary' || t.name === 'primary',
    );

    const hasPrimary = primaryToken?.userOverride !== undefined;

    if (hasPrimary && hasSemanticTokens) {
      dispatch({ type: 'SET_PHASE', phase: 'workspace' });
    } else {
      dispatch({ type: 'SET_PHASE', phase: 'first-run' });
    }
  }, [data, isLoading, dispatch]);

  if (phase === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white">
      {phase === 'first-run' ? <FirstRun /> : <Workspace />}
      <SaveButton />
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudioProvider>
        <StudioRouter />
      </StudioProvider>
    </QueryClientProvider>
  );
}
