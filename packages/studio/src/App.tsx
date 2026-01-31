/**
 * Studio App - Visual Decision Recorder
 *
 * Not a token editor. A canvas for capturing design decisions.
 * The entire UI IS the preview - we dogfood our own tokens.
 *
 * After primary color: system paints from defaults (math-derived).
 * Designer only speaks when deviating from defaults.
 */

import type { ColorValue, OKLCH } from '@rafters/shared';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { Snowstorm } from './components/first-run/Snowstorm';
import {
  type LogEntry,
  useConfig,
  useConfigMutation,
  usePrimaryColorMutation,
  useRegistryLog,
  useTokens,
} from './lib/query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

const LOG_TYPE_COLORS: Record<LogEntry['type'], string> = {
  init: 'text-blue-400',
  load: 'text-green-400',
  add: 'text-emerald-400',
  update: 'text-yellow-400',
  change: 'text-orange-400',
  persist: 'text-purple-400',
};

function RegistryActivityLog() {
  const { data, isLoading } = useRegistryLog();

  if (isLoading) return <div className="text-muted-foreground text-xs">Loading log...</div>;
  if (!data?.log.length)
    return <div className="text-muted-foreground text-xs">No activity yet</div>;

  return (
    <div className="space-y-0.5 font-mono text-[10px]">
      {data.log.slice(0, 50).map((entry, i) => (
        <div key={`${entry.timestamp}-${i}`} className="flex gap-2">
          <span className="text-muted-foreground shrink-0">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </span>
          <span className={`shrink-0 w-14 ${LOG_TYPE_COLORS[entry.type]}`}>[{entry.type}]</span>
          <span className="text-foreground truncate">{entry.message}</span>
        </div>
      ))}
    </div>
  );
}

function RegistryTokensList() {
  const { data, isLoading, error } = useTokens();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (isLoading) return <div className="text-muted-foreground text-xs">Loading tokens...</div>;
  if (error) return <div className="text-destructive text-xs">Error: {error.message}</div>;
  if (!data) return null;

  const namespaces = Object.entries(data.tokens);
  const totalTokens = namespaces.reduce((sum, [, tokens]) => sum + tokens.length, 0);

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground">{totalTokens} tokens in registry</div>
      {namespaces.map(([ns, tokens]) => (
        <div key={ns}>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
            {ns} ({tokens.length})
          </div>
          <div className="space-y-1">
            {tokens.slice(0, 10).map((token) => {
              const isColorValue = typeof token.value === 'object' && 'scale' in token.value;
              const isExpanded = expanded === token.name;

              return (
                <div key={token.name} className="text-xs">
                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : token.name)}
                    className="flex items-center gap-2 w-full text-left hover:bg-muted/50 px-1 rounded"
                  >
                    <span className="text-muted-foreground">{isExpanded ? '-' : '+'}</span>
                    <span className="font-mono">{token.name}</span>
                    {isColorValue && (
                      <span className="text-muted-foreground">
                        [{(token.value as ColorValue).name}]
                      </span>
                    )}
                    {typeof token.value === 'string' && (
                      <span className="text-muted-foreground truncate max-w-32">{token.value}</span>
                    )}
                  </button>
                  {isExpanded && (
                    <pre className="ml-4 mt-1 p-2 bg-muted/30 rounded text-[10px] overflow-auto max-h-48">
                      {JSON.stringify(token, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
            {tokens.length > 10 && (
              <div className="text-xs text-muted-foreground pl-4">
                ...and {tokens.length - 10} more
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function RegistryDebugPanel() {
  const [activeTab, setActiveTab] = useState<'log' | 'tokens'>('log');

  return (
    <div>
      <div className="flex gap-4 mb-2">
        <button
          type="button"
          onClick={() => setActiveTab('log')}
          className={`text-xs font-semibold ${activeTab === 'log' ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Activity Log
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tokens')}
          className={`text-xs font-semibold ${activeTab === 'tokens' ? 'text-foreground' : 'text-muted-foreground'}`}
        >
          Tokens
        </button>
      </div>
      {activeTab === 'log' ? <RegistryActivityLog /> : <RegistryTokensList />}
    </div>
  );
}

function ColorManager() {
  // Main color management UI - shown after onboarding
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Color System</h1>
      <p className="text-muted-foreground">Your color system is configured. Color management UI coming soon.</p>
    </div>
  );
}

function StudioContent() {
  const { data: config, isLoading: configLoading } = useConfig();
  const configMutation = useConfigMutation();
  const primaryColorMutation = usePrimaryColorMutation();

  const handleColorSelect = useCallback(
    async (color: OKLCH, reason: string) => {
      // Write to registry, return full ColorValue from it
      const result = await primaryColorMutation.mutateAsync({ color, reason });
      console.log(`Primary color set: ${result.colorValue.name}`);
      return { colorValue: result.colorValue };
    },
    [primaryColorMutation],
  );

  const handleOnboardingComplete = useCallback(() => {
    // Mark as onboarded in config
    configMutation.mutate({ onboarded: true });
  }, [configMutation]);

  // Show loading while checking config
  if (configLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const isOnboarded = config?.onboarded === true;

  return (
    <>
      {isOnboarded ? (
        <ColorManager />
      ) : (
        <Snowstorm onColorSelect={handleColorSelect} onComplete={handleOnboardingComplete} />
      )}
      <div className="fixed bottom-0 left-0 right-0 max-h-64 overflow-auto bg-background/95 backdrop-blur border-t p-3 z-50">
        <div className="text-xs font-semibold mb-2">Registry Debug</div>
        <RegistryDebugPanel />
      </div>
    </>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudioContent />
    </QueryClientProvider>
  );
}
