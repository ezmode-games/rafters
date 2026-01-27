/**
 * Custom OKLCH Color Picker
 *
 * Two canvases:
 * 1. Hue strip (horizontal, 0-360)
 * 2. L/C plane (vertical = lightness, horizontal = chroma)
 *
 * No react-colorful. Pure canvas + pointer events + @rafters/color-utils.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { isInGamut, type OKLCH, oklchToCSS, oklchToHex } from '../../utils/color-conversion';

interface OKLCHPickerProps {
  initialColor?: OKLCH;
  onSelect: (color: OKLCH) => void;
  onChange?: (color: OKLCH) => void;
}

const HUE_HEIGHT = 24;
const PLANE_SIZE = 280;
const MAX_CHROMA = 0.4;

export function OKLCHPicker({ initialColor, onSelect, onChange }: OKLCHPickerProps) {
  const [hue, setHue] = useState(initialColor?.h ?? 250);
  const [lightness, setLightness] = useState(initialColor?.l ?? 0.55);
  const [chroma, setChroma] = useState(initialColor?.c ?? 0.15);

  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const planeCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef<'hue' | 'plane' | null>(null);

  const currentColor: OKLCH = { l: lightness, c: chroma, h: hue };
  const inGamut = isInGamut(currentColor);

  // Draw hue strip
  useEffect(() => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    for (let x = 0; x < width; x++) {
      const h = (x / width) * 360;
      ctx.fillStyle = `oklch(0.7 0.15 ${h})`;
      ctx.fillRect(x, 0, 1, height);
    }

    // Draw indicator
    const indicatorX = (hue / 360) * width;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(indicatorX - 3, 0, 6, height, 2);
    ctx.stroke();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(indicatorX - 2, 1, 4, height - 2, 1);
    ctx.stroke();
  }, [hue]);

  // Draw L/C plane
  useEffect(() => {
    const canvas = planeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const l = 1 - y / height;
        const c = (x / width) * MAX_CHROMA;
        const color: OKLCH = { l, c, h: hue };

        let r = 0;
        let g = 0;
        let b = 0;
        let a = 255;

        if (isInGamut(color)) {
          try {
            const hex = oklchToHex(color);
            r = Number.parseInt(hex.slice(1, 3), 16);
            g = Number.parseInt(hex.slice(3, 5), 16);
            b = Number.parseInt(hex.slice(5, 7), 16);
          } catch {
            a = 40;
          }
        } else {
          // Out of gamut: dimmed
          r = g = b = Math.round(l * 200);
          a = 40;
        }

        const i = (y * width + x) * 4;
        imageData.data[i] = r;
        imageData.data[i + 1] = g;
        imageData.data[i + 2] = b;
        imageData.data[i + 3] = a;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw crosshair at current position
    const cx = (chroma / MAX_CHROMA) * width;
    const cy = (1 - lightness) * height;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.stroke();
  }, [hue, lightness, chroma]);

  // Notify parent of changes
  useEffect(() => {
    onChange?.({ l: lightness, c: chroma, h: hue });
  }, [lightness, chroma, hue, onChange]);

  const handleHuePointer = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHue(Math.round(x * 360));
  }, []);

  const handlePlanePointer = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setChroma(Math.round(x * MAX_CHROMA * 1000) / 1000);
    setLightness(Math.round((1 - y) * 1000) / 1000);
  }, []);

  const handlePointerDown = useCallback(
    (target: 'hue' | 'plane') => (e: React.PointerEvent<HTMLCanvasElement>) => {
      dragging.current = target;
      e.currentTarget.setPointerCapture(e.pointerId);
      if (target === 'hue') handleHuePointer(e);
      else handlePlanePointer(e);
    },
    [handleHuePointer, handlePlanePointer],
  );

  const handlePointerMove = useCallback(
    (target: 'hue' | 'plane') => (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (dragging.current !== target) return;
      if (target === 'hue') handleHuePointer(e);
      else handlePlanePointer(e);
    },
    [handleHuePointer, handlePlanePointer],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  let previewHex: string;
  try {
    previewHex = oklchToHex(currentColor);
  } catch {
    previewHex = '#808080';
  }

  return (
    <div className="flex flex-col gap-4">
      {/* L/C Plane */}
      <canvas
        ref={planeCanvasRef}
        width={PLANE_SIZE}
        height={PLANE_SIZE}
        className="cursor-crosshair rounded-lg"
        style={{ width: PLANE_SIZE, height: PLANE_SIZE }}
        onPointerDown={handlePointerDown('plane')}
        onPointerMove={handlePointerMove('plane')}
        onPointerUp={handlePointerUp}
      />

      {/* Hue Strip */}
      <canvas
        ref={hueCanvasRef}
        width={PLANE_SIZE}
        height={HUE_HEIGHT}
        className="cursor-pointer rounded"
        style={{ width: PLANE_SIZE, height: HUE_HEIGHT }}
        onPointerDown={handlePointerDown('hue')}
        onPointerMove={handlePointerMove('hue')}
        onPointerUp={handlePointerUp}
      />

      {/* Preview + Commit */}
      <div className="flex items-center gap-4">
        <div
          className="h-12 w-12 rounded-lg border border-neutral-200"
          style={{ backgroundColor: previewHex }}
        />
        <div className="flex flex-col text-xs text-neutral-500">
          <span>{oklchToCSS(currentColor)}</span>
          <span>{previewHex}</span>
          {!inGamut && <span className="text-amber-600">Outside sRGB gamut</span>}
        </div>
        <button
          type="button"
          onClick={() => onSelect(currentColor)}
          className={[
            'ml-auto rounded-lg px-6 py-2',
            'text-sm font-medium',
            'bg-neutral-900 text-white',
            'hover:bg-neutral-800',
            'transition-colors',
          ].join(' ')}
        >
          Pick this color
        </button>
      </div>
    </div>
  );
}
