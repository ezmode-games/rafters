/**
 * GSAP Animation System
 *
 * Timeline factories for Studio animations.
 * Every factory respects prefers-reduced-motion: if enabled,
 * animations become instant gsap.set() calls with duration 0.
 */

import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { isReducedMotion } from './motion';

/**
 * Get animation duration respecting reduced motion.
 * Returns 0 when reduced motion is preferred.
 */
function dur(seconds: number): number {
  return isReducedMotion() ? 0 : seconds;
}

/**
 * React hook for GSAP context cleanup.
 * Returns a ref to attach to the container element.
 * All GSAP animations within the container are cleaned up on unmount.
 */
export function useGSAP<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    contextRef.current = gsap.context(() => {}, containerRef.current);
    return () => contextRef.current?.revert();
  }, []);

  return { containerRef, context: contextRef };
}

/**
 * Fade an element in.
 */
export function createFadeIn(
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number } = {},
): gsap.core.Tween {
  const { duration = 0.5, delay = 0 } = options;
  return gsap.fromTo(
    target,
    { opacity: 0 },
    { opacity: 1, duration: dur(duration), delay: dur(delay), ease: 'power2.out' },
  );
}

/**
 * Fade an element out.
 */
export function createFadeOut(
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number; onComplete?: () => void } = {},
): gsap.core.Tween {
  const { duration = 0.5, delay = 0, onComplete } = options;
  return gsap.to(target, {
    opacity: 0,
    duration: dur(duration),
    delay: dur(delay),
    ease: 'power2.in',
    onComplete,
  });
}

/**
 * Slide an element to the left.
 */
export function createSlideLeft(
  target: gsap.TweenTarget,
  options: { distance?: number; duration?: number; delay?: number } = {},
): gsap.core.Tween {
  const { distance = 200, duration = 0.6, delay = 0 } = options;
  return gsap.to(target, {
    x: -distance,
    duration: dur(duration),
    delay: dur(delay),
    ease: 'power3.inOut',
  });
}

/**
 * Stagger children in with scale and opacity.
 */
export function createStagger(
  targets: gsap.TweenTarget,
  options: { duration?: number; stagger?: number; delay?: number } = {},
): gsap.core.Tween {
  const { duration = 0.4, stagger = 0.05, delay = 0 } = options;
  return gsap.fromTo(
    targets,
    { opacity: 0, scale: 0 },
    {
      opacity: 1,
      scale: 1,
      duration: dur(duration),
      stagger: dur(stagger),
      delay: dur(delay),
      ease: 'back.out(1.7)',
    },
  );
}

/**
 * Crossfade between two elements.
 * Fades out the old element and fades in the new one simultaneously.
 */
export function createCrossfade(
  outTarget: gsap.TweenTarget,
  inTarget: gsap.TweenTarget,
  options: { duration?: number; onComplete?: () => void } = {},
): gsap.core.Timeline {
  const { duration = 0.4, onComplete } = options;
  const tl = gsap.timeline({ onComplete });
  tl.to(outTarget, { opacity: 0, duration: dur(duration), ease: 'power2.in' }, 0);
  tl.fromTo(
    inTarget,
    { opacity: 0 },
    { opacity: 1, duration: dur(duration), ease: 'power2.out' },
    0,
  );
  return tl;
}

/**
 * Scale an element up from zero.
 */
export function createScaleIn(
  target: gsap.TweenTarget,
  options: { duration?: number; delay?: number } = {},
): gsap.core.Tween {
  const { duration = 0.5, delay = 0 } = options;
  return gsap.fromTo(
    target,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: dur(duration),
      delay: dur(delay),
      ease: 'back.out(1.4)',
    },
  );
}

/**
 * Gentle bounce animation for the first-run bouncing box.
 */
export function createBounce(
  target: gsap.TweenTarget,
  options: { amplitude?: number; duration?: number } = {},
): gsap.core.Tween {
  const { amplitude = 10, duration = 2 } = options;
  return gsap.to(target, {
    y: amplitude,
    duration: dur(duration),
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });
}

/**
 * Sidebar retreat/restore animation.
 */
export function createSidebarRetreat(
  target: gsap.TweenTarget,
  retreated: boolean,
): gsap.core.Tween {
  return gsap.to(target, {
    x: retreated ? '-33%' : '0%',
    duration: dur(0.3),
    ease: 'power2.inOut',
  });
}
