import { useState } from 'react';
import type { Token } from '../api/token-loader';
import { useTokenSave } from '../hooks/useTokenSave';
import { useToken } from '../hooks/useTokens';
import type { TokenNamespace } from '../types';
import type { OKLCH } from '../utils/color-conversion';
import { oklchToCSS, roundOKLCH } from '../utils/color-conversion';
import { getTokenDisplayValue } from '../utils/token-display';
import { Preview } from './Preview';
import { SpectrumPicker } from './SpectrumPicker';
import { TokenGrid } from './TokenGrid';

interface TokenEditorProps {
  namespace: TokenNamespace;
  tokenId: string | null;
  tokens: Record<string, Token[]>;
  onTokenSelect: (tokenId: string | null) => void;
  onTokenSaved?: () => void;
}

export function TokenEditor({
  namespace,
  tokenId,
  tokens,
  onTokenSelect,
  onTokenSaved,
}: TokenEditorProps) {
  const token = useToken(tokens, tokenId);
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);
  const [pendingColor, setPendingColor] = useState<OKLCH | null>(null);
  const colorTokens = tokens.color || [];

  // Handle color change from picker
  const handleColorChange = (oklch: OKLCH) => {
    setPendingColor(oklch);
  };

  // Clear pending color after successful save
  const handleSaved = () => {
    setPendingColor(null);
    onTokenSaved?.();
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
              onSaved={handleSaved}
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
  onSaved,
}: {
  token: Token;
  namespace: TokenNamespace;
  onColorChange?: (oklch: OKLCH) => void;
  pendingColor?: OKLCH | null;
  onSaved?: () => void;
}) {
  const displayValue = getTokenDisplayValue(token);
  const [reason, setReason] = useState('');
  const { saveToken, state } = useTokenSave();

  // Has pending changes (color selected)
  const hasPendingChanges = namespace === 'color' && pendingColor !== null;

  // Handle save
  const handleSave = async () => {
    if (!hasPendingChanges || !pendingColor) return;

    // Convert OKLCH to storable format
    const rounded = roundOKLCH(pendingColor);
    const colorValue = {
      oklch: rounded,
      css: oklchToCSS(rounded),
    };

    const result = await saveToken(namespace, token.name, colorValue, reason);
    if (result) {
      setReason('');
      onSaved?.();
    }
  };

  // Check if save is allowed
  const canSave = hasPendingChanges && reason.trim().length > 0 && !state.saving;

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
        {token.userOverride && (
          <span className="rounded bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
            User Override
          </span>
        )}
      </div>

      {/* Previous override reason */}
      {token.userOverride && (
        <div className="mt-4 rounded-md bg-amber-50 p-3">
          <p className="text-xs font-medium text-amber-800">Previous change reason:</p>
          <p className="mt-1 text-sm text-amber-700">{token.userOverride.reason}</p>
        </div>
      )}

      {/* Color picker */}
      {namespace === 'color' && onColorChange && (
        <div className="mt-6">
          <SpectrumPicker token={token} onColorChange={onColorChange} />
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

      {/* Save with reason - only show when there are pending changes */}
      {hasPendingChanges && (
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <label htmlFor="change-reason" className="block text-sm font-medium text-neutral-700">
            Why are you making this change?
          </label>
          <textarea
            id="change-reason"
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            rows={3}
            placeholder="Describe the design intent (required for AI context)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={state.saving}
          />
          <p className="mt-2 text-xs text-neutral-500">
            AI agents use this to understand your design decisions.
          </p>

          {/* Error message */}
          {state.error && (
            <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{state.error}</div>
          )}

          {/* Success message */}
          {state.success && (
            <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-700">
              Token saved successfully!
            </div>
          )}

          {/* Save button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              canSave
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'cursor-not-allowed bg-neutral-200 text-neutral-500'
            }`}
          >
            {state.saving ? 'Saving...' : 'Save Change'}
          </button>
        </div>
      )}
    </div>
  );
}
