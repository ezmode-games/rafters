/**
 * Snowstorm - First Run Entry Point
 *
 * Flow:
 * 1. Click card → ColorPicker → pick color → "Why?" → Commit primary
 * 2. Primary box appears top-left with scale
 * 3. For each remaining family: show options → user picks → draw new row
 * 4. After all 11 families complete, snowstorm fades
 *
 * React 19 pure - no useEffect for logic, only for external subscriptions (GSAP ticker).
 */

import {
  buildColorValue,
  generateHarmony,
  generateSemanticColorSuggestions,
  oklchToHex,
} from '@rafters/color-utils';
import type { ColorValue, OKLCH } from '@rafters/shared';
import { Button } from '@rafters/ui/components/ui/button';
import { Card, CardContent } from '@rafters/ui/components/ui/card';
import { ColorPicker } from '@rafters/ui/components/ui/color-picker';
import { Container } from '@rafters/ui/components/ui/container';
import { Textarea } from '@rafters/ui/components/ui/textarea';
import { P } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import gsap from 'gsap';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { ColorScale } from './ColorScale';

// Inspirational prompts - short, clickable chips
const INSPIRATION_CHIPS = [
  'Brand guidelines',
  'Feels trustworthy',
  'Good contrast',
  'Team favorite',
  'Matches our voice',
];

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

/** Family type - harmony (7) + semantic (4) = 11 total */
type FamilyKey =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'highlight'
  | 'surface'
  | 'neutral'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';

/** Family display names */
const FAMILY_LABELS: Record<FamilyKey, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  accent: 'Accent',
  highlight: 'Highlight',
  surface: 'Surface',
  neutral: 'Neutral',
  danger: 'Danger',
  success: 'Success',
  warning: 'Warning',
  info: 'Info',
};

/** Order of family selection after primary */
const FAMILY_ORDER: FamilyKey[] = [
  'secondary',
  'tertiary',
  'accent',
  'highlight',
  'surface',
  'neutral',
  'danger',
  'success',
  'warning',
  'info',
];

/** Selected family color with its scale */
interface SelectedFamily {
  family: FamilyKey;
  color: OKLCH;
  scale: OKLCH[];
}

interface SnowstormProps {
  /** Callback that saves color to registry and returns the full ColorValue */
  onColorSelect: (color: OKLCH, reason: string, family?: FamilyKey) => Promise<{ colorValue: ColorValue }>;
  /** Callback when onboarding is complete */
  onComplete?: () => void;
  /** Delay before showing card (ms). Default 3000. Set to 0 for tests. */
  cardDelay?: number;
}

/** Animated family picker - fades in on mount */
const FamilyPicker = forwardRef<
  HTMLDivElement,
  {
    family: FamilyKey;
    options: OKLCH[];
    onSelect: (color: OKLCH) => void;
    disabled?: boolean;
  }
>(function FamilyPicker({ family, options, onSelect, disabled }, ref) {
  const initPicker = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    // Fade in on mount
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
    );
  }, []);

  return (
    <div
      ref={(el) => {
        // Combine refs
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
        initPicker(el);
      }}
      className={classy('flex', 'flex-col', 'items-center', 'gap-6')}
    >
      <P className={classy('text-muted-foreground', 'text-sm')}>
        {FAMILY_LABELS[family]}
      </P>

      {/* Large color options */}
      <div className={classy('flex', 'gap-6', 'justify-center')}>
        {options.map((option, index) => (
          <button
            key={`${family}-${index}`}
            type="button"
            onClick={() => !disabled && onSelect(option)}
            disabled={disabled}
            className={classy(
              'w-32',
              'h-32',
              'rounded-lg',
              'shadow-lg',
              'transition-transform',
              'hover:scale-105',
              'focus:outline-none',
              'focus:ring-2',
              'focus:ring-ring',
              'focus:ring-offset-2',
              disabled && 'pointer-events-none',
            )}
            style={{ backgroundColor: oklchToHex(option) }}
          />
        ))}
      </div>
    </div>
  );
});

/** Animated family row - box fades in, then scale fans out */
function FamilyRow({ selected }: { selected: SelectedFamily }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  const initRow = useCallback((el: HTMLDivElement | null) => {
    if (!el || animatedRef.current) return;
    animatedRef.current = true;

    // Animate box fading in
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
      );
    }
  }, []);

  return (
    <div ref={initRow} className={classy('flex', 'items-center', 'gap-12')} data-family={selected.family}>
      {/* Color box */}
      <div
        ref={boxRef}
        className={classy('rounded-lg', 'shrink-0')}
        data-box
        style={{
          width: 128,
          height: 128,
          backgroundColor: oklchToHex(selected.color),
        }}
      />
      {/* Scale - animate after box */}
      <div data-scale>
        <ColorScale
          colors={selected.scale}
          visibleCount={selected.scale.length}
          animate={true}
          animateDelay={0.3}
        />
      </div>
    </div>
  );
}

/** Final collapsed row - horizontal row of 64px boxes with labels */
function FinalColorRow({ families }: { families: SelectedFamily[] }) {
  const animatedRef = useRef(false);

  const initContainer = useCallback((el: HTMLDivElement | null) => {
    if (!el || animatedRef.current) return;
    animatedRef.current = true;

    // Stagger fade in each box
    const items = el.querySelectorAll('[data-final-item]');
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
    );
  }, []);

  return (
    <div
      ref={initContainer}
      className={classy('fixed', 'flex', 'gap-4', 'items-start')}
      style={{ top: 24, left: 24 }}
    >
      {families.map((family) => (
        <div
          key={family.family}
          data-final-item
          className={classy('flex', 'flex-col', 'items-center', 'gap-2')}
        >
          <div
            className={classy('rounded-lg')}
            style={{
              width: 64,
              height: 64,
              backgroundColor: oklchToHex(family.color),
            }}
          />
          <P className={classy('text-xs', 'text-muted-foreground')}>
            {FAMILY_LABELS[family.family]}
          </P>
        </div>
      ))}
    </div>
  );
}

type Stage = 'prompt' | 'picking' | 'why' | 'family-select' | 'collapsing' | 'done';

export function Snowstorm({ onColorSelect, onComplete, cardDelay = 3000 }: SnowstormProps) {
  console.log('=== SNOWSTORM COMPONENT MOUNTED/RENDERED ===');
  const snowContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const particleTweensRef = useRef<gsap.core.Tween[]>([]);
  const floatTlRef = useRef<gsap.core.Timeline | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initedRef = useRef(false);

  const [stage, setStage] = useState<Stage>('prompt');
  const [cardVisible, setCardVisible] = useState(false);
  const [color, setColor] = useState<OKLCH>({ l: 0.6, c: 0.15, h: 200, alpha: 1 });
  const [reason, setReason] = useState('');

  // Family selection state
  const [selectedFamilies, setSelectedFamilies] = useState<SelectedFamily[]>([]);
  const [currentFamilyIndex, setCurrentFamilyIndex] = useState(0);
  const [familyOptions, setFamilyOptions] = useState<OKLCH[]>([]);
  const [harmonyColors, setHarmonyColors] = useState<ReturnType<typeof generateHarmony> | null>(null);
  const [semanticSuggestions, setSemanticSuggestions] = useState<ReturnType<typeof generateSemanticColorSuggestions> | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);

  // Debug: log state changes
  console.log('[Snowstorm render] stage:', stage, 'selectedFamilies:', selectedFamilies.length, 'currentFamilyIndex:', currentFamilyIndex);

  // Handle collapse animation when entering 'collapsing' stage
  useEffect(() => {
    if (stage !== 'collapsing' || !rowsContainerRef.current) return;

    const container = rowsContainerRef.current;
    const scales = container.querySelectorAll('[data-scale]');

    const tl = gsap.timeline({
      onComplete: () => {
        setStage('done');
        // Notify parent that onboarding is complete
        onComplete?.();
      },
    });

    // Fade out all scales
    tl.to(scales, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    });

    // Fade out the entire rows container
    tl.to(container, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, '-=0.1');

  }, [stage, onComplete]);

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
      // Stop floating when user engages with the card
      if (floatTlRef.current) {
        floatTlRef.current.kill();
        floatTlRef.current = null;
      }
      if (cardWrapperRef.current) {
        gsap.to(cardWrapperRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
      }
      setStage('picking');
    }
  }, [stage]);

  const handleColorConfirm = useCallback(() => {
    setStage('why');
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, []);

  const handleChipClick = useCallback((chip: string) => {
    setReason((prev) => (prev ? `${prev}, ${chip.toLowerCase()}` : chip));
    textareaRef.current?.focus();
  }, []);

  const handleTextareaFocus = useCallback(() => {
    // Stop the floating animation when user focuses on input
    if (floatTlRef.current) {
      floatTlRef.current.kill();
      floatTlRef.current = null;
    }
    // Settle the card to its natural position
    if (cardWrapperRef.current) {
      gsap.to(cardWrapperRef.current, { y: 0, duration: 0.3, ease: 'power2.out' });
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    console.log('[Snowstorm] handleSubmit called, reason:', reason, 'stage:', stage);
    if (!reason.trim()) {
      console.log('[Snowstorm] No reason, returning early');
      return;
    }

    console.log('[Snowstorm] Calling onColorSelect for primary...');

    try {
      // Get full ColorValue FROM the registry via API - single source of truth
      console.log('[Snowstorm] Awaiting onColorSelect...');
      const result = await onColorSelect(color, reason.trim(), 'primary');
      console.log('[Snowstorm] onColorSelect result:', result);

      const { colorValue } = result;

      // Generate harmony and semantic options based on primary color
      const harmony = generateHarmony(color);
      const semantic = generateSemanticColorSuggestions(color);
      setHarmonyColors(harmony);
      setSemanticSuggestions(semantic);

      // Helper to get options for a family using the harmony/semantic we just generated
      const getOptions = (family: FamilyKey): OKLCH[] => {
        switch (family) {
          case 'secondary':
            return [harmony.splitComplementary1, harmony.splitComplementary2];
          case 'tertiary':
            return [harmony.triadic1, harmony.triadic2];
          case 'accent':
            return [harmony.complementary];
          case 'highlight':
            return [harmony.analogous1, harmony.analogous2];
          case 'surface':
            return [{ ...color, c: color.c * 0.1, l: 0.95 }];
          case 'neutral':
            return harmony.neutral ? [harmony.neutral] : [];
          case 'danger':
            return semantic.danger;
          case 'success':
            return semantic.success;
          case 'warning':
            return semantic.warning;
          case 'info':
            return semantic.info;
          default:
            return [];
        }
      };

      // Auto-select single-option families, stop at first multi-option
      const autoSelected: SelectedFamily[] = [];
      let firstPickerIndex = 0;

      while (firstPickerIndex < FAMILY_ORDER.length) {
        const family = FAMILY_ORDER[firstPickerIndex];
        if (!family) break;
        const options = getOptions(family);

        if (options.length === 1 && options[0]) {
          // Auto-select single option
          const autoColor = options[0];
          const familyReason = `Derived from primary: ${FAMILY_LABELS[family]}`;
          const autoResult = await onColorSelect(autoColor, familyReason, family);
          autoSelected.push({
            family,
            color: autoColor,
            scale: autoResult.colorValue?.scale || buildColorValue(autoColor).scale,
          });
          firstPickerIndex++;
        } else if (options.length > 1) {
          // Multiple options - stop and show picker
          break;
        } else {
          firstPickerIndex++;
        }
      }

      setCurrentFamilyIndex(firstPickerIndex);
      const firstFamily = FAMILY_ORDER[firstPickerIndex];
      if (firstFamily) {
        setFamilyOptions(getOptions(firstFamily));
      }

      // Kill float animation if running
      if (floatTlRef.current) {
        floatTlRef.current.kill();
        floatTlRef.current = null;
      }

      // Animate card shrinking and moving to top-left
      const card = cardRef.current;
      const wrapper = cardWrapperRef.current;

      if (card && wrapper) {
        const tl = gsap.timeline({
          onComplete: () => {
            // After animation, set state for family selection
            const primaryFamily: SelectedFamily = { family: 'primary', color, scale: colorValue?.scale || [] };
            setSelectedFamilies([primaryFamily, ...autoSelected]);
            setStage('family-select');
          },
        });

        // Fade out snowstorm
        if (snowContainerRef.current) {
          tl.to(snowContainerRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0);
        }

        // Shrink and move card to top-left
        tl.to(
          wrapper,
          {
            x: -window.innerWidth / 2 + 24 + 64, // Move to left (24px margin + half of 128px box)
            y: -window.innerHeight / 2 + 24 + 64, // Move to top
            scale: 128 / 288, // Shrink from ~288px card to 128px
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0,
        );

        // Fade out card content
        tl.to(card, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.4);
      } else {
        // Fallback if refs not available
        const primaryFamily: SelectedFamily = { family: 'primary', color, scale: colorValue?.scale || [] };
        setSelectedFamilies([primaryFamily, ...autoSelected]);
        if (snowContainerRef.current) {
          gsap.to(snowContainerRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
        }
        setStage('family-select');
      }
    } catch (err) {
      console.error('[Snowstorm] handleSubmit error:', err);
    }
  }, [color, reason, onColorSelect]);

  /** Generate options for a family based on harmony/semantic data */
  const getOptionsForFamily = useCallback(
    (family: FamilyKey): OKLCH[] => {
      if (!harmonyColors || !semanticSuggestions) return [];

      switch (family) {
        case 'secondary':
          return [harmonyColors.splitComplementary1, harmonyColors.splitComplementary2];
        case 'tertiary':
          return [harmonyColors.triadic1, harmonyColors.triadic2];
        case 'accent':
          return [harmonyColors.complementary];
        case 'highlight':
          return [harmonyColors.analogous1, harmonyColors.analogous2];
        case 'surface':
          // Surface is a desaturated version - single option
          return [{ ...color, c: color.c * 0.1, l: 0.95 }];
        case 'neutral':
          return harmonyColors.neutral ? [harmonyColors.neutral] : [];
        case 'danger':
          return semanticSuggestions.danger;
        case 'success':
          return semanticSuggestions.success;
        case 'warning':
          return semanticSuggestions.warning;
        case 'info':
          return semanticSuggestions.info;
        default:
          return [];
      }
    },
    [harmonyColors, semanticSuggestions, color],
  );

  /** Select a family and move to next (or auto-select if single option) */
  const selectFamilyAndAdvance = useCallback(
    async (
      familyIndex: number,
      selectedColor: OKLCH,
      addToSelected: (family: SelectedFamily) => void,
    ): Promise<void> => {
      const family = FAMILY_ORDER[familyIndex];
      if (!family) return;

      console.log('[Snowstorm] Family selected:', family, selectedColor);

      // Save to registry
      const familyReason = `Derived from primary: ${FAMILY_LABELS[family]}`;
      const result = await onColorSelect(selectedColor, familyReason, family);

      // Add to selected families
      const newFamily: SelectedFamily = {
        family,
        color: selectedColor,
        scale: result.colorValue?.scale || buildColorValue(selectedColor).scale,
      };
      addToSelected(newFamily);
    },
    [onColorSelect],
  );

  /** Handle family color selection */
  const handleFamilySelect = useCallback(
    async (selectedColor: OKLCH) => {
      const currentFamily = FAMILY_ORDER[currentFamilyIndex];
      if (!currentFamily || isAnimating) return;

      setIsAnimating(true);

      // Fade out picker
      if (pickerRef.current) {
        await new Promise<void>((resolve) => {
          gsap.to(pickerRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: resolve,
          });
        });
      }

      try {
        const newFamilies: SelectedFamily[] = [];
        const addFamily = (f: SelectedFamily) => newFamilies.push(f);

        // Select current family
        await selectFamilyAndAdvance(currentFamilyIndex, selectedColor, addFamily);

        // Find next family, auto-selecting single-option families
        let nextIndex = currentFamilyIndex + 1;
        while (nextIndex < FAMILY_ORDER.length) {
          const nextFamily = FAMILY_ORDER[nextIndex];
          if (!nextFamily) break;

          const options = getOptionsForFamily(nextFamily);
          if (options.length === 1 && options[0]) {
            // Auto-select single option
            await selectFamilyAndAdvance(nextIndex, options[0], addFamily);
            nextIndex++;
          } else {
            // Multiple options - stop and show picker
            break;
          }
        }

        // Update state - add new families
        setSelectedFamilies((prev) => [...prev, ...newFamilies]);

        if (nextIndex < FAMILY_ORDER.length) {
          const nextFamily = FAMILY_ORDER[nextIndex];
          if (nextFamily) {
            setCurrentFamilyIndex(nextIndex);
            setFamilyOptions(getOptionsForFamily(nextFamily));

            // Fade in new picker after a brief delay for rows to animate
            setTimeout(() => {
              if (pickerRef.current) {
                gsap.fromTo(
                  pickerRef.current,
                  { opacity: 0, scale: 0.95 },
                  { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
                );
              }
              setIsAnimating(false);
            }, 400);
          }
        } else {
          // All families complete - start collapse animation
          console.log('[Snowstorm] All families complete, starting collapse');
          setIsAnimating(false);
          setStage('collapsing');
        }
      } catch (err) {
        console.error('[Snowstorm] handleFamilySelect error:', err);
        setIsAnimating(false);
      }
    },
    [currentFamilyIndex, getOptionsForFamily, selectFamilyAndAdvance, isAnimating],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Enter submits, Shift+Enter adds newline
      if (e.key === 'Enter' && !e.shiftKey && reason.trim()) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [reason, handleSubmit],
  );

  const showCenteredCard = cardVisible && (stage === 'prompt' || stage === 'picking' || stage === 'why');
  const showFamilySelection = stage === 'family-select';
  const currentFamily = FAMILY_ORDER[currentFamilyIndex];

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

      {/* Selected family rows - shows during family-select and collapsing stages */}
      {(showFamilySelection || stage === 'collapsing') && (
        <div
          ref={rowsContainerRef}
          className={classy('fixed', 'flex', 'flex-col', 'gap-4')}
          style={{ top: 24, left: 24 }}
        >
          {selectedFamilies.map((selected) => (
            <FamilyRow key={selected.family} selected={selected} />
          ))}

          {/* Glass blur overlay when showing choices */}
          {showFamilySelection && selectedFamilies.length > 0 && (
            <div
              className={classy(
                'absolute',
                'inset-0',
                'backdrop-blur-sm',
                'bg-background/30',
                'rounded-lg',
              )}
            />
          )}
        </div>
      )}

      {/* Final collapsed row - single row of 64px boxes with labels */}
      {stage === 'done' && (
        <FinalColorRow families={selectedFamilies} />
      )}

      {/* Centered card */}
      {showCenteredCard && (
        <div
          className={classy(
            'absolute',
            'inset-0',
            'flex',
            'items-center',
            'justify-center',
            'z-10',
          )}
        >
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
                  <div className={classy('w-full', 'space-y-4')}>
                    {/* Color swatch - visual anchor */}
                    <div
                      className={classy('w-12', 'h-12', 'rounded-lg', 'mx-auto', 'shadow-sm')}
                      style={{ backgroundColor: oklchToHex(color) }}
                    />

                    {/* Soft prompt */}
                    <P className={classy('text-muted-foreground', 'text-sm')}>
                      What drew you to this?
                    </P>

                    {/* Textarea with simple placeholder */}
                    <Textarea
                      ref={textareaRef}
                      placeholder="A few words is fine..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={handleTextareaFocus}
                      size="sm"
                      className={classy('resize-none', 'text-center')}
                      rows={2}
                    />

                    {/* Inspiration chips */}
                    <div className={classy('flex', 'flex-wrap', 'gap-1.5', 'justify-center')}>
                      {INSPIRATION_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleChipClick(chip)}
                          className={classy(
                            'px-2',
                            'py-0.5',
                            'text-xs',
                            'rounded-full',
                            'bg-muted/50',
                            'text-muted-foreground',
                            'hover:bg-muted',
                            'transition-colors',
                          )}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>

                    {/* Continue button */}
                    <Button
                      onClick={() => {
                        console.log('[Snowstorm] Button onClick fired');
                        handleSubmit();
                      }}
                      disabled={!reason.trim()}
                      className={classy('w-full')}
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Family selection - centered, large swatches */}
      {showFamilySelection && currentFamily && (
        <div
          className={classy(
            'fixed',
            'inset-0',
            'flex',
            'items-center',
            'justify-center',
            'z-20',
          )}
        >
          <FamilyPicker
            ref={pickerRef}
            family={currentFamily}
            options={familyOptions}
            onSelect={handleFamilySelect}
            disabled={isAnimating}
          />
        </div>
      )}

      {/* Completion message */}
      {stage === 'done' && (
        <div
          className={classy(
            'fixed',
            'bottom-8',
            'left-1/2',
            '-translate-x-1/2',
            'z-20',
          )}
        >
          <Card className={classy('backdrop-blur-sm', 'shadow-lg', 'border-0')}>
            <CardContent className={classy('p-6', 'text-center')}>
              <P className={classy('font-medium', 'mb-2')}>
                Your color system is ready
              </P>
              <P className={classy('text-muted-foreground', 'text-sm')}>
                {selectedFamilies.length} families configured
              </P>
            </CardContent>
          </Card>
        </div>
      )}
    </Container>
  );
}
