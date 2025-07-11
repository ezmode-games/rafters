import {
  Overview as a,
  ImplementationGuide as c,
  ResponsiveTypography as h,
  BodyTypography as p,
  SemanticTypography as s,
} from './Typography.stories-zh0bcjTp.js';
import { C as o } from './blocks-CwYIOFud.js';
import { useMDXComponents as i } from './index-DOdozHKZ.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Cy2I62ob.js';
import './index-Cox8WoOv.js';
function r(t) {
  const n = { h1: 'h1', h2: 'h2', p: 'p', ...i(), ...t.components };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(n.h1, { id: 'typography', children: 'Typography' }),
      `
`,
      e.jsx(n.p, {
        children:
          'Typography guidelines establish clear hierarchies and organize information based on importance. When applied well, typography enables content to be communicated clearly, effectively, and efficiently.',
      }),
      `
`,
      e.jsx(o, { of: a }),
      `
`,
      e.jsx(n.h2, { id: 'semantic-typography', children: 'Semantic Typography' }),
      `
`,
      e.jsx(n.p, {
        children: 'Heading styles that establish clear information hierarchy and visual structure.',
      }),
      `
`,
      e.jsx(o, { of: s }),
      `
`,
      e.jsx(n.h2, { id: 'body-typography', children: 'Body Typography' }),
      `
`,
      e.jsx(n.p, {
        children:
          'Text styles for readable content including paragraphs, captions, and interface text.',
      }),
      `
`,
      e.jsx(o, { of: p }),
      `
`,
      e.jsx(n.h2, { id: 'responsive-typography', children: 'Responsive Typography' }),
      `
`,
      e.jsx(n.p, {
        children:
          'Adaptive typography that scales appropriately across different screen sizes and contexts.',
      }),
      `
`,
      e.jsx(o, { of: h }),
      `
`,
      e.jsx(n.h2, { id: 'implementation-guide', children: 'Implementation Guide' }),
      `
`,
      e.jsx(n.p, {
        children:
          'Best practices for implementing typography consistently throughout your interface.',
      }),
      `
`,
      e.jsx(o, { of: c }),
    ],
  });
}
function g(t = {}) {
  const { wrapper: n } = { ...i(), ...t.components };
  return n ? e.jsx(n, { ...t, children: e.jsx(r, { ...t }) }) : r(t);
}
export { g as default };
