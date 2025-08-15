/**
 * @rafters/shared
 *
 * Shared types, schemas, and utilities for the Rafters AI design intelligence system.
 * This package provides the foundational types that AI agents use to understand
 * and reason about design systems.
 */

// Export all types and schemas
export * from './types.js';

// Utility functions for AI intelligence
export const DEFAULT_COGNITIVE_LOADS = {
  simple: 1, // Basic elements like dividers, spacers
  moderate: 2, // Simple interactive elements like buttons
  complex: 3, // Form elements, basic patterns
  challenging: 4, // Complex patterns like modals, multi-step forms
  expert: 5, // Advanced patterns like data tables, complex workflows
} as const;

// Semantic token categories for AI understanding
export const SEMANTIC_CATEGORIES = {
  // Color semantics
  primary: 'Main brand color for primary actions',
  secondary: 'Supporting brand color for secondary actions',
  accent: 'Highlight color for emphasis and CTAs',
  success: 'Positive feedback and confirmation states',
  warning: 'Cautionary feedback and attention states',
  danger: 'Error states and destructive actions',
  info: 'Informational content and neutral states',

  // Typography semantics
  display: 'Hero headings and marketing content',
  heading: 'Page and section titles',
  body: 'Main content and reading text',
  caption: 'Supporting text and metadata',

  // Spacing semantics
  xs: 'Minimal spacing for tight layouts',
  sm: 'Compact spacing for dense interfaces',
  md: 'Standard spacing for balanced layouts',
  lg: 'Generous spacing for breathing room',
  xl: 'Maximum spacing for emphasis',
} as const;

// AI-readable component patterns
export const AI_COMPONENT_PATTERNS = {
  // Attention hierarchy
  PRIMARY_ACTION: 'Use for main user goals - single per page/section',
  SECONDARY_ACTION: 'Use for alternative actions - multiple allowed',
  TERTIARY_ACTION: 'Use for minor actions - unlimited',

  // Safety constraints
  DESTRUCTIVE_CONFIRMATION: 'Destructive actions require confirmation UX',
  PROGRESSIVE_DISCLOSURE: 'Complex forms need step-by-step revelation',
  ESCAPE_HATCH: 'Always provide way to cancel/go back',

  // Accessibility patterns
  MINIMUM_TOUCH_TARGET: '44px minimum for touch interfaces',
  COLOR_NOT_ONLY: 'Never rely on color alone for meaning',
  FOCUS_VISIBLE: 'Clear focus indicators for keyboard navigation',
} as const;

export const ASCII_LOGO = `
                                    LL00CCLL                                                                        
                                    GG000000GGCCLL                                                                  
                                    LLGG0000000000CCLL                                                              
                                        LLCCGG00000000GGCCLL                                                        
                                              LLGG0000000000CCLL                                                    
                                                  LLCCGG00000000GGCCLL                                              
                                                        CC000000000000CCLL                                          
                                                  LLCCGG000000000000000000GGCCLL                                    
                                              LLCC0000000000GGLL  LLGG0000000000CCLL                                
                                        LLCCGG00000000GGCCLL          LLCCGG00000000GGCCLL                          
                                    LLCC0000000000GGLL                      LLGG0000000000CCLL                      
                              LLCCGG00000000GGCCLL                              LLCCGG00000000GGCCLL                
                          LLCC0000000000GGLL                                          LLGG0000000000CCLL            
                    LLCCGG00000000GGCCLL                                                  LLCCGG00000000GGCCLL      
                LLCC0000000000GGLL                                                              LLGG0000000000CCLL  
          LLCCGG00000000GGCCLL                                                                      LLCC0000000000GG
      LLCC0000000000GGLL                                                                                  LLGG0000GG
  CCGG00000000GGCCLL                                                                                          LLCCLL
GG00000000GGLL                                                                                                      
GG0000CCLL                                                                                                          
LLLL                                        GG888800                                                                
                                          GG@@@@@@00                                                                
                                          GG@@@@GG    GG0000                                                        
                                          GG@@@@      00@@00                                                        
            GGGGGGGG00GG  GG000000GGGG  GG00@@@@GGGGGG88@@88GGGG    GG0000GGGG    GGGGGGGG00GGGGGG000000GG          
            GG@@8888@@00GG@@@@@@@@@@00  00@@@@@@@@00@@@@@@@@@@GG  00@@@@@@@@88GG  00@@88@@@@GG00@@@@@@@@88GG        
            GG@@@@@@00GG00@@88GGGG@@@@  GG00@@@@GGGGGG88@@88GGGGGG@@@@GGGG88@@GG  00@@@@8800GG@@@@GGGG88@@GG        
            GG@@@@GG    GG00GG  GG@@@@GG  GG@@@@      00@@00    00@@00    00@@00  00@@88GG  GG@@@@GG  0000GG        
            GG@@@@        GG000000@@@@GG  GG@@@@      00@@00    00@@88GGGG88@@00  00@@88    GG88@@@@00GG            
            GG@@@@      GG@@@@@@88@@@@GG  GG@@@@      00@@00    88@@@@@@@@@@@@00  00@@88      GG88@@@@88GG          
            GG@@@@      88@@00GGGG@@@@GG  GG@@@@      00@@00    88@@00GGGGGGGGGG  00@@88          GG88@@@@GG        
            GG@@@@      @@@@GG  GG@@@@GG  GG@@@@      00@@00    00@@00            00@@88    GG0000  GG88@@00        
            GG@@@@      @@@@GG  GG@@@@GG  GG@@@@      00@@88    00@@88    88@@00  00@@88    GG@@@@GG  88@@00        
            GG@@@@      88@@8800@@@@@@GG  GG@@@@      00@@@@88GGGG@@@@8888@@@@GG  00@@88    GG@@@@8888@@@@GG        
            GG8888      GG888888GG8888GG  GG8888      GG008888GG  GG88@@@@88GG    008800      GG88888888GG          `;

// Export React components from separate file
export * from './components.js';
