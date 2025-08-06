import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ColorScale } from '../schemas';

export interface ColorScaleDisplayProps {
  scale: ColorScale;
  name: string;
  collapsed?: boolean;
  onAnimationComplete?: () => void;
}

export function ColorScaleDisplay({
  scale,
  name,
  collapsed = false,
  onAnimationComplete,
}: ColorScaleDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerColorRef = useRef<HTMLDivElement>(null);
  const scaleColorsRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline>();

  const [isInitialMount, setIsInitialMount] = useState(true);
  const [currentScale, setCurrentScale] = useState(scale);

  const scaleOrder = [50, 100, 200, 300, 400, 600, 700, 800, 900]; // Exclude 500 - it's handled separately
  const leftColors = [50, 100, 200, 300, 400];
  const rightColors = [600, 700, 800, 900];

  // Get responsive box size based on screen width
  const getBoxSize = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1024) return 128; // lg: w-32 h-32
    if (width >= 768) return 96; // md: w-24 h-24
    return 64; // default: w-16 h-16
  }, []);

  // Discovery Phase: Initial color expansion and fan out
  const playDiscoveryAnimation = useCallback(() => {
    if (!containerRef.current || !centerColorRef.current) return;

    const boxSize = getBoxSize();
    const spacing = boxSize + 16; // Box size + 16px gap

    const tl = gsap.timeline({
      onComplete: () => {
        setIsInitialMount(false);
        onAnimationComplete?.();
      },
    });

    // Start with small scale
    gsap.set(centerColorRef.current, {
      scale: 0.1,
      x: 0,
      opacity: 1,
    });

    // Hide scale colors initially
    gsap.set(scaleColorsRef.current, {
      opacity: 0,
      scale: 0,
      x: 0,
    });

    // Discovery: Grow center color (excitement and potential)
    tl.to(centerColorRef.current, {
      scale: 1,
      duration: 0.8,
      ease: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // bounce ease-out
    });

    // Fan out left colors
    leftColors.forEach((colorKey, index) => {
      const colorRef = scaleColorsRef.current.find(
        (ref) => ref?.dataset.colorKey === colorKey.toString()
      );
      if (colorRef) {
        tl.to(
          colorRef,
          {
            opacity: 1,
            scale: 1,
            x: -spacing * (5 - index), // Space left from center, adjusted for missing 500
            duration: 0.6,
            ease: 'power2.out',
          },
          `-=${0.6 - index * 0.05}`
        ); // Stagger with 50ms delay
      }
    });

    // Fan out right colors
    rightColors.forEach((colorKey, index) => {
      const colorRef = scaleColorsRef.current.find(
        (ref) => ref?.dataset.colorKey === colorKey.toString()
      );
      if (colorRef) {
        tl.to(
          colorRef,
          {
            opacity: 1,
            scale: 1,
            x: spacing * (index + 1), // Space right from center
            duration: 0.6,
            ease: 'power2.out',
          },
          `-=${0.6 - index * 0.05}`
        ); // Stagger with 50ms delay
      }
    });

    timelineRef.current = tl;
  }, [onAnimationComplete, getBoxSize]);

  // Refinement Phase: Fade update for scale changes
  const playRefinementAnimation = useCallback(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onAnimationComplete?.(),
    });

    // Thoughtful adjustment - fade out then in
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)', // ease-in
    })
      .call(() => setCurrentScale(scale))
      .to(containerRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // ease-in-out
      });

    timelineRef.current = tl;
  }, [onAnimationComplete, scale]);

  // Confidence Phase: Collapse to single row position
  const playCollapseAnimation = useCallback(() => {
    if (!containerRef.current || !centerColorRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onAnimationComplete?.(),
    });

    // Collapse scale colors to center (decisive action)
    tl.to(scaleColorsRef.current, {
      opacity: 0,
      scale: 0,
      x: 0,
      duration: 0.4,
      ease: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)', // ease-in
    });

    // Slide 500 color to left edge
    tl.to(centerColorRef.current, {
      x: -containerRef.current.offsetWidth / 2 + 32, // Move to left edge
      scale: 0.5, // Make it smaller when collapsed
      duration: 0.3,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)', // ease-out
    });

    // Shrink container
    tl.to(
      containerRef.current,
      {
        width: 64,
        duration: 0.2,
        ease: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)', // ease-in
      },
      '-=0.1'
    );

    timelineRef.current = tl;
  }, [onAnimationComplete]);

  // Expand from collapsed state
  const playExpandAnimation = useCallback(() => {
    if (!containerRef.current || !centerColorRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onAnimationComplete?.(),
    });

    // Expand container and move center color back
    tl.to(containerRef.current, {
      width: '100%',
      duration: 0.3,
      ease: 'power2.out',
    }).to(
      centerColorRef.current,
      {
        x: 0,
        scale: 1,
        duration: 0.4,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)', // ease-out
      },
      '-=0.1'
    );

    // Fan out scale colors again
    const fanOutColors = () => {
      leftColors.forEach((colorKey, index) => {
        const colorRef = scaleColorsRef.current.find(
          (ref) => ref?.dataset.colorKey === colorKey.toString()
        );
        if (colorRef) {
          tl.to(
            colorRef,
            {
              opacity: 1,
              scale: 1,
              x: -(128 + 16) * (5 - index),
              duration: 0.4,
              ease: 'power2.out',
            },
            `-=${0.4 - index * 0.1}`
          );
        }
      });

      rightColors.forEach((colorKey, index) => {
        const colorRef = scaleColorsRef.current.find(
          (ref) => ref?.dataset.colorKey === colorKey.toString()
        );
        if (colorRef) {
          tl.to(
            colorRef,
            {
              opacity: 1,
              scale: 1,
              x: (128 + 16) * (index + 1),
              duration: 0.4,
              ease: 'power2.out',
            },
            `-=${0.4 - index * 0.1}`
          );
        }
      });
    };

    fanOutColors();
    timelineRef.current = tl;
  }, [onAnimationComplete]);

  // Handle scale changes
  useEffect(() => {
    if (JSON.stringify(currentScale) !== JSON.stringify(scale) && !isInitialMount) {
      playRefinementAnimation();
    }
  }, [scale, currentScale, isInitialMount, playRefinementAnimation]);

  // Handle collapse/expand
  useEffect(() => {
    if (isInitialMount) return;

    if (collapsed) {
      playCollapseAnimation();
    } else {
      playExpandAnimation();
    }
  }, [collapsed, isInitialMount, playCollapseAnimation, playExpandAnimation]);

  // Initial mount animation
  useEffect(() => {
    if (isInitialMount) {
      // Small delay to ensure CSS is applied
      setTimeout(() => {
        playDiscoveryAnimation();
      }, 100);
    }
  }, [isInitialMount, playDiscoveryAnimation]);

  // Update spacing when window resizes
  useEffect(() => {
    if (isInitialMount || collapsed) return;

    const handleResize = () => {
      const boxSize = getBoxSize();
      const spacing = boxSize + 16;

      // Update positions immediately without animation
      leftColors.forEach((colorKey, index) => {
        const colorRef = scaleColorsRef.current.find(
          (ref) => ref?.dataset.colorKey === colorKey.toString()
        );
        if (colorRef) {
          gsap.set(colorRef, { x: -spacing * (5 - index) });
        }
      });

      rightColors.forEach((colorKey, index) => {
        const colorRef = scaleColorsRef.current.find(
          (ref) => ref?.dataset.colorKey === colorKey.toString()
        );
        if (colorRef) {
          gsap.set(colorRef, { x: spacing * (index + 1) });
        }
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isInitialMount, collapsed, getBoxSize]);

  // Cleanup
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-32 md:h-40 lg:h-48 flex items-center justify-center"
      style={{
        perspective: '1000px',
      }}
    >
      {/* Color Scale Colors */}
      {scaleOrder.map((colorKey) => (
        <div
          key={colorKey}
          ref={(el) => {
            if (el) scaleColorsRef.current.push(el);
          }}
          data-color-key={colorKey}
          className="absolute rounded-lg shadow-sm w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32"
          style={{
            backgroundColor: currentScale[colorKey as keyof ColorScale],
            opacity: 0,
            transform: 'scale(0)',
          }}
        >
          <div className="absolute bottom-2 left-2 text-white text-sm font-medium bg-black/20 px-2 py-1 rounded">
            {colorKey}
          </div>
        </div>
      ))}

      {/* Center 500 Color */}
      <div
        ref={centerColorRef}
        className="absolute rounded-lg shadow-lg w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32"
        style={{
          backgroundColor: currentScale[500],
        }}
      >
        <div className="absolute bottom-2 left-2 text-white text-sm font-medium bg-black/20 px-2 py-1 rounded">
          500
        </div>
      </div>
    </div>
  );
}
