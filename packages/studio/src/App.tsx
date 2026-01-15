import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TokenEditor } from './components/TokenEditor';
import { useTokens } from './hooks/useTokens';
import type { TokenNamespace } from './types';

export function App() {
  const [selectedNamespace, setSelectedNamespace] = useState<TokenNamespace>('color');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const { namespaces, tokens, loading, error, refetch } = useTokens();

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedNamespace={selectedNamespace}
          onNamespaceChange={setSelectedNamespace}
          selectedToken={selectedToken}
          onTokenSelect={setSelectedToken}
          tokens={tokens}
          availableNamespaces={namespaces}
          loading={loading}
        />
        <main className="flex-1 overflow-auto bg-neutral-50 p-6">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="font-medium">Failed to load tokens</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          )}
          <TokenEditor
            namespace={selectedNamespace}
            tokenId={selectedToken}
            tokens={tokens}
            onTokenSelect={setSelectedToken}
          />
        </main>
      </div>
    </div>
  );
}
