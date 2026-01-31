/**
 * SemanticChoice - Single Semantic Color Choice Component
 *
 * Presents 3 computed options for a semantic color (secondary, danger, etc.)
 * User clicks swatch, provides reason via WhyGate, or chooses custom.
 */

import { oklchToHex } from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import { Button } from '@rafters/ui/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@rafters/ui/components/ui/card';
import { Muted } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import { useCallback, useState } from 'react';
import { WhyGate } from '../shared/WhyGate';

export interface SemanticChoiceProps {
  /** Semantic name: "secondary", "danger", etc. */
  name: string;
  /** Display label for the semantic */
  label: string;
  /** 3 computed color choices */
  options: OKLCH[];
  /** Called when user selects a color with reason */
  onSelect: (color: OKLCH, reason: string) => void;
  /** Called when user wants custom color (passes click event for positioning) */
  onCustom: (event: React.MouseEvent) => void;
  /** Example reasons for WhyGate placeholder cycling */
  placeholders?: string[];
}

/** Default placeholder reasons for semantic colors */
const defaultPlaceholders = [
  'maintains visual hierarchy',
  'provides sufficient contrast',
  'aligns with brand guidelines',
  'communicates the right emotion',
  'tested well with users',
];

export function SemanticChoice({
  name,
  label,
  options,
  onSelect,
  onCustom,
  placeholders = defaultPlaceholders,
}: SemanticChoiceProps) {
  const [selectedColor, setSelectedColor] = useState<OKLCH | null>(null);
  const [showWhyGate, setShowWhyGate] = useState(false);

  const handleSwatchClick = useCallback((color: OKLCH) => {
    setSelectedColor(color);
    setShowWhyGate(true);
  }, []);

  const handleWhySubmit = useCallback(
    (reason: string) => {
      if (selectedColor) {
        onSelect(selectedColor, reason);
      }
      setShowWhyGate(false);
      setSelectedColor(null);
    },
    [selectedColor, onSelect],
  );

  const handleWhyCancel = useCallback(() => {
    setShowWhyGate(false);
    setSelectedColor(null);
  }, []);

  if (showWhyGate && selectedColor) {
    const hexColor = oklchToHex(selectedColor);
    return (
      <WhyGate
        title={`Why this ${label.toLowerCase()}?`}
        placeholders={placeholders}
        submitLabel="Confirm Choice"
        onSubmit={handleWhySubmit}
        onCancel={handleWhyCancel}
      >
        <div className={classy('mb-4', 'flex', 'items-center', 'gap-3')}>
          <div
            className={classy('h-12', 'w-12', 'rounded-lg', 'shadow-md', 'border', 'border-border')}
            style={{ backgroundColor: hexColor }}
            role="img"
            aria-label={`Selected ${label}: ${hexColor}`}
          />
          <div>
            <Muted className={classy('text-sm', 'font-mono')}>{hexColor}</Muted>
            <Muted className={classy('text-xs')}>
              oklch({selectedColor.l.toFixed(2)} {selectedColor.c.toFixed(2)}{' '}
              {selectedColor.h.toFixed(0)})
            </Muted>
          </div>
        </div>
      </WhyGate>
    );
  }

  return (
    <Card className={classy('w-full')}>
      <CardHeader className={classy('pb-2')}>
        <CardTitle className={classy('text-lg')}>{label}</CardTitle>
        <Muted className={classy('text-xs')}>{name}</Muted>
      </CardHeader>
      <CardContent>
        <div className={classy('flex', 'items-center', 'gap-3', 'mb-3')}>
          {options.map((color, index) => {
            const hex = oklchToHex(color);
            return (
              <button
                key={`${name}-option-${index}`}
                type="button"
                onClick={() => handleSwatchClick(color)}
                className={classy(
                  'h-14',
                  'w-14',
                  'rounded-lg',
                  'shadow-md',
                  'border-2',
                  'border-transparent',
                  'transition-all',
                  'hover:scale-110',
                  'hover:border-primary',
                  'focus:outline-none',
                  'focus:ring-2',
                  'focus:ring-primary',
                  'focus:ring-offset-2',
                )}
                style={{ backgroundColor: hex }}
                aria-label={`${label} option ${index + 1}: ${hex}`}
              />
            );
          })}
        </div>
        <Button variant="outline" size="sm" onClick={onCustom} className={classy('w-full')}>
          Custom Color
        </Button>
      </CardContent>
    </Card>
  );
}
