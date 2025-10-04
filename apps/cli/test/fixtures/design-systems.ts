/**
 * Design System Test Fixtures
 *
 * Creates realistic design system data using actual color generators and patterns
 * for testing cross-system pattern recognition capabilities.
 */

import type { OKLCH } from '@rafters/shared';
import { generateOKLCHScale } from '@rafters/shared';

// Base color palette for Material Design
const MATERIAL_COLORS = {
  primary: { l: 0.55, c: 0.18, h: 210 } as OKLCH,
  secondary: { l: 0.45, c: 0.15, h: 270 } as OKLCH,
  error: { l: 0.5, c: 0.25, h: 25 } as OKLCH,
  warning: { l: 0.7, c: 0.2, h: 85 } as OKLCH,
  success: { l: 0.6, c: 0.2, h: 140 } as OKLCH,
  surface: { l: 0.98, c: 0.01, h: 210 } as OKLCH,
};

// Base color palette for Ant Design
const ANT_COLORS = {
  primary: { l: 0.52, c: 0.22, h: 200 } as OKLCH,
  secondary: { l: 0.48, c: 0.18, h: 250 } as OKLCH,
  error: { l: 0.55, c: 0.28, h: 20 } as OKLCH,
  warning: { l: 0.75, c: 0.25, h: 80 } as OKLCH,
  success: { l: 0.58, c: 0.18, h: 135 } as OKLCH,
  surface: { l: 0.96, c: 0.02, h: 200 } as OKLCH,
};

// Base color palette for Carbon Design
const CARBON_COLORS = {
  primary: { l: 0.45, c: 0.15, h: 220 } as OKLCH,
  secondary: { l: 0.4, c: 0.12, h: 280 } as OKLCH,
  error: { l: 0.48, c: 0.22, h: 15 } as OKLCH,
  warning: { l: 0.68, c: 0.18, h: 75 } as OKLCH,
  success: { l: 0.55, c: 0.16, h: 145 } as OKLCH,
  surface: { l: 0.94, c: 0.015, h: 220 } as OKLCH,
};

/**
 * Generate a complete design system with realistic color scales
 */
function generateDesignSystem(
  name: string,
  version: string,
  baseColors: Record<string, OKLCH>,
  components: string[],
  patterns: string[]
) {
  const colors = Object.entries(baseColors).map(([colorName, baseColor]) => ({
    name: colorName,
    scale: Object.values(generateOKLCHScale(baseColor)), // Convert object to array
  }));

  return {
    name,
    version,
    colors,
    components,
    patterns,
  };
}

/**
 * Material Design System fixture
 */
export const materialDesignSystem = generateDesignSystem(
  'Material Design',
  '3.0',
  MATERIAL_COLORS,
  [
    'Button',
    'Card',
    'TextField',
    'Chip',
    'Dialog',
    'AppBar',
    'BottomNavigation',
    'Checkbox',
    'Radio',
    'Switch',
    'Slider',
    'Progress',
    'Snackbar',
    'Tooltip',
    'Menu',
  ],
  [
    'elevation',
    'motion',
    'typography',
    'spacing-8dp',
    'border-radius-4dp',
    'ripple-effect',
    'state-overlay',
    'focus-indicator',
  ]
);

/**
 * Ant Design System fixture
 */
export const antDesignSystem = generateDesignSystem(
  'Ant Design',
  '5.0',
  ANT_COLORS,
  [
    'Button',
    'Card',
    'Input',
    'Form',
    'Table',
    'Menu',
    'Dropdown',
    'Pagination',
    'Steps',
    'Breadcrumb',
    'Alert',
    'Message',
    'Notification',
    'Modal',
    'Drawer',
  ],
  [
    'grid-24col',
    'spacing-8px',
    'border-radius-6px',
    'shadow-elevation',
    'hover-transitions',
    'focus-outline',
    'disabled-state',
    'loading-state',
  ]
);

/**
 * Carbon Design System fixture
 */
export const carbonDesignSystem = generateDesignSystem(
  'Carbon Design',
  '11.0',
  CARBON_COLORS,
  [
    'Button',
    'DataTable',
    'TextInput',
    'Dropdown',
    'Modal',
    'Notification',
    'Tag',
    'Tile',
    'Accordion',
    'Breadcrumb',
    'CodeSnippet',
    'DatePicker',
    'FileUploader',
    'Loading',
    'Pagination',
  ],
  [
    'grid-16col',
    'spacing-rem',
    'type-scale',
    'motion-curves',
    'border-radius-0',
    'focus-ring',
    'validation-states',
    'data-visualization',
  ]
);

/**
 * Chakra UI System fixture (similar to Material but different scale)
 */
export const chakraUISystem = generateDesignSystem(
  'Chakra UI',
  '2.8',
  {
    primary: { l: 0.53, c: 0.17, h: 215 } as OKLCH,
    secondary: { l: 0.47, c: 0.14, h: 275 } as OKLCH,
    error: { l: 0.52, c: 0.24, h: 22 } as OKLCH,
    warning: { l: 0.72, c: 0.19, h: 82 } as OKLCH,
    success: { l: 0.62, c: 0.19, h: 142 } as OKLCH,
    surface: { l: 0.97, c: 0.012, h: 215 } as OKLCH,
  },
  [
    'Button',
    'Input',
    'Card', // Common with Material
    'Box',
    'Stack',
    'Modal',
    'Drawer',
    'Popover',
    'Tooltip',
    'Alert',
    'Badge',
    'Avatar',
    'Skeleton',
    'Spinner',
    'Progress',
  ],
  [
    'spacing-4px',
    'border-radius-md',
    'shadow-system',
    'color-mode',
    'responsive-values',
    'focus-shadow', // Similar to Material but different implementation
    'hover-elevate',
    'theme-tokens',
  ]
);

/**
 * A poor quality design system for testing health evaluation
 */
export const poorDesignSystem = {
  name: 'Poor Design',
  version: '0.1.0',
  colors: [
    // Only two colors, inconsistent naming
    { name: 'red', scale: [{ l: 0.5, c: 0.3, h: 0 }] },
    { name: 'someBlue', scale: [{ l: 0.4, c: 0.25, h: 220 }] },
  ],
  components: ['Button'], // Very limited components
  patterns: [], // No patterns defined
};

/**
 * Complete design system for comprehensive testing
 */
export const comprehensiveDesignSystem = generateDesignSystem(
  'Comprehensive Design',
  '1.0.0',
  {
    ...MATERIAL_COLORS,
    info: { l: 0.6, c: 0.16, h: 240 } as OKLCH,
    neutral: { l: 0.5, c: 0.02, h: 210 } as OKLCH,
  },
  [
    // All common components from other systems
    'Button',
    'Card',
    'TextField',
    'Input',
    'Modal',
    'Tooltip',
    // Plus additional ones
    'Calendar',
    'ColorPicker',
    'DataGrid',
    'TreeView',
    'Timeline',
    'Chart',
  ],
  [
    // Comprehensive pattern set
    'elevation',
    'motion',
    'spacing-8dp',
    'grid-12col',
    'type-scale',
    'focus-indicator',
    'hover-states',
    'loading-states',
    'error-states',
    'responsive-design',
    'accessibility-features',
    'dark-mode-support',
  ]
);

/**
 * All test fixture systems
 */
export const testDesignSystems = [
  materialDesignSystem,
  antDesignSystem,
  carbonDesignSystem,
  chakraUISystem,
];

/**
 * Systems with intentional drift for testing
 */
export const driftTestSystems = {
  baseline: materialDesignSystem,
  modified: {
    ...materialDesignSystem,
    version: '3.1',
    colors: [
      ...materialDesignSystem.colors.slice(0, -1), // Remove last color
      // Modify primary color significantly
      {
        name: 'primary',
        scale: Object.values(generateOKLCHScale({ l: 0.4, c: 0.25, h: 180 })), // Much different primary
      },
      // Add new color
      {
        name: 'accent',
        scale: Object.values(generateOKLCHScale({ l: 0.65, c: 0.2, h: 320 })),
      },
    ],
    components: [...materialDesignSystem.components, 'NewComponent', 'AnotherComponent'],
    patterns: materialDesignSystem.patterns.slice(0, -2), // Remove 2 patterns
  },
};
