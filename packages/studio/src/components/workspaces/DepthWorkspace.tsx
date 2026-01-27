/**
 * Depth Workspace
 *
 * 3D paper stack at 33-degree edge. Layers slide out on hover showing name.
 * Semantic stacking levels, not a mathematical progression.
 */

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Token } from '../../api/token-loader';
import { fetchAllTokens, tokenKeys } from '../../lib/query';
import { EducationalHeader } from '../shared/EducationalHeader';

const DEPTH_LEVELS = [
  { name: 'base', value: 0, shadow: 'none' },
  { name: 'dropdown', value: 10, shadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  { name: 'sticky', value: 20, shadow: '0 4px 12px -2px rgba(0,0,0,0.12)' },
  { name: 'fixed', value: 30, shadow: '0 8px 16px -4px rgba(0,0,0,0.15)' },
  { name: 'modal', value: 40, shadow: '0 12px 28px -6px rgba(0,0,0,0.2)' },
  { name: 'popover', value: 50, shadow: '0 16px 36px -8px rgba(0,0,0,0.22)' },
  { name: 'tooltip', value: 60, shadow: '0 20px 44px -10px rgba(0,0,0,0.25)' },
];

function parseShadowToken(token: Token): string | null {
  if (typeof token.value === 'string' && token.value.includes('px')) {
    return token.value;
  }
  return null;
}

export function DepthWorkspace() {
  const { data } = useQuery({
    queryKey: tokenKeys.all,
    queryFn: fetchAllTokens,
  });

  const shadowTokens = useMemo(() => {
    const tokens = data?.tokens.spacing || [];
    return tokens.filter(
      (t) =>
        (t.name.includes('shadow') || t.name.includes('elevation')) && parseShadowToken(t) !== null,
    );
  }, [data]);

  // Merge loaded shadow tokens with defaults
  const levels = DEPTH_LEVELS.map((level) => {
    const match = shadowTokens.find(
      (t) => t.name.includes(level.name) || t.name.includes(String(level.value)),
    );
    return {
      ...level,
      shadow: match ? (parseShadowToken(match) ?? level.shadow) : level.shadow,
    };
  });

  return (
    <div className="p-8">
      <EducationalHeader namespace="depth" title="Depth & Elevation">
        <p className="mb-2">
          Depth defines the stacking order of your interface layers. These are semantic levels, not
          a mathematical progression.
        </p>
        <p>
          Each layer has a clear purpose: base content sits at ground level, modals float above
          everything, tooltips crown the stack.
        </p>
      </EducationalHeader>

      {/* Side-by-side: 3D stack + shadow cards */}
      <div className="grid grid-cols-2 gap-12">
        {/* 3D paper stack */}
        <div className="flex items-center justify-center py-16">
          <div
            className="relative"
            style={{
              perspective: '800px',
              width: 400,
              height: 300,
            }}
          >
            {levels.map((level, i) => (
              <div
                key={level.name}
                className="group absolute rounded-lg border border-neutral-200 bg-white transition-transform hover:translate-x-16"
                style={{
                  width: 280,
                  height: 180,
                  transform: `rotateY(-33deg) translateZ(${i * 8}px)`,
                  left: i * 6,
                  top: i * 4,
                  zIndex: i,
                  boxShadow: level.shadow,
                }}
              >
                <span className="absolute bottom-2 left-3 text-xs text-transparent transition-colors group-hover:text-neutral-500">
                  {level.name} (z-{level.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shadow specimens */}
        <div className="space-y-4 py-8">
          {levels.map((level) => (
            <div key={level.name} className="flex items-center gap-4">
              <div
                className="rounded-lg bg-white"
                style={{
                  width: 64,
                  height: 40,
                  boxShadow: level.shadow,
                }}
              />
              <div>
                <span className="text-sm font-medium text-neutral-900">{level.name}</span>
                <span className="ml-2 text-xs text-neutral-400">z-index: {level.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
