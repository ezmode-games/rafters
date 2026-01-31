import { oklchToHex } from '@rafters/color-utils';
import type { OKLCH } from '@rafters/shared';
import classy from '@rafters/ui/primitives/classy';
import gsap from 'gsap';
import { type CSSProperties, useCallback, useRef } from 'react';

const BOX_SIZE = 48;

interface ColorScaleProps {
  colors: OKLCH[];
  visibleCount?: number;
  className?: string;
  style?: CSSProperties;
  /** Animate boxes drawing in from left */
  animate?: boolean;
  /** Delay before animation starts (seconds) */
  animateDelay?: number;
}

export function ColorScale({
  colors,
  visibleCount = colors.length,
  className,
  style,
  animate = false,
  animateDelay = 0,
}: ColorScaleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  const initContainer = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el || !animate || animatedRef.current) return;
      animatedRef.current = true;
      containerRef.current = el;

      const boxes = el.children;
      // Fan out: each box grows from 0 width to full width
      gsap.set(boxes, { width: 0, overflow: 'hidden' });
      gsap.to(boxes, {
        width: BOX_SIZE,
        duration: 0.12,
        stagger: 0.04,
        ease: 'power2.out',
        delay: animateDelay,
      });
    },
    [animate, animateDelay],
  );

  if (colors.length === 0) return null;

  return (
    <div ref={animate ? initContainer : undefined} className={classy('flex', className)} style={style}>
      {colors.map((color, i) =>
        i < visibleCount ? (
          <div
            key={i}
            style={{ width: BOX_SIZE, height: BOX_SIZE, backgroundColor: oklchToHex(color) }}
          />
        ) : null,
      )}
    </div>
  );
}
