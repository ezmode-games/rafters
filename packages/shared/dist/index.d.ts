/**
 * @rafters/shared
 *
 * Shared types, schemas, and utilities for the Rafters AI design intelligence system.
 * This package provides the foundational types that AI agents use to understand
 * and reason about design systems.
 */
export * from './types.js';
export declare const DEFAULT_COGNITIVE_LOADS: {
    readonly simple: 1;
    readonly moderate: 2;
    readonly complex: 3;
    readonly challenging: 4;
    readonly expert: 5;
};
export declare const SEMANTIC_CATEGORIES: {
    readonly primary: "Main brand color for primary actions";
    readonly secondary: "Supporting brand color for secondary actions";
    readonly accent: "Highlight color for emphasis and CTAs";
    readonly success: "Positive feedback and confirmation states";
    readonly warning: "Cautionary feedback and attention states";
    readonly danger: "Error states and destructive actions";
    readonly info: "Informational content and neutral states";
    readonly display: "Hero headings and marketing content";
    readonly heading: "Page and section titles";
    readonly body: "Main content and reading text";
    readonly caption: "Supporting text and metadata";
    readonly xs: "Minimal spacing for tight layouts";
    readonly sm: "Compact spacing for dense interfaces";
    readonly md: "Standard spacing for balanced layouts";
    readonly lg: "Generous spacing for breathing room";
    readonly xl: "Maximum spacing for emphasis";
};
export declare const AI_COMPONENT_PATTERNS: {
    readonly PRIMARY_ACTION: "Use for main user goals - single per page/section";
    readonly SECONDARY_ACTION: "Use for alternative actions - multiple allowed";
    readonly TERTIARY_ACTION: "Use for minor actions - unlimited";
    readonly DESTRUCTIVE_CONFIRMATION: "Destructive actions require confirmation UX";
    readonly PROGRESSIVE_DISCLOSURE: "Complex forms need step-by-step revelation";
    readonly ESCAPE_HATCH: "Always provide way to cancel/go back";
    readonly MINIMUM_TOUCH_TARGET: "44px minimum for touch interfaces";
    readonly COLOR_NOT_ONLY: "Never rely on color alone for meaning";
    readonly FOCUS_VISIBLE: "Clear focus indicators for keyboard navigation";
};
export declare const ASCII_LOGO = "\n                    \u2588\u2588\u2593\u2593\u2591\u2591                              \n                    \u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591                          \n                \u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591                      \n            \u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591                  \n        \u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591    \u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591              \n    \u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591            \u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591          \n\u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591                    \u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591      \n\u2588\u2588\u2588\u2588\u2593\u2593\u2591\u2591                            \u2591\u2591\u2593\u2593\u2588\u2588\u2588\u2588      \n\u2591\u2591\u2591\u2591                                      \u2591\u2591\u2591\u2591    \n\n \u2584\u2584\u2584\u2584 \u2584\u2584\u2584\u2584 \u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584 \u2584\u2584\u2584\u2584 \u2584\u2584\u2584\u2584 \u2584\u2584\u2584\u2584\n \u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588 \u2588\u2588\u2588 \u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588 \u2588\u2588\u2588\u2588\n \u2593\u2593\u2593\u2593 \u2593\u2593\u2593\u2593 \u2593\u2593\u2593\u2593     \u2593\u2593\u2593\u2593 \u2593\u2593\u2593\u2593 \u2593\u2593\u2593\u2593\n \u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592  \u2592\u2592\u2592\u2592     \u2592\u2592\u2592\u2592\u2592\u2592\u2592\u2592  \u2592\u2592\u2592\u2592\n \u2591\u2591\u2591\u2591\u2591\u2591    \u2591\u2591\u2591\u2591     \u2591\u2591\u2591\u2591\u2591\u2591    \u2591\u2591\u2591\u2591";
export * from './components.js';
