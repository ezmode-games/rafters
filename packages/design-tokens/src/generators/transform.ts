/**
 * Transform Generator
 *
 * Transform system for animations and interactions
 */

import type { Token } from '../index.js';

/**
 * Generate transform tokens for animations and interactions
 *
 * @returns Array of transform tokens with AI intelligence metadata
 */
export function generateTransformTokens(): Token[] {
  const tokens: Token[] = [];

  // Scale transforms
  const scaleTokens = [
    {
      name: 'hover',
      value: '1.02',
      meaning: 'Subtle hover scale for interactive elements',
      cognitiveLoad: 2,
      trustLevel: 'low' as const,
      usage: ['button-hover', 'card-hover', 'interactive-feedback'],
    },
    {
      name: 'active',
      value: '0.98',
      meaning: 'Active/pressed scale for buttons',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
      usage: ['button-active', 'pressed-state', 'click-feedback'],
    },
    {
      name: 'focus',
      value: '1.05',
      meaning: 'Focus scale for accessibility',
      cognitiveLoad: 3,
      trustLevel: 'low' as const,
      usage: ['focus-states', 'accessibility', 'keyboard-navigation'],
    },
    {
      name: 'disabled',
      value: '0.95',
      meaning: 'Disabled state scale',
      cognitiveLoad: 1,
      trustLevel: 'low' as const,
      usage: ['disabled-elements', 'inactive-state', 'unavailable'],
    },
    {
      name: 'emphasis',
      value: '1.1',
      meaning: 'Emphasis scale for important elements',
      cognitiveLoad: 4,
      trustLevel: 'medium' as const,
      usage: ['call-to-action', 'important-buttons', 'emphasis'],
    },
    {
      name: 'dramatic',
      value: '1.25',
      meaning: 'Dramatic scale for animations',
      cognitiveLoad: 7,
      trustLevel: 'high' as const,
      usage: ['hero-animations', 'dramatic-effects', 'attention-grabbing'],
    },
  ];

  for (let index = 0; index < scaleTokens.length; index++) {
    const scale = scaleTokens[index];
    tokens.push({
      name: scale.name,
      value: scale.value,
      category: 'scale',
      namespace: 'scale',
      semanticMeaning: scale.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['button', 'card', 'interactive'],
      interactionType:
        scale.name === 'hover'
          ? 'hover'
          : scale.name === 'active'
            ? 'active'
            : scale.name === 'focus'
              ? 'focus'
              : scale.name === 'disabled'
                ? 'disabled'
                : undefined,
      accessibilityLevel: 'AAA',
      cognitiveLoad: scale.cognitiveLoad,
      trustLevel: scale.trustLevel,
      consequence: scale.trustLevel === 'high' ? 'significant' : 'reversible',
      usageContext: scale.usage,
    });
  }

  // Translate transforms
  const translateTokens = [
    {
      name: 'center',
      value: '-50%',
      meaning: 'Center positioning transform',
      cognitiveLoad: 2,
      usage: ['absolute-center', 'modal-center', 'tooltip-position'],
    },
    {
      name: 'center-x',
      value: '-50%, 0',
      meaning: 'Center horizontally',
      cognitiveLoad: 3,
      usage: ['horizontal-center', 'x-axis-center', 'left-right-center'],
    },
    {
      name: 'center-y',
      value: '0, -50%',
      meaning: 'Center vertically',
      cognitiveLoad: 3,
      usage: ['vertical-center', 'y-axis-center', 'top-bottom-center'],
    },
    {
      name: 'slide-up',
      value: '0, -100%',
      meaning: 'Slide up animation',
      cognitiveLoad: 4,
      usage: ['slide-animations', 'reveal-up', 'drawer-slide'],
    },
    {
      name: 'slide-down',
      value: '0, 100%',
      meaning: 'Slide down animation',
      cognitiveLoad: 4,
      usage: ['dropdown-reveal', 'slide-down', 'menu-animations'],
    },
    {
      name: 'slide-left',
      value: '-100%, 0',
      meaning: 'Slide left animation',
      cognitiveLoad: 4,
      usage: ['sidebar-slide', 'left-reveal', 'navigation'],
    },
    {
      name: 'slide-right',
      value: '100%, 0',
      meaning: 'Slide right animation',
      cognitiveLoad: 4,
      usage: ['right-reveal', 'slide-right', 'panel-animations'],
    },
  ];

  for (let index = 0; index < translateTokens.length; index++) {
    const translate = translateTokens[index];
    tokens.push({
      name: translate.name,
      value: translate.value,
      category: 'translate',
      namespace: 'translate',
      semanticMeaning: translate.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['modal', 'dialog', 'tooltip', 'animations'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: translate.cognitiveLoad,
      trustLevel: 'low' as const,
      consequence: 'reversible',
      usageContext: translate.usage,
    });
  }

  // Rotate transforms
  const rotateTokens = [
    {
      name: 'flip',
      value: '180deg',
      meaning: 'Flip rotation for icons and arrows',
      cognitiveLoad: 2,
      usage: ['icon-flip', 'arrow-rotation', 'toggle-states'],
    },
    {
      name: 'quarter',
      value: '90deg',
      meaning: 'Quarter turn rotation',
      cognitiveLoad: 3,
      usage: ['quarter-turn', 'icon-rotate', 'chevron-rotation'],
    },
    {
      name: 'half',
      value: '180deg',
      meaning: 'Half turn rotation',
      cognitiveLoad: 2,
      usage: ['half-turn', 'flip-animation', 'state-toggle'],
    },
    {
      name: 'three-quarter',
      value: '270deg',
      meaning: 'Three quarter turn rotation',
      cognitiveLoad: 4,
      usage: ['three-quarter-turn', 'complex-rotation', 'advanced-animations'],
    },
  ];

  for (let index = 0; index < rotateTokens.length; index++) {
    const rotate = rotateTokens[index];
    tokens.push({
      name: rotate.name,
      value: rotate.value,
      category: 'rotate',
      namespace: 'rotate',
      semanticMeaning: rotate.meaning,
      scalePosition: index,
      generateUtilityClass: true,
      applicableComponents: ['icon', 'arrow', 'dropdown'],
      accessibilityLevel: 'AAA',
      cognitiveLoad: rotate.cognitiveLoad,
      trustLevel: 'low' as const,
      consequence: 'reversible',
      usageContext: rotate.usage,
    });
  }

  return tokens;
}
