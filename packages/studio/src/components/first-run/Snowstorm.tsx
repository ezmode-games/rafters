/**
 * Snowstorm Background
 *
 * The dreaded blank page made literal. White page with falling snowflakes.
 * CSS-based particles for simplicity. GSAP fades out when primary is committed.
 */

import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { isReducedMotion } from '../../lib/motion';

interface SnowstormProps {
  fading?: boolean;
}

const SNOWFLAKE_COUNT = 40;

export function Snowstorm({ fading }: SnowstormProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || isReducedMotion()) return;

    const container = containerRef.current;
    const flakes: HTMLDivElement[] = [];

    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
      const flake = document.createElement('div');
      const size = 2 + Math.random() * 4;
      flake.className = 'absolute rounded-full bg-neutral-200';
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.top = `${-10 - Math.random() * 20}%`;
      flake.style.opacity = `${0.3 + Math.random() * 0.5}`;
      container.appendChild(flake);
      flakes.push(flake);

      gsap.to(flake, {
        y: '120vh',
        x: `+=${(Math.random() - 0.5) * 100}`,
        duration: 4 + Math.random() * 6,
        repeat: -1,
        ease: 'none',
        delay: Math.random() * 5,
      });
    }

    return () => {
      for (const flake of flakes) {
        gsap.killTweensOf(flake);
        flake.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (fading && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: isReducedMotion() ? 0 : 1.5,
        ease: 'power2.out',
      });
    }
  }, [fading]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" />
  );
}
