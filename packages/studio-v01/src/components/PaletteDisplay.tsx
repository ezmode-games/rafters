import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PaletteScale } from '../schemas';
import { ColorScaleDisplay } from './ColorScaleDisplay';

export interface PaletteDisplayProps {
  scales: PaletteScale[];
  state: 'open' | 'closed';
  progressiveScale?: number; // 0.6-1.0 for weight reduction as system grows
  onAnimationComplete?: () => void;
}

export function PaletteDisplay({
  scales,
  state,
  progressiveScale = 1.0,
  onAnimationComplete,
}: PaletteDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleDisplayRefs = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline>();

  const [currentState, setCurrentState] = useState(state);
  const [animatingScales, setAnimatingScales] = useState<string[]>([]);

  // System Revelation: Open all scales in rows
  const playExpansionAnimation = useCallback(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentState('open');
        onAnimationComplete?.();
      },
    });

    // Move each scale to its row position with stagger
    scaleDisplayRefs.current.forEach((scaleRef, index) => {
      if (scaleRef) {
        tl.to(
          scaleRef,
          {
            y: index * 320, // Space between rows
            duration: 0.5,
            ease: 'cubic-bezier(0.23, 1, 0.32, 1)', // ease-out
          },
          index * 0.1
        ); // 100ms stagger between rows
      }
    });

    timelineRef.current = tl;
  }, [onAnimationComplete]);

  // Organized Control: Collapse all scales to single row
  const playCollapseAnimation = useCallback(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentState('closed');
        onAnimationComplete?.();
      },
    });

    // Move all scales back to single row position
    scaleDisplayRefs.current.forEach((scaleRef, index) => {
      if (scaleRef) {
        tl.to(
          scaleRef,
          {
            y: 0,
            x: index * 144, // Horizontal spacing for single row
            duration: 0.4,
            ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // ease-in-out with settle
          },
          index * 0.05
        ); // Slight stagger for organic feel
      }
    });

    timelineRef.current = tl;
  }, [onAnimationComplete]);

  // Accumulating Mastery: Progressive weight reduction
  const playProgressiveScaling = useCallback(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onAnimationComplete?.(),
    });

    // Scale down entire palette proportionally
    tl.to(containerRef.current, {
      scale: progressiveScale,
      opacity: progressiveScale < 1 ? 0.8 : 1,
      duration: 0.6,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)', // ease-out
    });

    // Adjust position to make room for new elements
    if (progressiveScale < 1) {
      tl.to(
        containerRef.current,
        {
          x: -(containerRef.current.offsetWidth * (1 - progressiveScale)) / 2,
          duration: 0.3,
          ease: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // ease-in-out
        },
        '-=0.3'
      );
    }

    timelineRef.current = tl;
  }, [progressiveScale, onAnimationComplete]);

  // Handle state changes
  useEffect(() => {
    if (currentState === state) return;

    if (state === 'open' && currentState === 'closed') {
      playExpansionAnimation();
    } else if (state === 'closed' && currentState === 'open') {
      playCollapseAnimation();
    }
  }, [state, currentState, playExpansionAnimation, playCollapseAnimation]);

  // Handle progressive scaling
  useEffect(() => {
    playProgressiveScaling();
  }, [playProgressiveScaling]);

  // Cleanup
  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  // Track animation completion for individual scales
  const handleScaleAnimationComplete = (scaleName: string) => {
    setAnimatingScales((prev) => prev.filter((name) => name !== scaleName));
  };

  const addAnimatingScale = (scaleName: string) => {
    setAnimatingScales((prev) => [...prev, scaleName]);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        transformOrigin: 'center top',
        minHeight: state === 'open' ? scales.length * 320 : 320,
      }}
    >
      {scales.map((paletteScale, index) => (
        <div
          key={paletteScale.name}
          ref={(el) => {
            if (el) scaleDisplayRefs.current[index] = el;
          }}
          className="absolute w-full"
          style={{
            top: 0,
            left: 0,
            transform:
              state === 'closed' ? `translateX(${index * 144}px)` : `translateY(${index * 320}px)`,
          }}
        >
          <ColorScaleDisplay
            scale={paletteScale.scale}
            name={paletteScale.name}
            collapsed={state === 'closed'}
            onAnimationComplete={() => handleScaleAnimationComplete(paletteScale.name)}
          />
        </div>
      ))}

      {/* Progress indicator for system building */}
      {progressiveScale < 1 && (
        <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
          <div className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
            Color System Complete
          </div>
        </div>
      )}
    </div>
  );
}
