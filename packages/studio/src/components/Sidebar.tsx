import type { Token } from '../api/token-loader';
import { NAMESPACES, type TokenNamespace } from '../types';
import { getTokenCssValue } from '../utils/token-display';

interface SidebarProps {
  selectedNamespace: TokenNamespace;
  onNamespaceChange: (ns: TokenNamespace) => void;
  selectedToken: string | null;
  onTokenSelect: (tokenId: string | null) => void;
  tokens: Record<string, Token[]>;
  availableNamespaces: string[];
  loading: boolean;
}

export function Sidebar({
  selectedNamespace,
  onNamespaceChange,
  selectedToken,
  onTokenSelect,
  tokens,
  availableNamespaces,
  loading,
}: SidebarProps) {
  // Filter namespaces to only show ones that have tokens
  const activeNamespaces = NAMESPACES.filter(
    (ns) => availableNamespaces.includes(ns.id) || tokens[ns.id]?.length > 0,
  );

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-neutral-200 bg-white">
      {/* Namespace tabs */}
      <nav className="flex flex-col gap-1 border-b border-neutral-200 p-2">
        {activeNamespaces.length === 0 && !loading && (
          <p className="px-3 py-2 text-sm text-neutral-500">No tokens loaded</p>
        )}
        {activeNamespaces.map((ns) => (
          <button
            key={ns.id}
            type="button"
            onClick={() => {
              onNamespaceChange(ns.id);
              onTokenSelect(null);
            }}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
              selectedNamespace === ns.id
                ? 'bg-neutral-100 font-medium text-neutral-900'
                : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
          >
            <NamespaceIcon name={ns.icon} />
            {ns.label}
            <span className="ml-auto text-xs text-neutral-400">{tokens[ns.id]?.length || 0}</span>
          </button>
        ))}
      </nav>

      {/* Token list */}
      <div className="flex-1 overflow-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
          </div>
        ) : (
          <TokenList
            tokens={tokens[selectedNamespace] || []}
            selectedToken={selectedToken}
            onSelect={onTokenSelect}
          />
        )}
      </div>
    </aside>
  );
}

function NamespaceIcon({ name }: { name: string }) {
  const iconClass = 'h-4 w-4';

  switch (name) {
    case 'palette':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="2" fill="currentColor" />
          <circle cx="8" cy="14" r="2" fill="currentColor" />
          <circle cx="16" cy="14" r="2" fill="currentColor" />
        </svg>
      );
    case 'ruler':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M2 12h20M6 8v8M10 10v4M14 10v4M18 8v8" />
        </svg>
      );
    case 'type':
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      );
    default:
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      );
  }
}

function TokenList({
  tokens,
  selectedToken,
  onSelect,
}: {
  tokens: Token[];
  selectedToken: string | null;
  onSelect: (id: string | null) => void;
}) {
  if (tokens.length === 0) {
    return (
      <p className="px-2 py-4 text-center text-sm text-neutral-500">No tokens in this namespace</p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
        Tokens ({tokens.length})
      </p>
      {tokens.map((token) => (
        <button
          key={token.name}
          type="button"
          onClick={() => onSelect(token.name)}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
            selectedToken === token.name
              ? 'bg-blue-50 font-medium text-blue-700'
              : 'text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          {/* Color swatch for color tokens */}
          {token.category === 'color' && (
            <div
              className="h-4 w-4 shrink-0 rounded border border-neutral-200"
              style={{ backgroundColor: getTokenCssValue(token) }}
            />
          )}
          <span className="truncate">{token.name}</span>
        </button>
      ))}
    </div>
  );
}
