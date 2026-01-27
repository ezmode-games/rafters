/**
 * Color Picker Hook
 *
 * Manages state for the OKLCH color picker.
 * No react-colorful dependency - works with custom canvas picker.
 */

import { useCallback, useMemo } from 'react';
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
  /** Current color as OKLCH */
  oklchColor: OKLCH;
  /** Current color as hex */
  hexColor: string;
  /** Whether current color is in sRGB gamut */
  inGamut: boolean;
  /** Confirm color selection */
  confirmColor: (oklch: OKLCH) => void;
}

const DEFAULT_OKLCH: OKLCH = { l: 0.5, c: 0.15, h: 250 };

export function useColorPicker({
  token,
  onColorChange,
}: UseColorPickerProps): UseColorPickerReturn {
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
    (oklch: OKLCH) => {
      const rounded = roundOKLCH(oklch);
      onColorChange?.(rounded);
    },
    [onColorChange],
  );

  return {
    oklchColor,
    hexColor: currentHex,
    inGamut,
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
