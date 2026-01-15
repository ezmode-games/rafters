/**
 * Color Picker Hook
 *
 * Manages state for the spectrum color picker with OKLCH conversion.
 */

import { useCallback, useMemo, useState } from 'react';
import type { Token } from '../api/token-loader';
import {
  hexToOKLCH,
  isInGamut,
  type OKLCH,
  oklchToHex,
  roundOKLCH,
} from '../utils/color-conversion';
import { getTokenCssValue } from '../utils/token-display';

interface UseColorPickerProps {
  token: Token | null;
  onColorChange?: (oklch: OKLCH) => void;
}

interface UseColorPickerReturn {
  /** Current color as hex for react-colorful */
  hexColor: string;
  /** Current color as OKLCH */
  oklchColor: OKLCH;
  /** Whether current color is in sRGB gamut */
  inGamut: boolean;
  /** Preview color while exploring (before confirmation) */
  previewHex: string | null;
  /** Set preview color (hover/drag state) */
  setPreviewHex: (hex: string | null) => void;
  /** Confirm the preview color as the new value */
  confirmColor: (hex: string) => void;
}

const DEFAULT_OKLCH: OKLCH = { l: 0.5, c: 0.15, h: 250 };

export function useColorPicker({
  token,
  onColorChange,
}: UseColorPickerProps): UseColorPickerReturn {
  const [previewHex, setPreviewHex] = useState<string | null>(null);

  // Get current hex from token
  const currentHex = useMemo(() => {
    if (!token) return '#808080';
    return getTokenCssValue(token);
  }, [token]);

  // Convert current hex to OKLCH
  const oklchColor = useMemo(() => {
    try {
      return hexToOKLCH(currentHex);
    } catch {
      return DEFAULT_OKLCH;
    }
  }, [currentHex]);

  // Check gamut status
  const inGamut = useMemo(() => {
    return isInGamut(oklchColor);
  }, [oklchColor]);

  // Confirm color selection
  const confirmColor = useCallback(
    (hex: string) => {
      try {
        const oklch = roundOKLCH(hexToOKLCH(hex));
        onColorChange?.(oklch);
        setPreviewHex(null);
      } catch {
        // Invalid color, ignore
      }
    },
    [onColorChange],
  );

  return {
    hexColor: currentHex,
    oklchColor,
    inGamut,
    previewHex,
    setPreviewHex,
    confirmColor,
  };
}

/**
 * Convert OKLCH from token back to hex for display
 */
export function tokenOklchToHex(oklch: OKLCH): string {
  try {
    return oklchToHex(oklch);
  } catch {
    return '#808080';
  }
}
