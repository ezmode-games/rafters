import { S as a, G as c, L as d, a as h, C as j, A as x } from './LayoutSystem.stories-BsVFFnFk.js';
import { M as l, S as r, C as s } from './blocks-CZp0A3dp.js';
import { useMDXComponents as o } from './index-BNJdjGkk.js';
import { j as n } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Bh_nZMRn.js';
import './index-BOc3uOBL.js';
import './Button-DdyNQfwD.js';
function t(i) {
  const e = {
    code: 'code',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    hr: 'hr',
    li: 'li',
    ol: 'ol',
    p: 'p',
    strong: 'strong',
    ul: 'ul',
    ...o(),
    ...i.components,
  };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(l, { of: a }),
      `
`,
      n.jsx(e.h1, { id: 'layout-system', children: 'Layout System' }),
      `
`,
      n.jsx(e.h2, { id: 'foundation-of-order', children: 'Foundation of Order' }),
      `
`,
      n.jsx(e.p, {
        children: `Layout systems create spatial relationships that guide attention and organize information.
They establish predictable patterns while maintaining flexibility for content needs.`,
      }),
      `
`,
      n.jsxs(e.p, {
        children: [
          n.jsx(e.strong, {
            children: 'Spatial relationships that create order without constraint.',
          }),
          ` Our layout system
establishes foundations for content organization while preserving creative freedom
and responsive adaptability.`,
        ],
      }),
      `
`,
      n.jsx(e.h3, { id: 'two-tier-system', children: 'Two-Tier System' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Primary' }),
              ': Semantic typography classes (',
              n.jsx(e.code, { children: 'text-body' }),
              ', ',
              n.jsx(e.code, { children: 'heading-section' }),
              ') with built-in phi spacing',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Secondary' }),
              ': Utility classes (',
              n.jsx(e.code, { children: 'p-phi-2' }),
              ', ',
              n.jsx(e.code, { children: 'gap-phi-1' }),
              ') for overrides and custom spacing',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.h3, { id: 'coverage', children: 'Coverage' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsx(e.li, { children: 'Blogs (ReadingLayout + ContentSidebar)' }),
          `
`,
          n.jsx(e.li, { children: 'Landing pages (ActionLayout + hero-golden)' }),
          `
`,
          n.jsx(e.li, { children: 'Dashboards (AppLayout + ContentStack)' }),
          `
`,
          n.jsx(e.li, { children: 'Documentation (ReadingLayout + ContentStack)' }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.hr, {}),
      `
`,
      n.jsx(e.h2, { id: 'golden-ratio-spacing', children: 'Golden Ratio Spacing' }),
      `
`,
      n.jsx(e.p, {
        children: `Golden ratio spacing is built into semantic typography classes automatically.
Utility classes are available for edge cases when you need to override defaults.`,
      }),
      `
`,
      n.jsx(s, { children: n.jsx(r, { of: c }) }),
      `
`,
      n.jsx(e.h3, { id: 'hierarchical-spacing-rules', children: 'Hierarchical Spacing Rules' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: '1rem × φ³ = 4.236rem' }), ' - Major sections'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: '1rem × φ² = 2.618rem' }), ' - Content blocks'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: '1rem × φ¹ = 1.618rem' }),
              ' - Paragraph spacing',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: '1rem × φ⁰ = 1rem' }), ' - Base spacing'],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsxs(e.p, {
        children: [
          n.jsx(e.strong, { children: 'Rule:' }),
          ' Each hierarchy level = previous level × 1.618',
        ],
      }),
      `
`,
      n.jsx(e.hr, {}),
      `
`,
      n.jsx(e.h2, { id: 'layout-patterns', children: 'Layout Patterns' }),
      `
`,
      n.jsx(e.p, {
        children:
          'Reading and Action layouts optimized for different content types and user goals.',
      }),
      `
`,
      n.jsx(s, { children: n.jsx(r, { of: d }) }),
      `
`,
      n.jsx(e.h3, {
        id: 'reading-pattern-rules-nng-research',
        children: 'Reading Pattern Rules (NN/G Research)',
      }),
      `
`,
      n.jsx(e.p, {
        children: `Eye-tracking studies reveal predictable scanning patterns. F-pattern for text-heavy content,
Z-pattern for action-oriented layouts. These aren't suggestions—they're biological realities
that should drive our layout decisions.`,
      }),
      `
`,
      n.jsx(e.h4, { id: 'f-pattern-decision-rules', children: 'F-Pattern Decision Rules' }),
      `
`,
      n.jsx(e.p, { children: n.jsx(e.strong, { children: 'WHEN TO USE F-PATTERN' }) }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'IF:' }),
              ' Content is primarily text (articles, documentation, descriptions)',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'IF:' }),
              ' Users need to scan and compare information',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'IF:' }),
              ' Content hierarchy is primarily vertical',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.p, { children: n.jsx(e.strong, { children: 'F-PATTERN LAYOUT RULES' }) }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Top horizontal band:' }),
              ' Place most important information in first 2-3 lines',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Secondary horizontal:' }),
              ' Use subheadings at 1/3 down the page',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Left vertical stem:' }),
              ' Start paragraphs with key information in first 2 words',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Right sidebar rule:' }),
              ' Maximum 38.2% width (golden ratio complement)',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.h4, { id: 'z-pattern-decision-rules', children: 'Z-Pattern Decision Rules' }),
      `
`,
      n.jsx(e.p, { children: n.jsx(e.strong, { children: 'WHEN TO USE Z-PATTERN' }) }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'IF:' }),
              ' Content has minimal text and clear call-to-action',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'IF:' }),
              ' Visual elements are primary (images, videos, graphics)',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'IF:' }),
              ' Goal is conversion or single action',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.p, { children: n.jsx(e.strong, { children: 'Z-PATTERN LAYOUT RULES' }) }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Top-left anchor:' }),
              ' Logo or brand identifier (visual starting point)',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Top-right action:' }),
              ' Primary CTA or key navigation',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Diagonal flow:' }),
              ' Hero content guides eye toward bottom-right',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Bottom-right close:' }),
              ' Secondary action or next step',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.hr, {}),
      `
`,
      n.jsx(e.h2, { id: 'golden-proportions', children: 'Golden Proportions' }),
      `
`,
      n.jsx(e.p, {
        children: 'Golden ratio proportions for content organization and hero sections.',
      }),
      `
`,
      n.jsx(s, { children: n.jsx(r, { of: h }) }),
      `
`,
      n.jsx(e.h3, { id: 'proportional-harmony-rules', children: 'Proportional Harmony Rules' }),
      `
`,
      n.jsx(e.p, {
        children: `The golden ratio (φ = 1.618) appears throughout nature and art. When applied to layout proportions,
it creates inherently pleasing relationships that feel balanced without being symmetrical.`,
      }),
      `
`,
      n.jsx(e.h4, { id: 'content--sidebar-layouts', children: 'Content + Sidebar Layouts' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: '61.8%' }), ' - Primary content area'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: '38.2%' }), ' - Secondary sidebar'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Rule:' }),
              ' When content needs sidebar, use ~62/38 split for natural hierarchy',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.h4, { id: 'hero-section-proportions', children: 'Hero Section Proportions' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, { children: [n.jsx(e.strong, { children: '61.8vh' }), ' - Hero height'] }),
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: '38.2vh' }), ' - Remaining content'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Rule:' }),
              ' Hero sections feel most comfortable at ~62% of viewport height',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.hr, {}),
      `
`,
      n.jsx(e.h2, { id: 'application-layout', children: 'Application Layout' }),
      `
`,
      n.jsx(e.p, { children: 'Application layout for dashboards and complex interfaces.' }),
      `
`,
      n.jsx(s, { children: n.jsx(r, { of: x }) }),
      `
`,
      n.jsx(e.h3, {
        id: 'systematic-grid-rules-swiss-design',
        children: 'Systematic Grid Rules (Swiss Design)',
      }),
      `
`,
      n.jsx(e.p, {
        children: `Swiss grid design prioritizes systematic thinking and mathematical relationships.
Every placement decision should be based on logical rules, not arbitrary aesthetics.`,
      }),
      `
`,
      n.jsx(e.h4, { id: 'grid-decision-algorithm', children: 'Grid Decision Algorithm' }),
      `
`,
      n.jsx(e.p, { children: n.jsx(e.strong, { children: 'STEP-BY-STEP GRID LOGIC' }) }),
      `
`,
      n.jsxs(e.ol, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Audit content types' }),
              ' - Count distinct content blocks (headers, text, images, CTAs)',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Calculate modular unit' }),
              ' - Base unit = line-height × golden ratio (typically ~26px)',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Choose column system' }),
              ' - 12-col for flexibility, 8-col for simplicity, 16-col for complexity',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Apply mathematical spacing' }),
              ' - All measurements must be multiples of the modular unit',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.hr, {}),
      `
`,
      n.jsx(e.h2, { id: 'container-variants', children: 'Container Variants' }),
      `
`,
      n.jsx(e.p, { children: 'Container variants for different content widths and use cases.' }),
      `
`,
      n.jsx(s, { children: n.jsx(r, { of: j }) }),
      `
`,
      n.jsx(e.h3, { id: 'container-decision-logic', children: 'Container Decision Logic' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Reading width:' }),
              ' 45-75 characters = optimal reading',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Golden container:' }),
              ' 61.8% of max viewport = comfortable reading',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Wide container:' }),
              ' 38.2% margin total (19.1% each side)',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.hr, {}),
      `
`,
      n.jsx(e.h2, { id: 'layout-decision-framework', children: 'Layout Decision Framework' }),
      `
`,
      n.jsx(e.h3, {
        id: 'systematic-rules-for-layout-decisions',
        children: 'Systematic Rules for Layout Decisions',
      }),
      `
`,
      n.jsx(e.p, {
        children: `Systematic rules for layout decisions based on eye-tracking research, mathematical harmony,
and cognitive psychology. These frameworks provide consistent logic for organizing content.`,
      }),
      `
`,
      n.jsx(e.h3, { id: 'cognitive-load-management', children: 'Cognitive Load Management' }),
      `
`,
      n.jsx(e.p, {
        children: `Human working memory can handle 7±2 items simultaneously. Layout decisions should respect
cognitive limits and reduce mental effort required to process information.`,
      }),
      `
`,
      n.jsx(e.h4, { id: 'information-chunking-rules', children: 'Information Chunking Rules' }),
      `
`,
      n.jsx(e.p, { children: n.jsx(e.strong, { children: 'VISUAL GROUPING ALGORITHM' }) }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Rule 1:' }),
              ' Maximum 7 items per visual group',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Rule 2:' }),
              ' Related items closer than unrelated (proximity law)',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Rule 3:' }),
              ' Use consistent spacing within groups',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Rule 4:' }),
              ' Increase spacing by φ ratio between groups',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.h4, { id: 'progressive-disclosure', children: 'Progressive Disclosure' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Layer 1:' }),
              ' Primary actions and key information only',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Layer 2:' }),
              ' Secondary options revealed on interaction',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Layer 3:' }),
              ' Advanced/expert features in dedicated areas',
            ],
          }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.h3, { id: 'layout-decision-checklist', children: 'Layout Decision Checklist' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsx(e.li, { children: '[ ] Content audit: What types and how many blocks?' }),
          `
`,
          n.jsx(e.li, { children: '[ ] Reading pattern: F-pattern or Z-pattern content?' }),
          `
`,
          n.jsx(e.li, { children: '[ ] Proportions: Apply 61.8/38.2 ratio where appropriate?' }),
          `
`,
          n.jsx(e.li, { children: '[ ] Grid system: 12-col sufficient or need 8/16-col?' }),
          `
`,
          n.jsx(e.li, { children: '[ ] Hierarchy: Clear importance ranking established?' }),
          `
`,
          n.jsx(e.li, { children: '[ ] Cognitive load: Under 7 items per visual group?' }),
          `
`,
          n.jsx(e.li, { children: '[ ] Mathematical spacing: All measurements systematic?' }),
          `
`,
        ],
      }),
      `
`,
      n.jsx(e.hr, {}),
      `
`,
      n.jsx(e.h2, { id: 'layout-principles', children: 'Layout Principles' }),
      `
`,
      n.jsx(e.h3, { id: 'content-first', children: 'Content First' }),
      `
`,
      n.jsx(e.p, { children: 'Grid serves content needs, not design convenience' }),
      `
`,
      n.jsx(e.h3, { id: 'flexible-foundation', children: 'Flexible Foundation' }),
      `
`,
      n.jsx(e.p, { children: 'Consistent structure that adapts to content variety' }),
      `
`,
      n.jsx(e.h3, { id: 'predictable-patterns', children: 'Predictable Patterns' }),
      `
`,
      n.jsx(e.p, { children: 'Familiar spatial relationships across contexts' }),
      `
`,
      n.jsx(e.h3, { id: 'responsive-by-design', children: 'Responsive by Design' }),
      `
`,
      n.jsx(e.p, { children: 'Natural adaptation across all device contexts' }),
      `
`,
      n.jsx(e.h2, { id: 'layout-as-communication', children: 'Layout as Communication' }),
      `
`,
      n.jsx(e.p, {
        children: `Layout communicates hierarchy, relationships, and importance through spatial arrangement.
Every margin, padding, and grid decision influences how users understand and navigate content.
The best layout systems feel invisible—supporting content without calling attention to themselves.`,
      }),
      `
`,
      n.jsx(e.h3, { id: 'proximity', children: 'Proximity' }),
      `
`,
      n.jsx(e.p, {
        children: 'Related elements group naturally through consistent spacing patterns.',
      }),
      `
`,
      n.jsx(e.h3, { id: 'alignment', children: 'Alignment' }),
      `
`,
      n.jsx(e.p, { children: 'Visual connections create order and reduce cognitive load.' }),
      `
`,
      n.jsx(e.h3, { id: 'contrast', children: 'Contrast' }),
      `
`,
      n.jsx(e.p, {
        children: 'Hierarchy emerges from intentional differences in size and weight.',
      }),
      `
`,
      n.jsx(e.h3, { id: 'repetition', children: 'Repetition' }),
      `
`,
      n.jsx(e.p, {
        children: 'Consistent patterns establish predictable navigation and structure.',
      }),
      `
`,
      n.jsx(e.hr, {}),
      `
`,
      n.jsx(e.h2, { id: 'quick-reference', children: 'Quick Reference' }),
      `
`,
      n.jsxs(e.ul, {
        children: [
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: 'F-Pattern:' }), ' Reading-heavy content'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: 'Z-Pattern:' }), ' Action-focused layouts'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: 'Golden Ratio:' }), ' φ = 1.618'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [n.jsx(e.strong, { children: 'Cognitive Limit:' }), ' 7±2 items'],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Container Logic:' }),
              ' Reading (45-75ch), Golden (61.8%), Wide (max-7xl), Full (100%)',
            ],
          }),
          `
`,
          n.jsxs(e.li, {
            children: [
              n.jsx(e.strong, { children: 'Spacing Scale:' }),
              ' φ⁻², φ⁻¹, φ⁰ (1rem), φ¹, φ², φ³, φ⁴',
            ],
          }),
          `
`,
        ],
      }),
    ],
  });
}
function b(i = {}) {
  const { wrapper: e } = { ...o(), ...i.components };
  return e ? n.jsx(e, { ...i, children: n.jsx(t, { ...i }) }) : t(i);
}
export { b as default };
