/**
 * Spacing Workspace
 *
 * Side-by-side spacing blocks with ratio combobox.
 * Visual, unlabeled blocks proportional to actual spacing values.
 * Entire UI changes when ratio changes (tokens ARE Tailwind).
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import type { Token } from '../../api/token-loader';
import { fetchAllTokens, tokenKeys } from '../../lib/query';
import { EducationalHeader } from '../shared/EducationalHeader';
import { RatioCombobox } from '../shared/RatioCombobox';

function parseSpacingValue(token: Token): number | null {
  const value = typeof token.value === 'string' ? token.value : String(token.value);
  const remMatch = value.match(/^([\d.]+)rem$/);
  if (remMatch) return Number.parseFloat(remMatch[1]) * 16;
  const pxMatch = value.match(/^([\d.]+)px$/);
  if (pxMatch) return Number.parseFloat(pxMatch[1]);
  return null;
}

function SpacingBlock({ token }: { token: Token }) {
  const px = parseSpacingValue(token);
  if (px === null) return null;

  const displayHeight = Math.max(4, Math.min(px, 200));

  return (
    <div className="group relative flex flex-col items-center">
      <div
        className="w-12 rounded-sm bg-neutral-900 transition-transform group-hover:scale-105"
        style={{ height: displayHeight }}
      />
      <span className="mt-1 text-xs text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
        {typeof token.value === 'string' ? token.value : `${px}px`}
      </span>
    </div>
  );
}

export function SpacingWorkspace() {
  const { data } = useQuery({
    queryKey: tokenKeys.all,
    queryFn: fetchAllTokens,
  });

  const [currentRatio, setCurrentRatio] = useState(1.2); // Minor third default

  const spacingTokens = useMemo(() => {
    const tokens = data?.tokens.spacing || [];
    return tokens
      .filter((t) => parseSpacingValue(t) !== null)
      .sort((a, b) => (parseSpacingValue(a) ?? 0) - (parseSpacingValue(b) ?? 0));
  }, [data]);

  return (
    <div className="p-8">
      <EducationalHeader namespace="spacing" title="Spacing Scale">
        <p className="mb-2">
          Spacing in Rafters follows a modular scale based on musical ratios. A base unit (4px) is
          multiplied by a ratio to create harmonious spacing values.
        </p>
        <p className="mb-2">
          The default ratio is a minor third (1.2) - the same interval that creates natural
          consonance in music. Choose a different ratio to change the feel of your entire spatial
          rhythm.
        </p>
        <p>
          Changing the ratio updates every spacing value in the system. Your UI reflects the change
          in real-time.
        </p>
      </EducationalHeader>

      <div className="mb-8">
        <RatioCombobox value={currentRatio} onChange={setCurrentRatio} />
      </div>

      {/* Side-by-side spacing blocks */}
      <div className="flex items-end gap-3">
        {spacingTokens.map((token) => (
          <SpacingBlock key={token.name} token={token} />
        ))}
      </div>

      {spacingTokens.length === 0 && (
        <p className="mt-4 text-sm text-neutral-400">No spacing tokens loaded.</p>
      )}
    </div>
  );
}
