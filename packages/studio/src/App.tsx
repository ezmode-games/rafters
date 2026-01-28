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
import { Muted } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Snowstorm } from './components/first-run/Snowstorm';

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
  const [, setPrimaryColor] = useState<OklchColor | null>(null);

  const handleColorSelect = useCallback((color: OklchColor, reason: string) => {
    setPrimaryColor(color);
    // Issue #732 will paint the scale and write to tokens
    // After that, bg-primary will reflect the choice via CSS HMR
    console.log('Primary color selected:', `oklch(${color.l} ${color.s} ${color.h})`);
    console.log('Reason:', reason);
    setAppState('workspace');
  }, []);

  if (appState === 'first-run') {
    return <Snowstorm onColorSelect={handleColorSelect} />;
  }

  // Placeholder workspace - ALL styling via token classes through classy
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
              {/* Color swatch uses bg-primary - will update via HMR after #732 */}
              <div
                className={classy('mb-4', 'h-24', 'w-24', 'rounded-lg', 'bg-primary', 'shadow-md')}
              />
              <Muted>WhyGate and scale painting coming in issues #731, #732</Muted>
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
