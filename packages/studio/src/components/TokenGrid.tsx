/**
 * Token Grid Component
 *
 * Shows tokens as a grid of swatches for quick visual reference.
 */

import type { Token } from '../api/token-loader';
import { getTokenCssValue } from '../utils/token-display';

interface TokenGridProps {
  tokens: Token[];
  selectedToken: string | null;
  onTokenSelect: (tokenName: string) => void;
  onTokenHover: (tokenName: string | null) => void;
}

export function TokenGrid({ tokens, selectedToken, onTokenSelect, onTokenHover }: TokenGridProps) {
  // Group tokens by family (e.g., neutral, primary, etc.)
  const families = groupTokensByFamily(tokens);

  return (
    <div className="space-y-4">
      {Object.entries(families).map(([family, familyTokens]) => (
        <div key={family}>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
            {family}
          </h4>
          <div className="flex flex-wrap gap-1">
            {familyTokens.map((token) => (
              <TokenSwatch
                key={token.name}
                token={token}
                isSelected={selectedToken === token.name}
                onSelect={() => onTokenSelect(token.name)}
                onHover={(hovering) => onTokenHover(hovering ? token.name : null)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TokenSwatch({
  token,
  isSelected,
  onSelect,
  onHover,
}: {
  token: Token;
  isSelected: boolean;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}) {
  const cssValue = getTokenCssValue(token);

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`group relative h-8 w-8 rounded transition-transform hover:scale-110 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'ring-1 ring-neutral-200'
      }`}
      style={{ backgroundColor: cssValue }}
      title={token.name}
    >
      {/* Tooltip on hover */}
      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {token.name}
      </span>
    </button>
  );
}

/**
 * Group tokens by their family name (prefix before the number)
 * e.g., "neutral-500" → "neutral", "primary-500" → "primary"
 */
function groupTokensByFamily(tokens: Token[]): Record<string, Token[]> {
  const families: Record<string, Token[]> = {};

  for (const token of tokens) {
    // Extract family name: "neutral-500" → "neutral"
    const match = token.name.match(/^([a-z-]+?)[-_]?\d+$/i);
    const family = match ? match[1] : 'other';

    if (!families[family]) {
      families[family] = [];
    }
    families[family].push(token);
  }

  // Sort tokens within each family by their numeric suffix
  for (const family of Object.keys(families)) {
    families[family].sort((a, b) => {
      const numA = Number.parseInt(a.name.match(/\d+$/)?.[0] || '0', 10);
      const numB = Number.parseInt(b.name.match(/\d+$/)?.[0] || '0', 10);
      return numA - numB;
    });
  }

  return families;
}
