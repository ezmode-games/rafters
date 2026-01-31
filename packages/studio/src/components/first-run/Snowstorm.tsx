/**
 * Snowstorm - First Run Entry Point
 *
 * Flow:
 * 1. Click card → ColorPicker → pick color → "Why?" → Commit
 * 2. Card shrinks to 128px, moves to top left
 * 3. Scale draws in as 48px boxes (one column gap from choice box)
 * 4. Snowstorm fades forever
 *
 * React 19 pure - no useEffect for logic, only for external subscriptions (GSAP ticker).
 */

import { oklchToHex } from '@rafters/color-utils';
import type { ColorValue, OKLCH } from '@rafters/shared';
import { Button } from '@rafters/ui/components/ui/button';
import { Card, CardContent } from '@rafters/ui/components/ui/card';
import { ColorPicker } from '@rafters/ui/components/ui/color-picker';
import { Container } from '@rafters/ui/components/ui/container';
import { Input } from '@rafters/ui/components/ui/input';
import { P } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import gsap from 'gsap';
import { useCallback, useRef, useState } from 'react';
import { ColorScale } from './ColorScale';

// Snow configuration
const SNOW_CONFIG = {
  particleCount: 100,
  sizeMin: 2,
  sizeMax: 6,
  opacityMin: 0.1,
  opacityMax: 0.4,
  fallDurationMin: 10,
  fallDurationMax: 24,
  windBias: -0.3, // Negative = left bias, positive = right bias
  windStrength: 200,
  swayAmount: 60,
  swayDurationMin: 1,
  swayDurationMax: 3,
  staggerMax: 5000,
};

interface SnowstormProps {
  /** Callback that saves color to registry and returns the full ColorValue */
  onColorSelect: (color: OKLCH, reason: string) => Promise<{ colorValue: ColorValue }>;
  /** Delay before showing card (ms). Default 3000. Set to 0 for tests. */
  cardDelay?: number;
}

type Stage = 'prompt' | 'picking' | 'why' | 'done';

export function Snowstorm({ onColorSelect, cardDelay = 3000 }: SnowstormProps) {
  const snowContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const transitionBoxRef = useRef<HTMLDivElement>(null);
  const particleTweensRef = useRef<gsap.core.Tween[]>([]);
  const floatTlRef = useRef<gsap.core.Timeline | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initedRef = useRef(false);

  const [stage, setStage] = useState<Stage>('prompt');
  const [cardVisible, setCardVisible] = useState(false);
  const [color, setColor] = useState<OKLCH>({ l: 0.6, c: 0.15, h: 200, alpha: 1 });
  const [reason, setReason] = useState('');
  const [scaleColors, setScaleColors] = useState<OKLCH[]>([]);
  const [visibleScaleCount, setVisibleScaleCount] = useState(0);

  // Initialize snow particles with GSAP
  // Ref callback receives null on unmount - that's when we clean up
  const initSnow = useCallback(
    (container: HTMLDivElement | null) => {
      if (!container) {
        // Cleanup on unmount
        for (const tween of particleTweensRef.current) {
          tween.kill();
        }
        particleTweensRef.current = [];
        return;
      }
      if (initedRef.current) return;
      initedRef.current = true;
      snowContainerRef.current = container;

      const { width, height } = container.getBoundingClientRect();

      // Create DOM particles with GSAP animations
      const {
        particleCount,
        sizeMin,
        sizeMax,
        opacityMin,
        opacityMax,
        fallDurationMin,
        fallDurationMax,
        windBias,
        windStrength,
        swayAmount,
        swayDurationMin,
        swayDurationMax,
        staggerMax,
      } = SNOW_CONFIG;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * (sizeMax - sizeMin) + sizeMin;
        const opacity = Math.random() * (opacityMax - opacityMin) + opacityMin;

        particle.className = 'absolute rounded-full bg-muted-foreground';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = String(opacity);
        particle.style.left = '0';
        particle.style.top = '0';

        container.appendChild(particle);

        // Create falling animation with wind
        const animateParticle = () => {
          const startX = Math.random() * width;
          const startY = -size - Math.random() * height;
          const duration = Math.random() * (fallDurationMax - fallDurationMin) + fallDurationMin;
          const wind = (Math.random() + windBias) * windStrength;

          gsap.set(particle, { x: startX, y: startY });

          // Main falling tween
          const fallTween = gsap.to(particle, {
            y: height + size,
            x: startX + wind,
            duration,
            ease: 'none',
            onComplete: animateParticle,
          });
          particleTweensRef.current.push(fallTween);

          // Add horizontal oscillation for wind turbulence
          const swayTween = gsap.to(particle, {
            x: `+=${(Math.random() - 0.5) * swayAmount}`,
            duration: Math.random() * (swayDurationMax - swayDurationMin) + swayDurationMin,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
          particleTweensRef.current.push(swayTween);
        };

        // Stagger start times
        setTimeout(animateParticle, Math.random() * staggerMax);
      }

      // Show card after delay
      if (cardDelay > 0) {
        setTimeout(() => setCardVisible(true), cardDelay);
      } else {
        setCardVisible(true);
      }
    },
    [cardDelay],
  );

  // Initialize float animation on card wrapper and fade in
  const initCardWrapper = useCallback((wrapper: HTMLDivElement | null) => {
    if (!wrapper || floatTlRef.current) return;
    cardWrapperRef.current = wrapper;

    // Fade in the card
    gsap.fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });

    const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl.to(wrapper, { y: 15, duration: 3, ease: 'sine.inOut' });
    floatTlRef.current = floatTl;
  }, []);

  const handleCardClick = useCallback(() => {
    if (stage === 'prompt') {
      setStage('picking');
    }
  }, [stage]);

  const handleColorConfirm = useCallback(() => {
    setStage('why');
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!reason.trim()) return;

    const card = cardRef.current;
    const snowContainer = snowContainerRef.current;
    const cardWrapper = cardWrapperRef.current;
    const box = transitionBoxRef.current;

    // Debug: log which refs are missing
    if (!card || !snowContainer || !cardWrapper || !box) {
      console.error('[Snowstorm] Missing refs:', {
        card: !!card,
        snowContainer: !!snowContainer,
        cardWrapper: !!cardWrapper,
        box: !!box,
      });
      // Still call onColorSelect even if animation can't run
      const { colorValue } = await onColorSelect(color, reason.trim());
      setScaleColors(colorValue.scale);
      setStage('done');
      return;
    }

    // Get full ColorValue FROM the registry via API - single source of truth
    const { colorValue } = await onColorSelect(color, reason.trim());
    // ColorValue.scale is already an array of OKLCH (indexed by position)
    setScaleColors(colorValue.scale);

    // Kill float animation
    if (floatTlRef.current) {
      floatTlRef.current.kill();
      floatTlRef.current = null;
    }

    // Get card position
    const cardRect = card.getBoundingClientRect();

    // Position transition box at card location
    gsap.set(box, {
      position: 'fixed',
      left: cardRect.left,
      top: cardRect.top,
      width: cardRect.width,
      height: cardRect.height,
      opacity: 1,
    });

    // Hide original card
    gsap.set(cardWrapper, { visibility: 'hidden' });

    // Fade snowstorm
    gsap.to(snowContainer, { opacity: 0, duration: 0.8, ease: 'power2.inOut' });

    // Animate box to top-left
    gsap.to(box, {
      left: 24,
      top: 24,
      width: 128,
      height: 128,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        // Draw scale boxes one by one
        let count = 0;
        const interval = setInterval(() => {
          count++;
          setVisibleScaleCount(count);
          if (count >= colorValue.scale.length) {
            clearInterval(interval);
            setStage('done');
          }
        }, 80);
      },
    });
  }, [color, reason, onColorSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && reason.trim()) {
        handleSubmit();
      }
    },
    [reason, handleSubmit],
  );

  const showCenteredCard = cardVisible && stage !== 'done';

  return (
    <Container
      as="main"
      size="full"
      className={classy('relative', 'h-screen', 'overflow-hidden', 'bg-background')}
    >
      <div
        ref={initSnow}
        className={classy('absolute', 'inset-0', 'overflow-hidden', 'pointer-events-none')}
      />

      {/* Color scale */}
      <ColorScale
        colors={scaleColors}
        visibleCount={visibleScaleCount}
        className="fixed"
        style={{ top: 24, left: 24 + 128 + 48 }}
      />

      {/* Centered card */}
      {showCenteredCard && (
        <div className={classy('absolute', 'inset-0', 'flex', 'items-center', 'justify-center', 'z-10')}>
          <div ref={initCardWrapper}>
            <Card
              ref={cardRef}
              className={classy(
                'backdrop-blur-sm',
                'shadow-lg',
                'w-72',
                'overflow-hidden',
                'border-0',
              )}
              onClick={stage === 'prompt' ? handleCardClick : undefined}
              style={stage === 'prompt' ? { cursor: 'pointer' } : undefined}
            >
              <CardContent
                className={classy(
                  'flex',
                  'flex-col',
                  'items-center',
                  'justify-center',
                  'text-center',
                  'p-6',
                )}
              >
                {stage === 'prompt' && <P>Choose Your Primary Color</P>}

                {stage === 'picking' && (
                  <div className={classy('space-y-4')}>
                    <ColorPicker value={color} onChange={setColor} />
                    <Button onClick={handleColorConfirm} className={classy('w-full')}>
                      Select
                    </Button>
                  </div>
                )}

                {stage === 'why' && (
                  <div className={classy('w-full', 'space-y-3')}>
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Why this color?"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    {reason.trim() && (
                      <Button onClick={handleSubmit} className={classy('w-full')}>
                        Commit
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Transition box - always in DOM, hidden until needed */}
      <div
        ref={transitionBoxRef}
        className={classy('rounded-lg', 'pointer-events-none')}
        style={{
          backgroundColor: oklchToHex(color),
          opacity: 0,
        }}
      />
    </Container>
  );
}
