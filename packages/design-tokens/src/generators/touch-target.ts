/**
 * Touch Target Generator - Rafters-Enhanced Tokens
 *
 * WCAG compliance tokens with accessibility intelligence
 * Provides meaningful sizing (touch-minimum vs w-11) for interactive elements
 */

import type { Token } from '../index';

export function generateTouchTargetTokens(): Token[] {
  const tokens: Token[] = [];

  const touchTargets = [
    {
      name: 'compact',
      value: '32px',
      meaning: 'Compact touch target - below accessibility guidelines',
      accessible: false,
      usage: ['dense-ui', 'desktop-only', 'secondary-actions'],
    },
    {
      name: 'standard',
      value: '44px',
      meaning: 'Standard touch target - meets WCAG AAA guidelines',
      accessible: true,
      usage: ['buttons', 'links', 'interactive-elements'],
    },
    {
      name: 'comfortable',
      value: '48px',
      meaning: 'Comfortable touch target - exceeds guidelines',
      accessible: true,
      usage: ['primary-actions', 'important-buttons'],
    },
    {
      name: 'large',
      value: '56px',
      meaning: 'Large touch target - excellent for accessibility',
      accessible: true,
      usage: ['hero-buttons', 'cta', 'mobile-primary'],
    },
  ];

  touchTargets.forEach((target, index) => {
    tokens.push({
      name: target.name,
      value: target.value,
      category: 'touch-target',
      namespace: 'touch',
      semanticMeaning: target.meaning,
      scalePosition: index,
      touchTargetSize: Number.parseInt(target.value, 10),
      generateUtilityClass: true,
      applicableComponents: ['button', 'input', 'link', 'checkbox', 'radio'],
      accessibilityLevel: target.accessible ? 'AAA' : 'AA',
      cognitiveLoad: 2,
      trustLevel: 'medium',
      consequence: 'significant',
      usageContext: target.usage,
    });
  });

  return tokens;
}
