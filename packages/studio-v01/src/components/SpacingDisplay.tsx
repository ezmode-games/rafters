import { gsap } from 'gsap';
import { Space } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpacingScale } from '../schemas';

export interface SpacingDisplayProps {
  spacing: SpacingScale;
  collapsed?: boolean;
  stackPosition?: number; // 0-based position in left stack
  progressiveScale?: number;
  onAnimationComplete?: () => void;
  onIconClick?: () => void;
}

export function SpacingDisplay({
  spacing,
  collapsed = false,
  stackPosition = 2, // Spacing is #3 in stack
  progressiveScale = 1.0,
  onAnimationComplete,
  onIconClick,
}: SpacingDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>();

  const [isHovered, setIsHovered] = useState(false);

  const spacingKeys = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

  // Discovery Phase: Full spacing scale visualization
  const playExpansionAnimation = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onAnimationComplete?.(),
    });

    gsap.set(iconRef.current, { opacity: 0, scale: 0 });
    gsap.set(contentRef.current, { opacity: 1, scale: 1, x: 0, y: 0 });

    tl.fromTo(
      contentRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }
    );

    timelineRef.current = tl;
  }, [onAnimationComplete]);

  // Confidence Phase: Collapse and slide to left stack position
  const playCollapseAnimation = useCallback(() => {
    if (!containerRef.current || !contentRef.current || !iconRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onAnimationComplete?.(),
    });

    tl.to(contentRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    });

    tl.to(
      iconRef.current,
      {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: 'power2.out',
      },
      '-=0.1'
    );

    const stackY = stackPosition * 80;
    tl.to(
      containerRef.current,
      {
        x: -window.innerWidth / 2 + 60,
        y: stackY,
        scale: 0.6,
        duration: 0.4,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      '-=0.2'
    );

    timelineRef.current = tl;
  }, [onAnimationComplete, stackPosition]);

  // Progressive weight reduction
  const playProgressiveScaling = useCallback(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      scale: progressiveScale,
      opacity: progressiveScale < 1 ? 0.8 : 1,
      duration: 0.6,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    });
  }, [progressiveScale]);

  // Genie hover effect
  const playGenieHover = useCallback(() => {
    if (!iconRef.current) return;

    gsap.to(iconRef.current, {
      scale: 1.2,
      duration: 0.2,
      ease: 'back.out(1.7)',
      yoyo: true,
      repeat: 1,
    });
  }, []);

  useEffect(() => {
    if (collapsed) {
      playCollapseAnimation();
    } else {
      playExpansionAnimation();
    }
  }, [collapsed, playCollapseAnimation, playExpansionAnimation]);

  useEffect(() => {
    if (!collapsed) {
      playProgressiveScaling();
    }
  }, [collapsed, playProgressiveScaling]);

  useEffect(() => {
    if (isHovered && collapsed) {
      playGenieHover();
    }
  }, [isHovered, collapsed, playGenieHover]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        transformOrigin: 'center top',
        minHeight: collapsed ? 60 : 400,
      }}
    >
      {/* Full Spacing Scale Content */}
      <div
        ref={contentRef}
        className="w-full bg-white rounded-lg shadow-sm p-8"
        style={{
          display: collapsed ? 'none' : 'block',
        }}
      >
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Spacing Scale</h3>

          {/* Spacing Visualization */}
          <div className="space-y-6">
            {spacingKeys.map((key) => (
              <div key={key} className="flex items-center gap-4">
                {/* Label */}
                <div className="w-8 text-sm font-medium text-gray-600">{key}</div>

                {/* Value */}
                <div className="w-20 text-sm text-gray-500">{spacing[key]}</div>

                {/* Visual Bar */}
                <div
                  className="bg-blue-500 rounded-sm h-4"
                  style={{
                    width: spacing[key],
                  }}
                />

                {/* Pixel Value */}
                <div className="text-xs text-gray-400">
                  {Math.round(Number.parseFloat(spacing[key]) * 16)}px
                </div>
              </div>
            ))}
          </div>

          {/* Spacing Examples */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold mb-4">Layout Examples</h4>
            <div className="space-y-4">
              {/* Card Example */}
              <div className="bg-white rounded-lg shadow-sm border" style={{ padding: spacing.md }}>
                <div className="font-medium" style={{ marginBottom: spacing.sm }}>
                  Card Title
                </div>
                <div className="text-gray-600">Card content with proper spacing relationships</div>
              </div>

              {/* Button Group Example */}
              <div className="flex" style={{ gap: spacing.sm }}>
                <div
                  className="bg-blue-500 text-white rounded-md text-sm font-medium"
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                  }}
                >
                  Primary
                </div>
                <div
                  className="bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                  }}
                >
                  Secondary
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed Icon */}
      <button
        ref={iconRef}
        type="button"
        className="absolute top-0 left-0 w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center cursor-pointer hover:shadow-md transition-shadow border-none"
        style={{
          display: collapsed ? 'flex' : 'none',
          opacity: 0,
          transform: 'scale(0)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onIconClick}
        tabIndex={collapsed ? 0 : -1}
        aria-label="Expand spacing section"
      >
        <Space className="w-6 h-6 text-gray-700" />
      </button>

      {/* Progress Label */}
      {collapsed && <div className="absolute -bottom-6 left-0 text-xs text-gray-500">Spacing</div>}
    </div>
  );
}
