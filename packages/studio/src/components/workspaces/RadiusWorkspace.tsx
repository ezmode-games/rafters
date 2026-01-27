/**
 * Radius Workspace
 *
 * Rounded boxes with a simple dial control.
 * Derives from spacing.
 */

import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import type { Token } from '../../api/token-loader';
import { fetchAllTokens, tokenKeys } from '../../lib/query';
import { EducationalHeader } from '../shared/EducationalHeader';

function parseRadiusValue(token: Token): number | null {
  const value = typeof token.value === 'string' ? token.value : String(token.value);
  const remMatch = value.match(/^([\d.]+)rem$/);
  if (remMatch) return Number.parseFloat(remMatch[1]) * 16;
  const pxMatch = value.match(/^([\d.]+)px$/);
  if (pxMatch) return Number.parseFloat(pxMatch[1]);
  return null;
}

const PREVIEW_SIZES = [48, 64, 96, 128];

function RadiusPreview({ radius, size }: { radius: number; size: number }) {
  return (
    <div
      className="border-2 border-neutral-900 bg-neutral-50 transition-all"
      style={{
        width: size,
        height: size,
        borderRadius: Math.min(radius, size / 2),
      }}
    />
  );
}

function RadiusDial({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      el.setPointerCapture(e.pointerId);

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const update = (clientX: number, clientY: number) => {
        const angle = Math.atan2(clientY - cy, clientX - cx);
        // Map -PI..PI to 0..32 range (clamped)
        const normalized = (angle + Math.PI) / (2 * Math.PI);
        const px = Math.round(Math.max(0, Math.min(32, normalized * 32)));
        onChange(px);
      };

      update(e.clientX, e.clientY);

      const onMove = (ev: PointerEvent) => update(ev.clientX, ev.clientY);
      const onUp = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
    },
    [onChange],
  );

  // Angle for the indicator dot
  const angle = (value / 32) * 2 * Math.PI - Math.PI;
  const dotX = 40 + Math.cos(angle) * 30;
  const dotY = 40 + Math.sin(angle) * 30;

  return (
    <div className="flex items-center gap-4">
      <div
        role="slider"
        aria-label="Radius dial"
        aria-valuemin={0}
        aria-valuemax={32}
        aria-valuenow={value}
        tabIndex={0}
        className="relative cursor-pointer"
        style={{ width: 80, height: 80 }}
        onPointerDown={handlePointerDown}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            onChange(Math.min(32, value + 1));
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            onChange(Math.max(0, value - 1));
          }
        }}
      >
        <svg
          viewBox="0 0 80 80"
          className="h-full w-full"
          role="img"
          aria-label="Radius dial indicator"
        >
          <circle cx="40" cy="40" r="30" fill="none" stroke="#e5e5e5" strokeWidth="4" />
          <circle
            cx="40"
            cy="40"
            r="30"
            fill="none"
            stroke="#171717"
            strokeWidth="4"
            strokeDasharray={`${(value / 32) * 188.5} 188.5`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
          <circle cx={dotX} cy={dotY} r="5" fill="#171717" />
        </svg>
      </div>
      <span className="text-lg font-medium text-neutral-900">{value}px</span>
    </div>
  );
}

export function RadiusWorkspace() {
  const { data } = useQuery({
    queryKey: tokenKeys.all,
    queryFn: fetchAllTokens,
  });

  const [customRadius, setCustomRadius] = useState(8);

  const radiusTokens = useMemo(() => {
    const tokens = data?.tokens.spacing || [];
    return tokens
      .filter((t) => t.name.includes('radius') || t.name.includes('rounded'))
      .filter((t) => parseRadiusValue(t) !== null)
      .sort((a, b) => (parseRadiusValue(a) ?? 0) - (parseRadiusValue(b) ?? 0));
  }, [data]);

  // Use token values if available, otherwise show dial-driven preview
  const radii =
    radiusTokens.length > 0
      ? radiusTokens.map((t) => parseRadiusValue(t) ?? 0)
      : [0, 2, 4, customRadius, customRadius * 2, 9999];

  const labels =
    radiusTokens.length > 0
      ? radiusTokens.map((t) => t.name.replace('radius-', '').replace('rounded-', ''))
      : ['none', 'sm', 'md', 'lg', 'xl', 'full'];

  return (
    <div className="p-8">
      <EducationalHeader namespace="radius" title="Border Radius">
        <p className="mb-2">
          Border radius derives from the spacing base unit. This ensures your corners feel
          proportional to your spatial rhythm.
        </p>
        <p>
          Use the dial to adjust the radius scale factor. All corners in the system update in
          real-time.
        </p>
      </EducationalHeader>

      {radiusTokens.length === 0 && (
        <div className="mb-8">
          <RadiusDial value={customRadius} onChange={setCustomRadius} />
        </div>
      )}

      <div className="space-y-8">
        {radii.map((r, i) => (
          <div key={labels[i]} className="flex items-center gap-6">
            <span className="w-16 text-right text-sm text-neutral-400">{labels[i]}</span>
            <div className="flex items-end gap-4">
              {PREVIEW_SIZES.map((size) => (
                <RadiusPreview key={size} radius={r} size={size} />
              ))}
            </div>
            <span className="text-xs text-neutral-300">{r >= 9999 ? 'full' : `${r}px`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
