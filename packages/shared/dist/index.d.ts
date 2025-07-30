/**
 * @rafters/shared
 *
 * Shared types, schemas, and utilities for the Rafters AI design intelligence system.
 * This package provides the foundational types that AI agents use to understand
 * and reason about design systems.
 */
export * from './types.js';
export * from './registry-data.js';
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
export declare const ASCII_LOGO = "\n                                    LL00CCLL                                                                        \n                                    GG000000GGCCLL                                                                  \n                                    LLGG0000000000CCLL                                                              \n                                        LLCCGG00000000GGCCLL                                                        \n                                              LLGG0000000000CCLL                                                    \n                                                  LLCCGG00000000GGCCLL                                              \n                                                        CC000000000000CCLL                                          \n                                                  LLCCGG000000000000000000GGCCLL                                    \n                                              LLCC0000000000GGLL  LLGG0000000000CCLL                                \n                                        LLCCGG00000000GGCCLL          LLCCGG00000000GGCCLL                          \n                                    LLCC0000000000GGLL                      LLGG0000000000CCLL                      \n                              LLCCGG00000000GGCCLL                              LLCCGG00000000GGCCLL                \n                          LLCC0000000000GGLL                                          LLGG0000000000CCLL            \n                    LLCCGG00000000GGCCLL                                                  LLCCGG00000000GGCCLL      \n                LLCC0000000000GGLL                                                              LLGG0000000000CCLL  \n          LLCCGG00000000GGCCLL                                                                      LLCC0000000000GG\n      LLCC0000000000GGLL                                                                                  LLGG0000GG\n  CCGG00000000GGCCLL                                                                                          LLCCLL\nGG00000000GGLL                                                                                                      \nGG0000CCLL                                                                                                          \nLLLL                                        GG888800                                                                \n                                          GG@@@@@@00                                                                \n                                          GG@@@@GG    GG0000                                                        \n                                          GG@@@@      00@@00                                                        \n            GGGGGGGG00GG  GG000000GGGG  GG00@@@@GGGGGG88@@88GGGG    GG0000GGGG    GGGGGGGG00GGGGGG000000GG          \n            GG@@8888@@00GG@@@@@@@@@@00  00@@@@@@@@00@@@@@@@@@@GG  00@@@@@@@@88GG  00@@88@@@@GG00@@@@@@@@88GG        \n            GG@@@@@@00GG00@@88GGGG@@@@  GG00@@@@GGGGGG88@@88GGGGGG@@@@GGGG88@@GG  00@@@@8800GG@@@@GGGG88@@GG        \n            GG@@@@GG    GG00GG  GG@@@@GG  GG@@@@      00@@00    00@@00    00@@00  00@@88GG  GG@@@@GG  0000GG        \n            GG@@@@        GG000000@@@@GG  GG@@@@      00@@00    00@@88GGGG88@@00  00@@88    GG88@@@@00GG            \n            GG@@@@      GG@@@@@@88@@@@GG  GG@@@@      00@@00    88@@@@@@@@@@@@00  00@@88      GG88@@@@88GG          \n            GG@@@@      88@@00GGGG@@@@GG  GG@@@@      00@@00    88@@00GGGGGGGGGG  00@@88          GG88@@@@GG        \n            GG@@@@      @@@@GG  GG@@@@GG  GG@@@@      00@@00    00@@00            00@@88    GG0000  GG88@@00        \n            GG@@@@      @@@@GG  GG@@@@GG  GG@@@@      00@@88    00@@88    88@@00  00@@88    GG@@@@GG  88@@00        \n            GG@@@@      88@@8800@@@@@@GG  GG@@@@      00@@@@88GGGG@@@@8888@@@@GG  00@@88    GG@@@@8888@@@@GG        \n            GG8888      GG888888GG8888GG  GG8888      GG008888GG  GG88@@@@88GG    008800      GG88888888GG          ";
export * from './components.js';
