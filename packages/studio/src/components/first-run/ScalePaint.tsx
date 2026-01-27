/**
 * Scale Paint Animation
 *
 * After primary is committed:
 * 1. Spectrum mutes
 * 2. 500 value as 128px box slides left
 * 3. Copy of 500 stays in center of scale
 * 4. 48px boxes grow outward from center, one at a time
 * 5. gap-24 between choice box and scale
 */

import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { isReducedMotion } from '../../lib/motion';
import { type OKLCH, oklchToHex } from '../../utils/color-conversion';

interface ScalePaintProps {
  color: OKLCH | null;
  onComplete: () => void;
}

// Generate a simple lightness scale from a base color
function generateScale(base: OKLCH): OKLCH[] {
  const positions = [0.97, 0.93, 0.85, 0.75, 0.65, base.l, 0.45, 0.35, 0.25, 0.18, 0.12];
  return positions.map((l) => ({ l, c: base.c, h: base.h }));
}

export function ScalePaint({ color, onComplete }: ScalePaintProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const choiceRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  const scale = color ? generateScale(color) : [];

  useEffect(() => {
    if (!containerRef.current || !choiceRef.current || !scaleRef.current) return;

    const reduced = isReducedMotion();
    const tl = gsap.timeline({ onComplete });

    // Fade in the choice box
    tl.fromTo(
      choiceRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: reduced ? 0 : 0.5, ease: 'back.out(1.4)' },
    );

    // Stagger in scale boxes
    const scaleBoxes = scaleRef.current.children;
    if (scaleBoxes.length > 0) {
      tl.fromTo(
        scaleBoxes,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: reduced ? 0 : 0.3,
          stagger: reduced ? 0 : 0.05,
          ease: 'back.out(1.7)',
        },
        reduced ? 0 : 0.3,
      );
    }

    // Pause then complete
    tl.to({}, { duration: reduced ? 0 : 0.8 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!color) return null;

  let choiceHex: string;
  try {
    choiceHex = oklchToHex(color);
  } catch {
    choiceHex = '#808080';
  }

  return (
    <div ref={containerRef} className="flex h-full items-center justify-center gap-6">
      {/* Choice: 128px box of the 500 value */}
      <div
        ref={choiceRef}
        className="shrink-0 rounded-xl opacity-0"
        style={{
          width: 128,
          height: 128,
          backgroundColor: choiceHex,
        }}
      />

      {/* Scale: 48px boxes */}
      <div ref={scaleRef} className="flex items-center gap-1">
        {scale.map((step, i) => {
          let hex: string;
          try {
            hex = oklchToHex(step);
          } catch {
            hex = '#808080';
          }
          return (
            <div
              key={i}
              className="rounded-lg opacity-0"
              style={{
                width: 48,
                height: 48,
                backgroundColor: hex,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
