import {
  Overview as a,
  SemanticTokens as c,
  ImplementationGuide as d,
  ComponentTokens as m,
  CoreTokens as r,
} from './Tokens.stories-5jl9lAzZ.js';
import { C as t } from './blocks-CwYIOFud.js';
import { useMDXComponents as i } from './index-DOdozHKZ.js';
import { j as n } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Cy2I62ob.js';
import './index-Cox8WoOv.js';
function s(o) {
  const e = { h1: 'h1', h2: 'h2', p: 'p', ...i(), ...o.components };
  return n.jsxs(n.Fragment, {
    children: [
      n.jsx(e.h1, { id: 'tokens', children: 'Tokens' }),
      `
`,
      n.jsx(e.p, {
        children:
          'Design tokens are the core building blocks of consistent, scalable design systems. They encapsulate design decisions into reusable values that maintain coherence across platforms, themes, and application states.',
      }),
      `
`,
      n.jsx(t, { of: a }),
      `
`,
      n.jsx(e.h2, { id: 'core-tokens', children: 'Core Tokens' }),
      `
`,
      n.jsx(e.p, {
        children:
          'Background, foreground, and surface foundations that establish the basic visual framework.',
      }),
      `
`,
      n.jsx(t, { of: r }),
      `
`,
      n.jsx(e.h2, { id: 'semantic-tokens', children: 'Semantic Tokens' }),
      `
`,
      n.jsx(e.p, {
        children: 'Contextual tokens that communicate meaning through color and state.',
      }),
      `
`,
      n.jsx(t, { of: c }),
      `
`,
      n.jsx(e.h2, { id: 'component-tokens', children: 'Component Tokens' }),
      `
`,
      n.jsx(e.p, {
        children:
          'Specialized design tokens optimized for specific interface components and patterns.',
      }),
      `
`,
      n.jsx(t, { of: m }),
      `
`,
      n.jsx(e.h2, { id: 'implementation-guide', children: 'Implementation Guide' }),
      `
`,
      n.jsx(e.p, {
        children: 'A comprehensive guide to implementing and customizing the design token system.',
      }),
      `
`,
      n.jsx(t, { of: d }),
    ],
  });
}
function j(o = {}) {
  const { wrapper: e } = { ...i(), ...o.components };
  return e ? n.jsx(e, { ...o, children: n.jsx(s, { ...o }) }) : s(o);
}
export { j as default };
