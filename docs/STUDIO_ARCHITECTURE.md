# Studio Architecture

**Purpose:** Define the browser-based design token editor that runs locally via CLI or hosted in Rafters+.

---

## Overview

Studio is a React application for visually editing design tokens. It follows the "Think Apple" principle: **designers never see JSON, config files, or technical details**.

### Environments

| Environment | How it runs | Persistence |
|-------------|-------------|-------------|
| **Local** | `rafters studio` launches Node server + opens browser | Node server reads/writes `.rafters/` |
| **Rafters+** | Hosted at `studio.rafters.dev` | API stores in D1 database |

Same React components, different API endpoints.

---

## Package Structure

```
packages/studio/
  src/
    main.tsx                    # Entry point
    App.tsx                     # Root component

    # State Management
    store/
      index.ts
      registry-store.ts         # zustand store for token state
      ui-store.ts               # UI state (selection, panels)

    # API Layer
    api/
      index.ts
      tokens.ts                 # Token CRUD operations
      config.ts                 # System config operations
      color.ts                  # Color intelligence fetch
      client.ts                 # TanStack Query setup

    # Components
    components/
      layout/
        Sidebar.tsx             # Namespace navigation
        Header.tsx              # App header + actions
        Panel.tsx               # Token detail panel
      tokens/
        TokenList.tsx           # Token list for namespace
        TokenCard.tsx           # Individual token card
        TokenEditor.tsx         # Edit token values
      color/
        ColorPicker.tsx         # OKLCH color picker
        ColorScale.tsx          # 11-position scale preview
        ColorIntelligence.tsx   # AI intelligence display
        HarmonyPreview.tsx      # Complementary, triadic, etc.
      semantic/
        SemanticMapper.tsx      # Assign semantics to colors
        StatePreview.tsx        # Hover, active, focus states
      spacing/
        SpacingScale.tsx        # Visual spacing preview
        SpacingEditor.tsx       # Edit base unit + ratio
      typography/
        TypeScale.tsx           # Font size preview
        FontPicker.tsx          # Font family selector
      preview/
        ComponentPreview.tsx    # Live component preview
        ThemePreview.tsx        # Full theme preview

    # Hooks
    hooks/
      useTokens.ts              # TanStack Query hooks for tokens
      useConfig.ts              # Config query hooks
      useColorIntelligence.ts   # Color API with background refresh
      useSSE.ts                 # Server-sent events subscription

    # Utils
    utils/
      oklch.ts                  # Color conversion utilities
      format.ts                 # Value formatting

  index.html
  vite.config.ts
  tailwind.config.ts
```

---

## State Management

### Registry Store (zustand)

```typescript
// store/registry-store.ts

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Token } from '@rafters/shared';

interface RegistryState {
  // Token state (mirrored from server)
  tokens: Map<string, Token>;
  namespaces: string[];

  // Selection state
  selectedNamespace: string | null;
  selectedToken: string | null;

  // Loading state
  isLoading: boolean;
  isSaving: boolean;

  // Actions
  setTokens(tokens: Token[]): void;
  setNamespaces(namespaces: string[]): void;
  selectNamespace(namespace: string | null): void;
  selectToken(tokenName: string | null): void;
  updateToken(name: string, updates: Partial<Token>): void;

  // Computed
  getTokensByNamespace(namespace: string): Token[];
  getToken(name: string): Token | undefined;
}

export const useRegistryStore = create<RegistryState>()(
  subscribeWithSelector((set, get) => ({
    tokens: new Map(),
    namespaces: [],
    selectedNamespace: null,
    selectedToken: null,
    isLoading: false,
    isSaving: false,

    setTokens(tokens) {
      const map = new Map<string, Token>();
      for (const token of tokens) {
        map.set(token.name, token);
      }
      set({ tokens: map });
    },

    setNamespaces(namespaces) {
      set({ namespaces });
    },

    selectNamespace(namespace) {
      set({ selectedNamespace: namespace, selectedToken: null });
    },

    selectToken(tokenName) {
      set({ selectedToken: tokenName });
    },

    updateToken(name, updates) {
      const { tokens } = get();
      const existing = tokens.get(name);
      if (existing) {
        tokens.set(name, { ...existing, ...updates });
        set({ tokens: new Map(tokens) });
      }
    },

    getTokensByNamespace(namespace) {
      const { tokens } = get();
      return Array.from(tokens.values()).filter(t => t.namespace === namespace);
    },

    getToken(name) {
      return get().tokens.get(name);
    },
  }))
);
```

### UI Store

```typescript
// store/ui-store.ts

import { create } from 'zustand';

interface UIState {
  // Panel visibility
  sidebarOpen: boolean;
  detailPanelOpen: boolean;
  previewPanelOpen: boolean;

  // View mode
  viewMode: 'grid' | 'list';

  // Actions
  toggleSidebar(): void;
  toggleDetailPanel(): void;
  togglePreviewPanel(): void;
  setViewMode(mode: 'grid' | 'list'): void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  detailPanelOpen: true,
  previewPanelOpen: false,
  viewMode: 'grid',

  toggleSidebar() {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  toggleDetailPanel() {
    set((state) => ({ detailPanelOpen: !state.detailPanelOpen }));
  },

  togglePreviewPanel() {
    set((state) => ({ previewPanelOpen: !state.previewPanelOpen }));
  },

  setViewMode(mode) {
    set({ viewMode: mode });
  },
}));
```

---

## API Layer (TanStack Query)

### Query Client Setup

```typescript
// api/client.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: true,
    },
  },
});

// API base URL (local dev server or hosted)
export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3456';
```

### Token Queries

```typescript
// api/tokens.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE } from './client';
import type { Token } from '@rafters/shared';

// Fetch all tokens
export function useTokens() {
  return useQuery({
    queryKey: ['tokens'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/tokens`);
      const data = await response.json();
      return data as { tokens: Token[]; namespaces: string[] };
    },
  });
}

// Fetch tokens by namespace
export function useNamespaceTokens(namespace: string) {
  return useQuery({
    queryKey: ['tokens', namespace],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/tokens/${namespace}`);
      const data = await response.json();
      return data as { namespace: string; tokens: Token[] };
    },
    enabled: !!namespace,
  });
}

// Update single token
export function useUpdateToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespace,
      tokenName,
      updates,
    }: {
      namespace: string;
      tokenName: string;
      updates: Partial<Token>;
    }) => {
      const response = await fetch(
        `${API_BASE}/api/tokens/${namespace}/${tokenName}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      );
      return response.json();
    },
    onSuccess: (_, { namespace }) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      queryClient.invalidateQueries({ queryKey: ['tokens', namespace] });
    },
  });
}

// Replace entire namespace
export function useReplaceNamespace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      namespace,
      tokens,
    }: {
      namespace: string;
      tokens: Token[];
    }) => {
      const response = await fetch(`${API_BASE}/api/tokens/${namespace}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens }),
      });
      return response.json();
    },
    onSuccess: (_, { namespace }) => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      queryClient.invalidateQueries({ queryKey: ['tokens', namespace] });
    },
  });
}
```

### Color Intelligence Query

```typescript
// api/color.ts

import { useQuery } from '@tanstack/react-query';
import { API_BASE } from './client';
import type { ColorValue } from '@rafters/shared';

interface ColorIntelligenceParams {
  l: number;
  c: number;
  h: number;
}

export function useColorIntelligence(params: ColorIntelligenceParams | null) {
  return useQuery({
    queryKey: ['color-intelligence', params],
    queryFn: async () => {
      if (!params) return null;

      const response = await fetch(
        `${API_BASE}/api/color/intelligence?l=${params.l}&c=${params.c}&h=${params.h}`
      );
      const data = await response.json();
      return data as { color: ColorValue; status: string };
    },
    enabled: !!params,
    staleTime: 1000 * 60 * 60, // 1 hour (color intelligence doesn't change)
  });
}
```

### SSE Subscription Hook

```typescript
// hooks/useSSE.ts

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE } from '../api/client';

export function useSSE() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/api/events`);

    eventSource.addEventListener('namespace-changed', (event) => {
      const { namespace } = JSON.parse(event.data);
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      queryClient.invalidateQueries({ queryKey: ['tokens', namespace] });
    });

    eventSource.addEventListener('token-changed', (event) => {
      const { namespace, tokenName } = JSON.parse(event.data);
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      queryClient.invalidateQueries({ queryKey: ['tokens', namespace] });
    });

    eventSource.addEventListener('config-changed', () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    });

    return () => {
      eventSource.close();
    };
  }, [queryClient]);
}
```

---

## Key Components

### Color Picker

```typescript
// components/color/ColorPicker.tsx

import { useState, useEffect } from 'react';
import { useColorIntelligence } from '../../api/color';
import type { OKLCH } from '@rafters/shared';

interface ColorPickerProps {
  value: OKLCH;
  onChange: (oklch: OKLCH) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounced API call for intelligence
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(localValue);
    }, 300);
    return () => clearTimeout(timeout);
  }, [localValue]);

  // Fetch intelligence (TanStack Query handles caching + background refresh)
  const { data: intelligence, isLoading } = useColorIntelligence(debouncedValue);

  const handleChange = (updates: Partial<OKLCH>) => {
    const newValue = { ...localValue, ...updates };
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="color-picker">
      {/* Lightness slider */}
      <label>
        Lightness
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={localValue.l}
          onChange={(e) => handleChange({ l: parseFloat(e.target.value) })}
        />
        <span>{localValue.l.toFixed(2)}</span>
      </label>

      {/* Chroma slider */}
      <label>
        Chroma
        <input
          type="range"
          min={0}
          max={0.4}
          step={0.01}
          value={localValue.c}
          onChange={(e) => handleChange({ c: parseFloat(e.target.value) })}
        />
        <span>{localValue.c.toFixed(2)}</span>
      </label>

      {/* Hue slider */}
      <label>
        Hue
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={localValue.h}
          onChange={(e) => handleChange({ h: parseFloat(e.target.value) })}
        />
        <span>{localValue.h.toFixed(0)}°</span>
      </label>

      {/* Color preview */}
      <div
        className="color-preview"
        style={{
          backgroundColor: `oklch(${localValue.l} ${localValue.c} ${localValue.h})`,
        }}
      />

      {/* Intelligence display */}
      {isLoading && <div className="loading">Loading intelligence...</div>}
      {intelligence && (
        <ColorIntelligence intelligence={intelligence.color.intelligence} />
      )}
    </div>
  );
}
```

### Color Intelligence Display

```typescript
// components/color/ColorIntelligence.tsx

import type { ColorIntelligence as ColorIntelligenceType } from '@rafters/shared';

interface Props {
  intelligence: ColorIntelligenceType;
}

export function ColorIntelligence({ intelligence }: Props) {
  return (
    <div className="color-intelligence">
      <section>
        <h4>Name</h4>
        <p className="font-semibold">{intelligence.name}</p>
      </section>

      <section>
        <h4>Reasoning</h4>
        <p>{intelligence.reasoning}</p>
      </section>

      <section>
        <h4>Emotional Impact</h4>
        <p>{intelligence.emotionalImpact}</p>
      </section>

      <section>
        <h4>Cultural Context</h4>
        <p>{intelligence.culturalContext}</p>
      </section>

      <section>
        <h4>Accessibility</h4>
        <p>{intelligence.accessibilityNotes}</p>
      </section>

      <section>
        <h4>Usage Guidance</h4>
        <p>{intelligence.usageGuidance}</p>
      </section>
    </div>
  );
}
```

### Color Scale Preview

```typescript
// components/color/ColorScale.tsx

import type { OKLCH } from '@rafters/shared';

const SCALE_POSITIONS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

interface Props {
  scale: OKLCH[];
  selectedPosition?: number;
  onSelectPosition?: (position: number) => void;
}

export function ColorScale({ scale, selectedPosition, onSelectPosition }: Props) {
  return (
    <div className="color-scale">
      {scale.map((oklch, index) => (
        <button
          key={SCALE_POSITIONS[index]}
          className={`scale-swatch ${selectedPosition === index ? 'selected' : ''}`}
          style={{
            backgroundColor: `oklch(${oklch.l} ${oklch.c} ${oklch.h})`,
          }}
          onClick={() => onSelectPosition?.(index)}
          title={`${SCALE_POSITIONS[index]}: L=${oklch.l.toFixed(2)} C=${oklch.c.toFixed(2)} H=${oklch.h.toFixed(0)}`}
        >
          <span className="scale-label">{SCALE_POSITIONS[index]}</span>
        </button>
      ))}
    </div>
  );
}
```

### Semantic Mapper

```typescript
// components/semantic/SemanticMapper.tsx

import { useTokens, useReplaceNamespace } from '../../api/tokens';
import type { Token } from '@rafters/shared';

const SEMANTIC_INTENTS = [
  { name: 'primary', description: 'Primary actions, main CTA' },
  { name: 'secondary', description: 'Secondary/supporting actions' },
  { name: 'destructive', description: 'Errors, delete, danger' },
  { name: 'success', description: 'Confirmations, valid' },
  { name: 'warning', description: 'Alerts, caution' },
  { name: 'info', description: 'Informational, tips' },
  { name: 'background', description: 'Page background' },
  { name: 'foreground', description: 'Default text' },
  { name: 'muted', description: 'Subtle, de-emphasized' },
  { name: 'accent', description: 'Decorative emphasis' },
];

export function SemanticMapper() {
  const { data } = useTokens();
  const replaceNamespace = useReplaceNamespace();

  // Get color families
  const colorFamilies = data?.tokens
    .filter(t => t.namespace === 'color' && !t.name.includes('-'))
    .map(t => t.name) ?? [];

  const handleAssign = (semantic: string, colorFamily: string, position: string) => {
    // Update semantic token to reference color
    const semanticTokens = data?.tokens.filter(t => t.namespace === 'semantic') ?? [];

    const updatedTokens = semanticTokens.map(t => {
      if (t.name === semantic) {
        return {
          ...t,
          value: `var(--color-${colorFamily}-${position})`,
          dependsOn: [`${colorFamily}-${position}`],
        };
      }
      return t;
    });

    replaceNamespace.mutate({ namespace: 'semantic', tokens: updatedTokens });
  };

  return (
    <div className="semantic-mapper">
      {SEMANTIC_INTENTS.map(({ name, description }) => (
        <div key={name} className="semantic-row">
          <div className="semantic-info">
            <span className="semantic-name">{name}</span>
            <span className="semantic-description">{description}</span>
          </div>

          <select
            onChange={(e) => {
              const [family, position] = e.target.value.split(':');
              handleAssign(name, family, position);
            }}
          >
            <option value="">Select color...</option>
            {colorFamilies.map(family => (
              <optgroup key={family} label={family}>
                {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'].map(pos => (
                  <option key={`${family}:${pos}`} value={`${family}:${pos}`}>
                    {family}-{pos}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
```

---

## App Structure

```typescript
// App.tsx

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/client';
import { useSSE } from './hooks/useSSE';
import { useTokens } from './api/tokens';
import { useRegistryStore } from './store/registry-store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { TokenList } from './components/tokens/TokenList';
import { Panel } from './components/layout/Panel';

function AppContent() {
  // Subscribe to SSE for real-time updates
  useSSE();

  // Load initial tokens
  const { data, isLoading } = useTokens();
  const setTokens = useRegistryStore(state => state.setTokens);
  const setNamespaces = useRegistryStore(state => state.setNamespaces);
  const selectedNamespace = useRegistryStore(state => state.selectedNamespace);

  // Sync to store when data changes
  useEffect(() => {
    if (data) {
      setTokens(data.tokens);
      setNamespaces(data.namespaces);
    }
  }, [data, setTokens, setNamespaces]);

  if (isLoading) {
    return <div className="loading">Loading tokens...</div>;
  }

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className="main-content">
          {selectedNamespace ? (
            <TokenList namespace={selectedNamespace} />
          ) : (
            <div className="empty-state">Select a namespace</div>
          )}
        </main>
        <Panel />
      </div>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
```

---

## Build Configuration

### Vite Config

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Output will be bundled into CLI package
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3456',
        changeOrigin: true,
      },
    },
  },
});
```

### Tailwind Config

```typescript
// tailwind.config.ts

import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
```

---

## Dependencies

```json
{
  "dependencies": {
    "@rafters/shared": "workspace:*",
    "@tanstack/react-query": "^5.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## Key Features

1. **Real-time updates** - SSE subscription auto-refreshes when tokens change
2. **Background intelligence fetch** - TanStack Query handles caching and refetch
3. **Optimistic updates** - UI updates immediately, server sync follows
4. **Namespace isolation** - Load only what's needed
5. **Apple-like simplicity** - Designers see colors and controls, not JSON
