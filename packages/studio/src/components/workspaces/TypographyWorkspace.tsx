/**
 * Typography Workspace
 *
 * Standard specimen sheet that every designer has seen for 40 years.
 * Derives from spacing by default. Override to own scale.
 * Only place new tokens created (font-display, font-sans, font-serif, font-mono).
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Token } from '../../api/token-loader';
import { fetchAllTokens, tokenKeys } from '../../lib/query';
import { EducationalHeader } from '../shared/EducationalHeader';

function parseFontSize(token: Token): number | null {
  const value = typeof token.value === 'string' ? token.value : String(token.value);
  const remMatch = value.match(/^([\d.]+)rem$/);
  if (remMatch) return Number.parseFloat(remMatch[1]) * 16;
  const pxMatch = value.match(/^([\d.]+)px$/);
  if (pxMatch) return Number.parseFloat(pxMatch[1]);
  return null;
}

const SPECIMEN_TEXT = 'The quick brown fox jumps over the lazy dog';
const PARAGRAPH_TEXT =
  'Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity.';

function TypeSample({ token, index }: { token: Token; index: number }) {
  const px = parseFontSize(token);
  if (px === null) return null;

  const heading = index < 6;

  return (
    <div className="group mb-6">
      <p
        style={{ fontSize: `${px}px`, lineHeight: 1.3 }}
        className={[
          heading ? 'font-semibold' : 'font-normal',
          'text-neutral-900 transition-colors group-hover:text-neutral-600',
        ].join(' ')}
      >
        {heading ? SPECIMEN_TEXT : PARAGRAPH_TEXT}
      </p>
    </div>
  );
}

export function TypographyWorkspace() {
  const { data } = useQuery({
    queryKey: tokenKeys.all,
    queryFn: fetchAllTokens,
  });

  const typographyTokens = useMemo(() => {
    const tokens = data?.tokens.typography || [];
    return tokens
      .filter((t) => t.name.includes('font-size') || t.name.includes('fontSize'))
      .filter((t) => parseFontSize(t) !== null)
      .sort((a, b) => (parseFontSize(b) ?? 0) - (parseFontSize(a) ?? 0));
  }, [data]);

  return (
    <div className="p-8">
      <EducationalHeader namespace="typography" title="Typographic Scale">
        <p className="mb-2">
          The type scale derives from the spacing ratio by default. This creates mathematical
          harmony between your text sizes and your spatial rhythm.
        </p>
        <p className="mb-2">
          You can override the type scale independently - this is the only place in Studio where new
          tokens are created (font-display, font-sans, font-serif, font-mono).
        </p>
        <p>Right-click any text sample to change the font family.</p>
      </EducationalHeader>

      {/* Specimen sheet */}
      <div className="mx-auto max-w-3xl">
        {typographyTokens.length > 0 ? (
          typographyTokens.map((token, i) => (
            <TypeSample key={token.name} token={token} index={i} />
          ))
        ) : (
          <>
            {/* Fallback specimen with default sizes */}
            <div className="space-y-4">
              <p className="text-5xl font-bold text-neutral-900">Display heading</p>
              <p className="text-4xl font-semibold text-neutral-900">Heading One</p>
              <p className="text-3xl font-semibold text-neutral-800">Heading Two</p>
              <p className="text-2xl font-semibold text-neutral-800">Heading Three</p>
              <p className="text-xl font-medium text-neutral-700">Heading Four</p>
              <p className="text-lg font-medium text-neutral-700">Heading Five</p>
              <p className="text-base text-neutral-600">{PARAGRAPH_TEXT}</p>
              <p className="text-sm text-neutral-500">
                Small text for captions, labels, and secondary information.
              </p>
              <p className="font-mono text-sm text-neutral-600">
                {'const design = { intent: "clarity", method: "mathematics" };'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
