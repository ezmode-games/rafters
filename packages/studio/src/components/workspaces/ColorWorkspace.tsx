/**
 * Color Workspace
 *
 * Post-first-run color editing. Shows all semantic colors with their scales.
 * Educational header explains OKLCH color space.
 * Right-click any swatch to adjust L/C/H.
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { Token } from '../../api/token-loader';
import { fetchAllTokens, tokenKeys, useTokenMutation } from '../../lib/query';
import type { OKLCH } from '../../utils/color-conversion';
import { getTokenCssValue } from '../../utils/token-display';
import { ColorContextMenu } from '../context-menus/ColorContextMenu';
import { useContextMenu } from '../context-menus/ContextMenu';
import { EducationalHeader } from '../shared/EducationalHeader';

function isColorToken(token: Token): boolean {
  return typeof token.value === 'string'
    ? token.value.startsWith('oklch(') || token.value.startsWith('#')
    : typeof token.value === 'object' && token.value !== null && 'scale' in token.value;
}

function parseOKLCH(token: Token): OKLCH | null {
  if (typeof token.value !== 'string') return null;
  const match = token.value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (!match) return null;
  return {
    l: Number.parseFloat(match[1]),
    c: Number.parseFloat(match[2]),
    h: Number.parseFloat(match[3]),
  };
}

function ColorSwatch({
  token,
  onContextMenu,
}: {
  token: Token;
  onContextMenu: (e: React.MouseEvent, token: Token) => void;
}) {
  const cssValue = getTokenCssValue(token);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: native contextmenu for right-click color editing
    <div className="group relative" onContextMenu={(e) => onContextMenu(e, token)}>
      <div
        className="rounded-xl transition-transform group-hover:scale-105"
        style={{
          width: 64,
          height: 64,
          backgroundColor: cssValue,
        }}
      />
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
        {token.name.replace('color-', '').replace('semantic-', '')}
      </span>
    </div>
  );
}

function ColorFamily({
  tokens,
  onContextMenu,
}: {
  family: string;
  tokens: Token[];
  onContextMenu: (e: React.MouseEvent, token: Token) => void;
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {tokens.map((token) => (
          <ColorSwatch key={token.name} token={token} onContextMenu={onContextMenu} />
        ))}
      </div>
    </div>
  );
}

export function ColorWorkspace() {
  const { data } = useQuery({
    queryKey: tokenKeys.all,
    queryFn: fetchAllTokens,
  });

  const { position, onClose } = useContextMenu();
  const [menuTarget, setMenuTarget] = useState<Token | null>(null);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const tokenMutation = useTokenMutation();

  const handleSwatchContextMenu = useCallback((e: React.MouseEvent, token: Token) => {
    e.preventDefault();
    setMenuTarget(token);
    setMenuPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleClose = useCallback(() => {
    setMenuTarget(null);
    setMenuPos(null);
    onClose();
  }, [onClose]);

  const handleCommit = useCallback(
    (color: OKLCH, reason: string) => {
      if (!menuTarget) return;
      const oklchValue = `oklch(${color.l} ${color.c} ${color.h})`;
      tokenMutation.mutate({
        namespace: menuTarget.namespace,
        name: menuTarget.name,
        value: oklchValue,
        reason,
      });
      handleClose();
    },
    [menuTarget, tokenMutation, handleClose],
  );

  const colorTokens = (data?.tokens.color || []).filter(isColorToken);
  const semanticTokens = (data?.tokens.semantic || []).filter(isColorToken);

  // Group color tokens by family (primary, neutral, etc.)
  const families = new Map<string, Token[]>();
  for (const token of colorTokens) {
    const parts = token.name.split('-');
    const family = parts[1] || parts[0];
    if (!families.has(family)) families.set(family, []);
    families.get(family)?.push(token);
  }

  const menuColor = menuTarget ? parseOKLCH(menuTarget) : null;

  return (
    <div className="p-8">
      <EducationalHeader namespace="color" title="Color System">
        <p className="mb-2">
          Rafters uses the OKLCH color space - a perceptually uniform space where equal steps in
          lightness look equally different to the human eye.
        </p>
        <p className="mb-2">
          Your primary color generates a complete scale (50-950) using mathematical lightness
          curves. Semantic colors are derived from harmonic relationships with your primary.
        </p>
        <p>
          Every color has a recorded reason. The system preserves your decisions and recomputes
          everything else.
        </p>
      </EducationalHeader>

      {/* Semantic colors */}
      {semanticTokens.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-wrap gap-3">
            {semanticTokens.map((token) => (
              <ColorSwatch key={token.name} token={token} onContextMenu={handleSwatchContextMenu} />
            ))}
          </div>
        </div>
      )}

      {/* Color families */}
      {Array.from(families.entries()).map(([family, tokens]) => (
        <ColorFamily
          key={family}
          family={family}
          tokens={tokens}
          onContextMenu={handleSwatchContextMenu}
        />
      ))}

      {colorTokens.length === 0 && semanticTokens.length === 0 && (
        <p className="text-sm text-neutral-400">No color tokens loaded.</p>
      )}

      {/* Context menu */}
      {menuTarget && menuColor && (
        <ColorContextMenu
          position={menuPos ?? position}
          onClose={handleClose}
          color={menuColor}
          tokenName={menuTarget.name}
          onCommit={handleCommit}
        />
      )}
    </div>
  );
}
