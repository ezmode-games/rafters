/**
 * Color Context Menu
 *
 * Right-click on a color swatch to adjust L/C/H independently.
 * Each slider shows live preview of the change.
 * Requires a "why" reason before committing.
 */

import { useCallback, useState } from 'react';
import type { OKLCH } from '../../utils/color-conversion';
import { oklchToHex } from '../../utils/color-conversion';
import { WhyGate } from '../shared/WhyGate';
import { CascadePreview } from './CascadePreview';
import { ContextMenu, ContextMenuDivider, type ContextMenuPosition } from './ContextMenu';

interface ColorContextMenuProps {
  position: ContextMenuPosition | null;
  onClose: () => void;
  color: OKLCH;
  tokenName: string;
  existingReason?: string;
  onCommit: (color: OKLCH, reason: string) => void;
  onReasonEdit?: (reason: string) => void;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function OKLCHSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  renderBackground,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  renderBackground?: string;
}) {
  return (
    <div className="px-3 py-1">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-neutral-500">{label}</span>
        <span className="text-xs font-mono text-neutral-400">{value.toFixed(3)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number.parseFloat(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: renderBackground ?? '#e5e5e5',
        }}
      />
    </div>
  );
}

export function ColorContextMenu({
  position,
  onClose,
  color,
  tokenName,
  existingReason,
  onCommit,
  onReasonEdit,
}: ColorContextMenuProps) {
  const [adjusted, setAdjusted] = useState<OKLCH>({ ...color });
  const [step, setStep] = useState<'adjust' | 'cascade' | 'why' | 'editReason'>('adjust');

  const handleLChange = useCallback(
    (l: number) => setAdjusted((c) => ({ ...c, l: clamp(l, 0, 1) })),
    [],
  );
  const handleCChange = useCallback(
    (c: number) => setAdjusted((prev) => ({ ...prev, c: clamp(c, 0, 0.4) })),
    [],
  );
  const handleHChange = useCallback(
    (h: number) => setAdjusted((c) => ({ ...c, h: clamp(h, 0, 360) })),
    [],
  );

  const handleCommit = useCallback(
    (reason: string) => {
      onCommit(adjusted, reason);
      onClose();
    },
    [adjusted, onCommit, onClose],
  );

  const handleCascadeUpdateAll = useCallback(() => {
    setStep('why');
  }, []);

  const handleCascadeCancel = useCallback(() => {
    setStep('adjust');
  }, []);

  const handleReasonEditCommit = useCallback(
    (reason: string) => {
      onReasonEdit?.(reason);
      onClose();
    },
    [onReasonEdit, onClose],
  );

  let previewHex: string;
  try {
    previewHex = oklchToHex(adjusted);
  } catch {
    previewHex = '#808080';
  }

  let originalHex: string;
  try {
    originalHex = oklchToHex(color);
  } catch {
    originalHex = '#808080';
  }

  return (
    <ContextMenu position={position} onClose={onClose}>
      {/* Token name header */}
      <div className="px-3 py-2">
        <span className="text-xs font-medium text-neutral-900">{tokenName}</span>
      </div>

      {/* Existing reason display + edit option */}
      {existingReason && step !== 'editReason' && (
        <>
          <div className="px-3 py-1">
            <p className="text-xs italic text-neutral-500 line-clamp-2">
              &ldquo;{existingReason}&rdquo;
            </p>
          </div>
          {onReasonEdit && (
            <button
              type="button"
              className="w-full px-3 py-1.5 text-left text-xs text-neutral-600 hover:bg-neutral-50"
              onClick={() => setStep('editReason')}
            >
              Edit reasoning...
            </button>
          )}
        </>
      )}
      <ContextMenuDivider />

      {/* Preview swatches */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="rounded-md" style={{ width: 32, height: 32, backgroundColor: originalHex }}>
          <span className="sr-only">Original color</span>
        </div>
        <span className="text-xs text-neutral-400">-&gt;</span>
        <div className="rounded-md" style={{ width: 32, height: 32, backgroundColor: previewHex }}>
          <span className="sr-only">Adjusted color</span>
        </div>
        <span className="ml-auto font-mono text-xs text-neutral-400">{previewHex}</span>
      </div>
      <ContextMenuDivider />

      {/* L/C/H sliders */}
      <OKLCHSlider
        label="Lightness"
        value={adjusted.l}
        min={0}
        max={1}
        step={0.005}
        onChange={handleLChange}
        renderBackground="linear-gradient(to right, #000, #fff)"
      />
      <OKLCHSlider
        label="Chroma"
        value={adjusted.c}
        min={0}
        max={0.4}
        step={0.002}
        onChange={handleCChange}
      />
      <OKLCHSlider
        label="Hue"
        value={adjusted.h}
        min={0}
        max={360}
        step={1}
        onChange={handleHChange}
        renderBackground="linear-gradient(to right, oklch(0.7 0.15 0), oklch(0.7 0.15 60), oklch(0.7 0.15 120), oklch(0.7 0.15 180), oklch(0.7 0.15 240), oklch(0.7 0.15 300), oklch(0.7 0.15 360))"
      />
      <ContextMenuDivider />

      {/* Step flow: adjust -> cascade -> why */}
      {step === 'adjust' && (
        <button
          type="button"
          className="w-full px-3 py-2 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50"
          onClick={() => setStep('cascade')}
        >
          Apply change...
        </button>
      )}
      {step === 'cascade' && (
        <>
          <ContextMenuDivider />
          <CascadePreview
            tokenName={tokenName}
            onUpdateAll={handleCascadeUpdateAll}
            onCancel={handleCascadeCancel}
          />
        </>
      )}
      {step === 'why' && (
        <div className="px-3 py-2">
          <WhyGate onCommit={handleCommit} />
        </div>
      )}
      {step === 'editReason' && (
        <div className="px-3 py-2">
          <WhyGate onCommit={handleReasonEditCommit} initialValue={existingReason} />
        </div>
      )}
    </ContextMenu>
  );
}
