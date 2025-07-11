import {
  InteractiveTokens as a,
  CoreTokens as c,
  UsageGuidelines as d,
  Overview as i,
  SemanticTokens as m,
} from './Colors.stories-CyupQWQO.js';
import { C as o } from './blocks-CwYIOFud.js';
import { useMDXComponents as r } from './index-DOdozHKZ.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Cy2I62ob.js';
import './index-Cox8WoOv.js';
function t(s) {
  const n = { h1: 'h1', h2: 'h2', p: 'p', ...r(), ...s.components };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(n.h1, { id: 'colors', children: 'Colors' }),
      `
`,
      e.jsx(n.p, {
        children:
          'Colors communicate meaning before words are read. Our color system prioritizes accessibility and semantic clarity over decorative appeal. Every color choice serves purpose, conveys hierarchy, and respects user intent.',
      }),
      `
`,
      e.jsx(o, { of: i }),
      `
`,
      e.jsx(n.h2, { id: 'core-tokens', children: 'Core Tokens' }),
      `
`,
      e.jsx(n.p, {
        children:
          'The foundational color system built on semantic tokens, OKLCH color space, and accessibility-first principles.',
      }),
      `
`,
      e.jsx(o, { of: c }),
      `
`,
      e.jsx(n.h2, { id: 'interactive-tokens', children: 'Interactive Tokens' }),
      `
`,
      e.jsx(n.p, {
        children: 'Hover, focus, and state management colors that respond to user interaction.',
      }),
      `
`,
      e.jsx(o, { of: a }),
      `
`,
      e.jsx(n.h2, { id: 'semantic-tokens', children: 'Semantic Tokens' }),
      `
`,
      e.jsx(n.p, {
        children: 'Success, warning, error, and info states that communicate system feedback.',
      }),
      `
`,
      e.jsx(o, { of: m }),
      `
`,
      e.jsx(n.h2, { id: 'usage-guidelines', children: 'Usage Guidelines' }),
      `
`,
      e.jsx(n.p, {
        children: 'Best practices for implementing the color system in your interface components.',
      }),
      `
`,
      e.jsx(o, { of: d }),
    ],
  });
}
function j(s = {}) {
  const { wrapper: n } = { ...r(), ...s.components };
  return n ? e.jsx(n, { ...s, children: e.jsx(t, { ...s }) }) : t(s);
}
export { j as default };
