/**
 * Snowstorm - First Run Entry Point
 *
 * Visual representation of blank page anxiety. A gentle snowstorm of particles
 * on a white canvas, with a centered invitation to choose the primary color.
 *
 * Click anywhere to capture a color from that position (hue derived from x,
 * lightness from y). A WhyGate appears requiring the designer to explain
 * their choice before proceeding.
 *
 * Uses GSAP for smooth 60fps particle animations.
 * Uses @rafters/ui components and classy for dogfooding.
 * Canvas reads token colors from CSS custom properties.
 */

import { Card, CardContent } from '@rafters/ui/components/ui/card';
import { Container } from '@rafters/ui/components/ui/container';
import { P } from '@rafters/ui/components/ui/typography';
import classy from '@rafters/ui/primitives/classy';
import gsap from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ColorPicker, type ColorPickerColor } from './ColorPicker';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface SnowstormProps {
  onColorSelect: (color: { h: number; s: number; l: number }, reason: string) => void;
}

interface PendingSelection {
  color: ColorPickerColor;
  position: { x: number; y: number };
}

/**
 * Convert canvas position to OKLCH-ish color
 * x = hue (0-360), y = lightness (0.3-0.9 inverted)
 */
function positionToColor(
  x: number,
  y: number,
  width: number,
  height: number,
): { h: number; s: number; l: number } {
  const h = (x / width) * 360;
  // y=0 (top) = light, y=height (bottom) = dark
  const l = 0.9 - (y / height) * 0.6;
  // Fixed chroma for vivid colors
  const s = 0.15;
  return { h, s, l };
}

export function Snowstorm({ onColorSelect }: SnowstormProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const tickerRef = useRef<gsap.Callback | null>(null);

  // State for color picker (WhyGate flow)
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);

  // Initialize and run GSAP animations
  useEffect(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.5 + 0.2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    particlesRef.current = particles;

    // Read token colors from CSS custom properties
    const computedStyle = getComputedStyle(document.documentElement);
    const bgColor = computedStyle.getPropertyValue('--color-background').trim() || 'oklch(1 0 0)';
    const mutedColor = computedStyle.getPropertyValue('--color-muted').trim() || 'oklch(0.9 0 0)';

    // GSAP ticker for particle animation (synced to refresh rate)
    const drawParticles = () => {
      // Clear with background token color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Draw and update particles using muted token
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = mutedColor;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y > height) {
          p.y = -p.size;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
      }
    };

    tickerRef.current = drawParticles;
    gsap.ticker.add(drawParticles);

    // Gentle floating animation - subtle vertical movement
    const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatTl.to(box, {
      y: 15,
      duration: 3,
      ease: 'sine.inOut',
    });

    return () => {
      if (tickerRef.current) {
        gsap.ticker.remove(tickerRef.current);
      }
      floatTl.kill();
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      // Don't capture new color if picker is open
      if (pendingSelection) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const color = positionToColor(x, y, rect.width, rect.height);

      // Show ColorPicker anchored to click position
      setPendingSelection({
        color,
        position: { x: e.clientX, y: e.clientY },
      });
    },
    [pendingSelection],
  );

  const handleColorConfirm = useCallback(
    (color: ColorPickerColor, reason: string) => {
      setPendingSelection(null);
      onColorSelect(color, reason);
    },
    [onColorSelect],
  );

  const handleColorCancel = useCallback(() => {
    setPendingSelection(null);
  }, []);

  return (
    <Container
      as="main"
      size="full"
      className={classy('relative', 'h-screen', 'overflow-hidden', 'bg-background')}
    >
      <canvas
        ref={canvasRef}
        className={classy('absolute', 'inset-0', 'h-full', 'w-full', 'cursor-crosshair')}
        onClick={handleClick}
      />

      {/* Large centered invitation card with gentle float - hidden when picking */}
      {!pendingSelection && (
        <div
          className={classy(
            'pointer-events-none',
            'absolute',
            'inset-0',
            'flex',
            'items-center',
            'justify-center',
          )}
        >
          <div ref={boxRef}>
            <Card
              className={classy(
                'bg-card/90',
                'backdrop-blur-sm',
                'shadow-lg',
                'h-64',
                'w-64',
                'flex',
                'items-center',
                'justify-center',
              )}
            >
              <CardContent className={classy('text-center')}>
                <P>Choose Your Primary Color</P>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ColorPicker with WhyGate - appears on click */}
      {pendingSelection && (
        <ColorPicker
          color={pendingSelection.color}
          anchorPosition={pendingSelection.position}
          onConfirm={handleColorConfirm}
          onCancel={handleColorCancel}
        />
      )}
    </Container>
  );
}
