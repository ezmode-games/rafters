import { useState } from 'react';
import type { Token } from '../api/token-loader';
import { useToken } from '../hooks/useTokens';
import type { TokenNamespace } from '../types';
import type { OKLCH } from '../utils/color-conversion';
import { getTokenDisplayValue } from '../utils/token-display';
import { Preview } from './Preview';
import { SpectrumPicker } from './SpectrumPicker';
import { TokenGrid } from './TokenGrid';

interface TokenEditorProps {
  namespace: TokenNamespace;
  tokenId: string | null;
  tokens: Record<string, Token[]>;
  onTokenSelect: (tokenId: string | null) => void;
}

export function TokenEditor({ namespace, tokenId, tokens, onTokenSelect }: TokenEditorProps) {
  const token = useToken(tokens, tokenId);
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);
  const [pendingColor, setPendingColor] = useState<OKLCH | null>(null);
  const colorTokens = tokens.color || [];

  // Handle color change from picker (will be saved in #568)
  const handleColorChange = (oklch: OKLCH) => {
    setPendingColor(oklch);
    // TODO: #568 will add save with reason functionality
  };

  // Show preview for color namespace
  if (namespace === 'color') {
    return (
      <div className="flex gap-6">
        {/* Left: Token Grid + Editor */}
        <div className="w-[400px] shrink-0 space-y-6">
          {/* Token Grid */}
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="mb-3 text-sm font-medium text-neutral-500">Color Tokens</h3>
            <TokenGrid
              tokens={colorTokens}
              selectedToken={tokenId}
              onTokenSelect={onTokenSelect}
              onTokenHover={setHoveredToken}
            />
          </div>

          {/* Selected Token Details with Color Picker */}
          {token && (
            <TokenDetails
              token={token}
              namespace={namespace}
              onColorChange={handleColorChange}
              pendingColor={pendingColor}
            />
          )}
        </div>

        {/* Right: Live Preview */}
        <div className="flex-1">
          <Preview tokens={tokens} highlightedToken={hoveredToken || tokenId} />
        </div>
      </div>
    );
  }

  // Non-color namespaces: show simple editor
  if (!tokenId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-neutral-600">Select a token to edit</p>
          <p className="mt-1 text-sm text-neutral-500">
            Choose from the {namespace} tokens in the sidebar
          </p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-neutral-600">Token not found</p>
          <p className="mt-1 text-sm text-neutral-500">
            The token &quot;{tokenId}&quot; could not be found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <TokenDetails token={token} namespace={namespace} />
    </div>
  );
}

function TokenDetails({
  token,
  namespace,
  onColorChange,
  pendingColor,
}: {
  token: Token;
  namespace: TokenNamespace;
  onColorChange?: (oklch: OKLCH) => void;
  pendingColor?: OKLCH | null;
}) {
  const displayValue = getTokenDisplayValue(token);

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-neutral-900">{token.name}</h2>
      <p className="mt-1 text-sm text-neutral-500">
        {token.description || `Editing ${namespace} token`}
      </p>

      {/* Token metadata */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
          {token.category}
        </span>
        {token.semanticMeaning && (
          <span className="rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
            {token.semanticMeaning}
          </span>
        )}
      </div>

      {/* Color picker */}
      {namespace === 'color' && onColorChange && (
        <div className="mt-6">
          <SpectrumPicker token={token} onColorChange={onColorChange} />
          {pendingColor && (
            <p className="mt-3 text-center text-xs text-amber-600">
              Color selected. Save functionality coming in #568.
            </p>
          )}
        </div>
      )}

      {/* Non-color value */}
      {namespace !== 'color' && (
        <div className="mt-6">
          <div className="rounded-md bg-neutral-50 p-4">
            <p className="font-mono text-sm text-neutral-700">{displayValue}</p>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Editor for {namespace} tokens will be implemented in issue #569
          </p>
        </div>
      )}

      {/* Usage context */}
      {token.usageContext && token.usageContext.length > 0 && (
        <div className="mt-6 border-t border-neutral-200 pt-6">
          <h3 className="text-sm font-medium text-neutral-700">Usage Context</h3>
          <div className="mt-2 flex flex-wrap gap-1">
            {token.usageContext.map((ctx) => (
              <span
                key={ctx}
                className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
              >
                {ctx}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reason input placeholder */}
      <div className="mt-8 border-t border-neutral-200 pt-6">
        <label htmlFor="change-reason" className="block text-sm font-medium text-neutral-700">
          Why are you making this change?
        </label>
        <textarea
          id="change-reason"
          className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          rows={3}
          placeholder="Describe the design intent..."
          disabled
        />
        <p className="mt-2 text-xs text-neutral-500">
          Save with reason will be implemented in issue #568
        </p>
      </div>
    </div>
  );
}
