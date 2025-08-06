import { gsap } from 'gsap';
import { Type } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TypographyScale } from '../schemas';

export interface TypographyDisplayProps {
  typography: TypographyScale;
  collapsed?: boolean;
  stackPosition?: number; // 0-based position in left stack
  progressiveScale?: number;
  onAnimationComplete?: () => void;
  onIconClick?: () => void;
}

export function TypographyDisplay({
  typography,
  collapsed = false,
  stackPosition = 1, // Typography is #2 in stack
  progressiveScale = 1.0,
  onAnimationComplete,
  onIconClick,
}: TypographyDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline>();

  const [isHovered, setIsHovered] = useState(false);

  // Discovery Phase: Full typography specimen display
  const playExpansionAnimation = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => onAnimationComplete?.(),
    });

    // Hide icon, show content
    gsap.set(iconRef.current, { opacity: 0, scale: 0 });
    gsap.set(contentRef.current, { opacity: 1, scale: 1, x: 0, y: 0 });

    // Expand content with bounce
    tl.fromTo(
      contentRef.current,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Discovery bounce
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

    // Collapse content
    tl.to(contentRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)', // Decisive ease-in
    });

    // Show and position icon
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

    // Slide entire container to left stack position
    const stackY = stackPosition * 80; // 80px spacing between icons
    tl.to(
      containerRef.current,
      {
        x: -window.innerWidth / 2 + 60, // Slide to left edge
        y: stackY,
        scale: 0.6, // Make smaller in stack
        duration: 0.4,
        ease: 'cubic-bezier(0.23, 1, 0.32, 1)', // Confident ease-out
      },
      '-=0.2'
    );

    timelineRef.current = tl;
  }, [onAnimationComplete, stackPosition]);

  // Mastery Phase: Progressive weight reduction
  const playProgressiveScaling = useCallback(() => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      scale: progressiveScale,
      opacity: progressiveScale < 1 ? 0.8 : 1,
      duration: 0.6,
      ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
    });
  }, [progressiveScale]);

  // Genie hover effect for icon
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

  // Handle collapse/expand
  useEffect(() => {
    if (collapsed) {
      playCollapseAnimation();
    } else {
      playExpansionAnimation();
    }
  }, [collapsed, playCollapseAnimation, playExpansionAnimation]);

  // Handle progressive scaling
  useEffect(() => {
    if (!collapsed) {
      playProgressiveScaling();
    }
  }, [collapsed, playProgressiveScaling]);

  // Handle icon hover
  useEffect(() => {
    if (isHovered && collapsed) {
      playGenieHover();
    }
  }, [isHovered, collapsed, playGenieHover]);

  // Cleanup
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
      {/* Full Typography Specimen Content */}
      <div
        ref={contentRef}
        className="w-full bg-white rounded-lg shadow-sm p-8"
        style={{
          display: collapsed ? 'none' : 'block',
        }}
      >
        <div className="space-y-6">
          {/* Display Text */}
          <div
            className="text-6xl font-bold"
            style={{
              fontFamily: typography.heading,
              fontSize: `${typography.scale.display}rem`,
            }}
          >
            Design System
          </div>

          {/* Heading Hierarchy */}
          <div className="space-y-4">
            <h1
              className="font-bold"
              style={{
                fontFamily: typography.heading,
                fontSize: `${typography.scale.h1}rem`,
              }}
            >
              Main Heading
            </h1>
            <h2
              className="font-semibold"
              style={{
                fontFamily: typography.heading,
                fontSize: `${typography.scale.h2}rem`,
              }}
            >
              Section Heading
            </h2>
            <h3
              className="font-medium"
              style={{
                fontFamily: typography.heading,
                fontSize: `${typography.scale.h3}rem`,
              }}
            >
              Subsection Heading
            </h3>
          </div>

          {/* Body Text */}
          <div
            className="max-w-2xl"
            style={{
              fontFamily: typography.body,
              fontSize: `${typography.scale.body}rem`,
              lineHeight: 1.6,
            }}
          >
            This is body text that demonstrates readability and flow. The typography system creates
            hierarchy through size, weight, and spacing relationships that guide the reader's
            attention naturally through the content.
          </div>

          {/* Font Info */}
          <div className="flex gap-8 text-sm text-gray-600">
            <div>
              <strong>Heading:</strong> {typography.heading}
            </div>
            <div>
              <strong>Body:</strong> {typography.body}
            </div>
            <div>
              <strong>Mono:</strong> {typography.mono}
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
        aria-label="Expand typography section"
      >
        <Type className="w-6 h-6 text-gray-700" />
      </button>

      {/* Progress Label */}
      {collapsed && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">Typography</div>
      )}
    </div>
  );
}
