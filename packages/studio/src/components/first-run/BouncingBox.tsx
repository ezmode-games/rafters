/**
 * Bouncing Box
 *
 * Mid-screen box that bounces slowly in the snowstorm.
 * "choose primary color..." fades in 500ms after mount.
 * On click: box stops, triggers color picker.
 */

import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { isReducedMotion } from '../../lib/motion';

interface BouncingBoxProps {
  onClick: () => void;
}

export function BouncingBox({ onClick }: BouncingBoxProps) {
  const boxRef = useRef<HTMLButtonElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const bounceRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!boxRef.current || isReducedMotion()) return;

    // Start bounce animation
    bounceRef.current = gsap.to(boxRef.current, {
      y: 10,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    return () => {
      bounceRef.current?.kill();
    };
  }, []);

  // Fade in text after 500ms
  useEffect(() => {
    if (!textRef.current) return;
    gsap.fromTo(
      textRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: isReducedMotion() ? 0 : 0.5,
        delay: isReducedMotion() ? 0 : 0.5,
      },
    );
  }, []);

  const handleClick = () => {
    bounceRef.current?.kill();
    if (boxRef.current) {
      gsap.to(boxRef.current, {
        scale: 0.95,
        duration: 0.1,
        onComplete: onClick,
      });
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      <button
        ref={boxRef}
        type="button"
        onClick={handleClick}
        className={[
          'flex items-center justify-center',
          'h-[25vh] w-[25vw] min-h-32 min-w-48',
          'cursor-pointer rounded-2xl',
          'border-2 border-neutral-200',
          'bg-white/80 backdrop-blur-sm',
          'transition-shadow hover:shadow-lg',
        ].join(' ')}
      >
        <span ref={textRef} className="select-none text-lg text-neutral-400 opacity-0">
          choose primary color...
        </span>
      </button>
    </div>
  );
}
