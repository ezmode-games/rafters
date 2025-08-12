// import { addons } from 'storybook/manager-api';
// import { themes } from 'storybook/theming';

// /**
//  * Rafters Blueprint Theme for Storybook Manager
//  *
//  * DESIGN PHILOSOPHY:
//  * - Technical precision aesthetic matching ecosystem blueprint theme
//  * - High contrast for Section 508 accessibility compliance
//  * - Systematic grid-based visual hierarchy
//  * - Government-friendly professional appearance
//  */

// const blueprintTheme = {
//   ...themes.light,

//   // Brand Identity - Blueprint Technical Aesthetic
//   brandTitle: 'Rafters Design System',
//   brandUrl: 'https://rafters.dev',
//   brandTarget: '_self',

//   // Blueprint Color Palette - Technical Blues with High Contrast
//   colorPrimary: 'oklch(0.45 0.12 240)', // Technical blueprint blue

//   // Base Colors - High Contrast for Accessibility
//   base: 'light',
//   colorSecondary: 'oklch(0.35 0.08 240)',

//   // UI Colors - Blueprint Grid Aesthetic
//   appBg: 'oklch(0.99 0.005 240)', // Slight blueprint tint
//   appContentBg: 'oklch(1 0 0)', // Pure white content
//   appPreviewBg: 'oklch(0.985 0.002 240)', // Subtle blueprint background
//   appBorderColor: 'oklch(0.90 0.01 240)', // Light technical border
//   appBorderRadius: 6,

//   // Typography - Technical Precision
//   fontBase: '"Inter", system-ui, sans-serif',
//   fontCode: '"JetBrains Mono", "Fira Code", monospace',

//   // Text Colors - High Contrast Accessibility
//   textColor: 'oklch(0.15 0.005 240)', // Near-black with blueprint hint
//   textInverseColor: 'oklch(0.98 0.002 240)', // Near-white
//   textMutedColor: 'oklch(0.55 0.02 240)', // Technical gray

//   // Toolbar Colors - Blueprint Grid Lines
//   barTextColor: 'oklch(0.45 0.05 240)',
//   barSelectedColor: 'oklch(0.35 0.08 240)',
//   barHoverColor: 'oklch(0.40 0.06 240)',
//   barBg: 'oklch(0.97 0.01 240)',

//   // Form Elements - Technical Interface
//   inputBg: 'oklch(1 0 0)',
//   inputBorder: 'oklch(0.88 0.02 240)',
//   inputTextColor: 'oklch(0.15 0.005 240)',
//   inputBorderRadius: 4,

//   // Button Colors - Blueprint CTA Style
//   buttonBg: 'oklch(0.45 0.12 240)',
//   buttonBorder: 'oklch(0.42 0.12 240)',
//   booleanBg: 'oklch(0.90 0.01 240)',
//   booleanSelectedBg: 'oklch(0.45 0.12 240)',
// };

// addons.setConfig({
//   theme: blueprintTheme,

//   // Sidebar Configuration - Technical Hierarchy
//   sidebar: {
//     showRoots: false, // Cleaner technical interface
//     collapsedRoots: ['example'], // Keep examples collapsed
//     renderLabel: (item: { name: string }) => {
//       return item.name;
//     },
//   },

//   // Toolbar Configuration - Minimal Technical Interface
//   toolbar: {
//     'storybook/background': { hidden: false },
//     'storybook/viewport': { hidden: false },
//     'storybook/docs': { hidden: false },
//     'storybook/toolbars': { hidden: true }, // Hide extra toolbars for cleaner UI
//   },

//   // Panel Configuration - Technical Documentation Focus
//   panel: {
//     position: 'bottom', // Better for technical documentation reading
//   },
// });
