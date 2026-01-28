/**
 * Studio App - Visual Decision Recorder
 *
 * Not a token editor. A canvas for capturing design decisions.
 * The entire UI IS the preview - we dogfood our own tokens.
 *
 * ALL styling uses Tailwind token classes via classy. No inline styles.
 * When tokens change, the UI updates via CSS HMR.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@rafters/ui/components/ui/card';
import { Container } from '@rafters/ui/components/ui/container';
import { Grid } from '@rafters/ui/components/ui/grid';
import { Muted, P } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Snowstorm } from './components/first-run/Snowstorm';
import { usePrimaryColorMutation } from './lib/query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

type AppState = 'first-run' | 'workspace';

interface OklchColor {
  h: number;
  s: number;
  l: number;
}

function StudioContent() {
  const [appState, setAppState] = useState<AppState>('first-run');
  const [primaryColor, setPrimaryColor] = useState<OklchColor | null>(null);
  const [colorReason, setColorReason] = useState<string>('');

  const primaryColorMutation = usePrimaryColorMutation();

  const handleColorSelect = useCallback(
    (color: OklchColor, reason: string) => {
      setPrimaryColor(color);
      setColorReason(reason);

      // Convert to OKLCH format (s is actually chroma in Snowstorm)
      const oklch = {
        l: color.l,
        c: color.s,
        h: color.h,
        alpha: 1,
      };

      // Paint the scale and write to tokens
      primaryColorMutation.mutate(
        { color: oklch, reason },
        {
          onSuccess: () => {
            console.log('Primary color scale applied');
            setAppState('workspace');
          },
          onError: (err) => {
            console.error('Failed to apply primary color:', err);
            // Still transition to workspace, but show error state
            setAppState('workspace');
          },
        },
      );
    },
    [primaryColorMutation],
  );

  if (appState === 'first-run') {
    return <Snowstorm onColorSelect={handleColorSelect} />;
  }

  // Workspace view - ALL styling via token classes through classy
  // bg-primary will reflect the chosen color via CSS HMR
  return (
    <Container
      as="main"
      size="full"
      padding="6"
      className={classy('min-h-screen', 'bg-background')}
    >
      <Grid preset="linear" columns={1} gap="6" className={classy('mx-auto', 'max-w-md')}>
        <Grid.Item>
          <Card>
            <CardHeader>
              <CardTitle>Primary Color Selected</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Color swatch uses bg-primary - updates via HMR */}
              <div
                className={classy('mb-4', 'h-24', 'w-24', 'rounded-lg', 'bg-primary', 'shadow-md')}
              />
              {primaryColor && (
                <P className={classy('mb-2', 'text-sm', 'font-mono')}>
                  oklch({primaryColor.l.toFixed(2)} {primaryColor.s.toFixed(2)}{' '}
                  {primaryColor.h.toFixed(0)})
                </P>
              )}
              {colorReason && <Muted>{colorReason}</Muted>}
              {primaryColorMutation.isPending && (
                <Muted className={classy('mt-2')}>Generating color scale...</Muted>
              )}
            </CardContent>
          </Card>
        </Grid.Item>
      </Grid>
    </Container>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudioContent />
    </QueryClientProvider>
  );
}
