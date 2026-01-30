/**
 * ColorPicker - First Run Color Selection
 *
 * Anchored popover that shows the selected color with a WhyGate
 * requiring the user to explain their choice.
 *
 * Uses @rafters/color-utils for color conversion and naming.
 * Uses @rafters/ui components and classy for dogfooding.
 */

import { generateColorName, oklchToHex } from '@rafters/color-utils';
import { Muted } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import { WhyGate } from '../shared/WhyGate';

export interface ColorPickerColor {
  h: number;
  s: number;
  l: number;
}

export interface ColorPickerProps {
  /** Selected color from Snowstorm */
  color: ColorPickerColor;
  /** Anchor position (where user clicked) */
  anchorPosition: { x: number; y: number };
  /** Called when user confirms with reason */
  onConfirm: (color: ColorPickerColor, reason: string) => void;
  /** Called when user cancels */
  onCancel: () => void;
}

/** Cycling placeholder examples for "why this color" */
const WHY_PLACEHOLDERS = [
  'brand guidelines require this blue',
  'matches our logo perfectly',
  'calming for healthcare users',
  'energetic startup vibe',
  'accessible on all backgrounds',
  'complements existing palette',
];

/**
 * ColorPicker shows at click position with the selected color
 * and requires a reason before proceeding.
 */
export function ColorPicker({ color, anchorPosition, onConfirm, onCancel }: ColorPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert internal HSL-ish format to OKLCH for color-utils
  // Note: Snowstorm uses h=hue, s=chroma (confusingly named), l=lightness
  const oklch = useMemo(
    () => ({
      l: color.l,
      c: color.s, // Snowstorm's "s" is actually OKLCH chroma
      h: color.h,
      alpha: 1,
    }),
    [color],
  );

  // Generate color name and hex
  const colorName = useMemo(() => generateColorName(oklch), [oklch]);
  const hexColor = useMemo(() => oklchToHex(oklch), [oklch]);

  // Calculate position to keep picker on screen
  const position = useMemo(() => {
    const pickerWidth = 288; // w-72 = 18rem = 288px
    const pickerHeight = 280; // approximate height
    const padding = 16;

    let x = anchorPosition.x + 20; // offset from click
    let y = anchorPosition.y - 20;

    // Keep on screen horizontally
    if (x + pickerWidth + padding > window.innerWidth) {
      x = anchorPosition.x - pickerWidth - 20;
    }

    // Keep on screen vertically
    if (y + pickerHeight + padding > window.innerHeight) {
      y = window.innerHeight - pickerHeight - padding;
    }
    if (y < padding) {
      y = padding;
    }

    return { x, y };
  }, [anchorPosition]);

  // Animate in on mount
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' },
      );
    }
  }, []);

  const handleConfirm = (reason: string) => {
    // Animate out then confirm
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: () => onConfirm(color, reason),
      });
    } else {
      onConfirm(color, reason);
    }
  };

  const handleCancel = () => {
    // Animate out then cancel
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.15,
        ease: 'power2.in',
        onComplete: onCancel,
      });
    } else {
      onCancel();
    }
  };

  return (
    <div
      ref={containerRef}
      className={classy('pointer-events-auto', 'absolute', 'z-50')}
      style={{ left: position.x, top: position.y }}
    >
      <WhyGate
        title="why this color?"
        placeholders={WHY_PLACEHOLDERS}
        submitLabel="Use This Color"
        onSubmit={handleConfirm}
        onCancel={handleCancel}
      >
        {/* Color swatch and info */}
        <div className={classy('mb-4', 'flex', 'items-center', 'gap-3')}>
          {/* Color swatch - uses inline style for dynamic hex (allowed for preview) */}
          <div
            role="img"
            className={classy('h-16', 'w-16', 'rounded-lg', 'shadow-md', 'border', 'border-border')}
            style={{ backgroundColor: hexColor }}
            aria-label={`Selected color: ${colorName}`}
          />
          <div className={classy('flex-1')}>
            <Muted className={classy('text-xs', 'font-mono')}>{hexColor}</Muted>
            <Muted className={classy('text-xs')}>{colorName}</Muted>
          </div>
        </div>
      </WhyGate>
    </div>
  );
}

export default ColorPicker;
