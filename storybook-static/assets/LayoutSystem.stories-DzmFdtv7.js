import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './Button-B50RvQza.js';
import './Label-J2ZPzYJO.js';
import './Input-CVXQ6vxa.js';
import './Card-IR7pq_R3.js';
import './Select-BQoa9TWO.js';
import './Slider-Nq1eD_aH.js';
import './Tabs-Bcyagkfc.js';
import { r as i } from './iframe-Cy2I62ob.js';
import { c as o } from './utils-DuMXYCiK.js';
const t = i.forwardRef(({ variant: a = 'golden', className: n, ...s }, h) => {
  const z = {
    reading: 'container-reading',
    golden: 'container-golden',
    wide: 'max-w-7xl mx-auto px-phi-1',
    full: 'w-full px-phi-1',
  };
  return e.jsx('div', { ref: h, className: o(z[a], n), ...s });
});
t.displayName = 'Container';
const g = i.forwardRef(({ className: a, ...n }, s) =>
  e.jsx('div', { ref: s, className: o('reading-layout', a), ...n })
);
g.displayName = 'ReadingLayout';
const u = i.forwardRef(({ className: a, ...n }, s) =>
  e.jsx('div', { ref: s, className: o('action-layout', a), ...n })
);
u.displayName = 'ActionLayout';
const x = i.forwardRef(({ className: a, ...n }, s) =>
  e.jsx('div', { ref: s, className: o('content-sidebar', a), ...n })
);
x.displayName = 'ContentSidebar';
const y = i.forwardRef(({ className: a, ...n }, s) =>
  e.jsx('div', { ref: s, className: o('app-layout', a), ...n })
);
y.displayName = 'AppLayout';
const N = i.forwardRef(({ gap: a = 'phi-1', className: n, ...s }, h) =>
  e.jsx('div', { ref: h, className: o('content-stack', `gap-${a}`, n), ...s })
);
N.displayName = 'ContentStack';
t.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'Container',
  props: {
    variant: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'reading' | 'golden' | 'wide' | 'full'",
        elements: [
          { name: 'literal', value: "'reading'" },
          { name: 'literal', value: "'golden'" },
          { name: 'literal', value: "'wide'" },
          { name: 'literal', value: "'full'" },
        ],
      },
      description: '',
      defaultValue: { value: "'golden'", computed: !1 },
    },
  },
};
g.__docgenInfo = { description: '', methods: [], displayName: 'ReadingLayout' };
u.__docgenInfo = { description: '', methods: [], displayName: 'ActionLayout' };
x.__docgenInfo = { description: '', methods: [], displayName: 'ContentSidebar' };
y.__docgenInfo = { description: '', methods: [], displayName: 'AppLayout' };
N.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'ContentStack',
  props: {
    gap: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'phi-0' | 'phi-1' | 'phi-2' | 'phi-3'",
        elements: [
          { name: 'literal', value: "'phi-0'" },
          { name: 'literal', value: "'phi-1'" },
          { name: 'literal', value: "'phi-2'" },
          { name: 'literal', value: "'phi-3'" },
        ],
      },
      description: '',
      defaultValue: { value: "'phi-1'", computed: !1 },
    },
  },
};
const O = { title: '01 Identity/Layout System', parameters: { layout: 'fullscreen' } };
const r = {
  render: () =>
    e.jsx(t, {
      variant: 'wide',
      children: e.jsxs('div', {
        className: 'py-phi-3 text-center',
        children: [
          e.jsx('h1', { className: 'heading-hero', children: 'Layout System' }),
          e.jsx('p', {
            className: 'text-body-large max-w-3xl mx-auto',
            children:
              'Spatial relationships that create order without constraint. Our layout system establishes foundations for content organization while preserving creative freedom and responsive adaptability.',
          }),
          e.jsxs('div', {
            className:
              'mt-phi-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-2 max-w-6xl mx-auto',
            children: [
              e.jsxs('div', {
                className: 'p-phi-2 border border-muted rounded-lg text-left',
                children: [
                  e.jsx('h3', { className: 'heading-component', children: 'Content First' }),
                  e.jsx('p', {
                    className: 'text-body',
                    children: 'Grid serves content needs, not design convenience',
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'p-phi-2 border border-muted rounded-lg text-left',
                children: [
                  e.jsx('h3', {
                    className: 'heading-component',
                    children: 'Mathematical Harmony',
                  }),
                  e.jsx('p', {
                    className: 'text-body',
                    children: 'Golden ratio proportions create inherently pleasing relationships',
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'p-phi-2 border border-muted rounded-lg text-left',
                children: [
                  e.jsx('h3', { className: 'heading-component', children: 'Cognitive Respect' }),
                  e.jsx('p', {
                    className: 'text-body',
                    children: 'Patterns based on eye-tracking research and memory limits',
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'p-phi-2 border border-muted rounded-lg text-left',
                children: [
                  e.jsx('h3', {
                    className: 'heading-component',
                    children: 'Flexible Foundation',
                  }),
                  e.jsx('p', {
                    className: 'text-body',
                    children: 'Consistent structure that adapts to content variety',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    }),
};
const d = {
  render: () =>
    e.jsx(t, {
      variant: 'golden',
      children: e.jsxs(N, {
        children: [
          e.jsx('h1', { className: 'heading-display', children: 'Golden Ratio Spacing' }),
          e.jsx('p', {
            className: 'text-body',
            children: 'Typography classes have built-in phi spacing automatically.',
          }),
          e.jsx('h3', {
            className: 'heading-component',
            children: 'Utility Classes (for edge cases)',
          }),
          e.jsxs('div', {
            className: 'grid grid-cols-4 gap-phi-1',
            children: [
              e.jsx('div', { className: 'p-phi--2 bg-muted rounded', children: 'φ⁻² spacing' }),
              e.jsx('div', { className: 'p-phi--1 bg-muted rounded', children: 'φ⁻¹ spacing' }),
              e.jsx('div', { className: 'p-phi-1 bg-muted rounded', children: 'φ¹ spacing' }),
              e.jsx('div', { className: 'p-phi-2 bg-muted rounded', children: 'φ² spacing' }),
            ],
          }),
          e.jsx('p', {
            className: 'text-body-small',
            children: 'Use utilities only when you need to override defaults.',
          }),
        ],
      }),
    }),
};
const l = {
  render: () =>
    e.jsxs('div', {
      className: 'space-y-phi-3',
      children: [
        e.jsx(t, {
          variant: 'reading',
          children: e.jsxs(g, {
            children: [
              e.jsx('h2', { className: 'heading-section', children: 'Reading Layout' }),
              e.jsxs('div', {
                children: [
                  e.jsx('p', {
                    className: 'text-body',
                    children:
                      'Main content flows in scannable pattern optimized for text consumption...',
                  }),
                  e.jsx('p', {
                    className: 'text-body',
                    children: 'Second paragraph continues reading flow with proper spacing...',
                  }),
                ],
              }),
              e.jsx('aside', {
                className: 'text-body-small border-l-2 border-border pl-4',
                children: 'Sidebar content for metadata, navigation, or supplementary information',
              }),
            ],
          }),
        }),
        e.jsx(t, {
          variant: 'golden',
          children: e.jsxs(u, {
            children: [
              e.jsx('div', { className: 'brand font-semibold', children: 'Logo' }),
              e.jsx('button', {
                type: 'button',
                className: 'bg-primary text-primary-foreground px-4 py-2 rounded',
                children: 'Action',
              }),
              e.jsxs('div', {
                className: 'hero text-center',
                children: [
                  e.jsx('h1', { className: 'heading-hero', children: 'Hero Content' }),
                  e.jsx('p', {
                    className: 'text-body-large',
                    children: 'Conversion-focused layout for landing pages',
                  }),
                ],
              }),
              e.jsx('button', {
                type: 'button',
                className: 'bg-secondary text-secondary-foreground px-6 py-3 rounded',
                children: 'Call to Action',
              }),
            ],
          }),
        }),
      ],
    }),
};
const c = {
  render: () =>
    e.jsx(t, {
      variant: 'golden',
      children: e.jsxs('div', {
        className: 'space-y-phi-2',
        children: [
          e.jsxs(x, {
            children: [
              e.jsxs('main', {
                children: [
                  e.jsx('h2', { className: 'heading-section', children: 'Content (61.8%)' }),
                  e.jsx('p', {
                    className: 'text-body',
                    children:
                      'Primary content area gets the larger portion following golden ratio proportions.',
                  }),
                ],
              }),
              e.jsxs('aside', {
                className: 'bg-muted p-phi-1 rounded',
                children: [
                  e.jsx('h3', { className: 'heading-component', children: 'Sidebar (38.2%)' }),
                  e.jsx('p', {
                    className: 'text-body-small',
                    children: 'Secondary content in complementary proportion.',
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'hero-golden bg-muted rounded',
            children: [
              e.jsx('h1', { className: 'heading-hero', children: 'Hero Section' }),
              e.jsx('p', {
                className: 'text-body-large',
                children: '61.8vh height feels natural and draws attention',
              }),
            ],
          }),
        ],
      }),
    }),
};
const p = {
  render: () =>
    e.jsxs('div', {
      className: 'space-y-phi-3',
      children: [
        e.jsx('h2', { className: 'heading-section px-4', children: 'Dashboard/App Layout' }),
        e.jsxs(y, {
          children: [
            e.jsx('header', {
              className: 'bg-muted p-phi-1 border-b border-border',
              children: e.jsx('h3', { className: 'heading-component', children: 'App Header' }),
            }),
            e.jsx('nav', {
              className: 'bg-muted/50 p-phi-1 border-r border-border',
              children: e.jsx('p', {
                className: 'text-body-small',
                children: 'Navigation sidebar',
              }),
            }),
            e.jsxs('main', {
              className: 'p-phi-2',
              children: [
                e.jsx('h1', { className: 'heading-display', children: 'Main Content' }),
                e.jsx('p', {
                  className: 'text-body',
                  children: 'Dashboard content, forms, data views, and application features.',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
};
const m = {
  render: () =>
    e.jsxs('div', {
      className: 'space-y-phi-3',
      children: [
        e.jsx(t, {
          variant: 'reading',
          children: e.jsxs('div', {
            className: 'bg-muted p-phi-1 rounded',
            children: [
              e.jsx('h3', { className: 'heading-component', children: 'Reading Container' }),
              e.jsx('p', {
                className: 'text-body',
                children:
                  'Optimized for 45-75 characters per line, perfect for articles and documentation.',
              }),
            ],
          }),
        }),
        e.jsx(t, {
          variant: 'golden',
          children: e.jsxs('div', {
            className: 'bg-muted p-phi-1 rounded',
            children: [
              e.jsx('h3', { className: 'heading-component', children: 'Golden Container' }),
              e.jsx('p', {
                className: 'text-body',
                children: 'Golden ratio width for balanced content and whitespace.',
              }),
            ],
          }),
        }),
        e.jsx(t, {
          variant: 'wide',
          children: e.jsxs('div', {
            className: 'bg-muted p-phi-1 rounded',
            children: [
              e.jsx('h3', { className: 'heading-component', children: 'Wide Container' }),
              e.jsx('p', {
                className: 'text-body',
                children: 'Maximum 7xl width for dashboards and data-heavy interfaces.',
              }),
            ],
          }),
        }),
        e.jsx(t, {
          variant: 'full',
          children: e.jsxs('div', {
            className: 'bg-muted p-phi-1 rounded',
            children: [
              e.jsx('h3', { className: 'heading-component', children: 'Full Container' }),
              e.jsx('p', {
                className: 'text-body',
                children: 'Full width with padding for edge-to-edge layouts.',
              }),
            ],
          }),
        }),
      ],
    }),
};
let b;
let v;
let f;
r.parameters = {
  ...r.parameters,
  docs: {
    ...((b = r.parameters) == null ? void 0 : b.docs),
    source: {
      originalSource: `{
  render: () => <Container variant="wide">
      <div className="py-phi-3 text-center">
        <h1 className="heading-hero">Layout System</h1>
        <p className="text-body-large max-w-3xl mx-auto">
          Spatial relationships that create order without constraint. Our layout system establishes
          foundations for content organization while preserving creative freedom and responsive
          adaptability.
        </p>

        <div className="mt-phi-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-2 max-w-6xl mx-auto">
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Content First</h3>
            <p className="text-body">Grid serves content needs, not design convenience</p>
          </div>
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Mathematical Harmony</h3>
            <p className="text-body">
              Golden ratio proportions create inherently pleasing relationships
            </p>
          </div>
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Cognitive Respect</h3>
            <p className="text-body">Patterns based on eye-tracking research and memory limits</p>
          </div>
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Flexible Foundation</h3>
            <p className="text-body">Consistent structure that adapts to content variety</p>
          </div>
        </div>
      </div>
    </Container>
}`,
      ...((f = (v = r.parameters) == null ? void 0 : v.docs) == null ? void 0 : f.source),
    },
  },
};
let j;
let C;
let w;
d.parameters = {
  ...d.parameters,
  docs: {
    ...((j = d.parameters) == null ? void 0 : j.docs),
    source: {
      originalSource: `{
  render: () => <Container variant="golden">
      <ContentStack>
        <h1 className="heading-display">Golden Ratio Spacing</h1>
        <p className="text-body">Typography classes have built-in phi spacing automatically.</p>

        <h3 className="heading-component">Utility Classes (for edge cases)</h3>
        <div className="grid grid-cols-4 gap-phi-1">
          <div className="p-phi--2 bg-muted rounded">φ⁻² spacing</div>
          <div className="p-phi--1 bg-muted rounded">φ⁻¹ spacing</div>
          <div className="p-phi-1 bg-muted rounded">φ¹ spacing</div>
          <div className="p-phi-2 bg-muted rounded">φ² spacing</div>
        </div>

        <p className="text-body-small">Use utilities only when you need to override defaults.</p>
      </ContentStack>
    </Container>
}`,
      ...((w = (C = d.parameters) == null ? void 0 : C.docs) == null ? void 0 : w.source),
    },
  },
};
let S;
let L;
let R;
l.parameters = {
  ...l.parameters,
  docs: {
    ...((S = l.parameters) == null ? void 0 : S.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-phi-3">
      <Container variant="reading">
        <ReadingLayout>
          <h2 className="heading-section">Reading Layout</h2>
          <div>
            <p className="text-body">
              Main content flows in scannable pattern optimized for text consumption...
            </p>
            <p className="text-body">
              Second paragraph continues reading flow with proper spacing...
            </p>
          </div>
          <aside className="text-body-small border-l-2 border-border pl-4">
            Sidebar content for metadata, navigation, or supplementary information
          </aside>
        </ReadingLayout>
      </Container>

      <Container variant="golden">
        <ActionLayout>
          <div className="brand font-semibold">Logo</div>
          <button type="button" className="bg-primary text-primary-foreground px-4 py-2 rounded">
            Action
          </button>
          <div className="hero text-center">
            <h1 className="heading-hero">Hero Content</h1>
            <p className="text-body-large">Conversion-focused layout for landing pages</p>
          </div>
          <button type="button" className="bg-secondary text-secondary-foreground px-6 py-3 rounded">
            Call to Action
          </button>
        </ActionLayout>
      </Container>
    </div>
}`,
      ...((R = (L = l.parameters) == null ? void 0 : L.docs) == null ? void 0 : R.source),
    },
  },
};
let A;
let _;
let G;
c.parameters = {
  ...c.parameters,
  docs: {
    ...((A = c.parameters) == null ? void 0 : A.docs),
    source: {
      originalSource: `{
  render: () => <Container variant="golden">
      <div className="space-y-phi-2">
        <ContentSidebar>
          <main>
            <h2 className="heading-section">Content (61.8%)</h2>
            <p className="text-body">
              Primary content area gets the larger portion following golden ratio proportions.
            </p>
          </main>
          <aside className="bg-muted p-phi-1 rounded">
            <h3 className="heading-component">Sidebar (38.2%)</h3>
            <p className="text-body-small">Secondary content in complementary proportion.</p>
          </aside>
        </ContentSidebar>

        <div className="hero-golden bg-muted rounded">
          <h1 className="heading-hero">Hero Section</h1>
          <p className="text-body-large">61.8vh height feels natural and draws attention</p>
        </div>
      </div>
    </Container>
}`,
      ...((G = (_ = c.parameters) == null ? void 0 : _.docs) == null ? void 0 : G.source),
    },
  },
};
let F;
let I;
let M;
p.parameters = {
  ...p.parameters,
  docs: {
    ...((F = p.parameters) == null ? void 0 : F.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-phi-3">
      <h2 className="heading-section px-4">Dashboard/App Layout</h2>
      <AppLayout>
        <header className="bg-muted p-phi-1 border-b border-border">
          <h3 className="heading-component">App Header</h3>
        </header>
        <nav className="bg-muted/50 p-phi-1 border-r border-border">
          <p className="text-body-small">Navigation sidebar</p>
        </nav>
        <main className="p-phi-2">
          <h1 className="heading-display">Main Content</h1>
          <p className="text-body">
            Dashboard content, forms, data views, and application features.
          </p>
        </main>
      </AppLayout>
    </div>
}`,
      ...((M = (I = p.parameters) == null ? void 0 : I.docs) == null ? void 0 : M.source),
    },
  },
};
let P;
let k;
let H;
m.parameters = {
  ...m.parameters,
  docs: {
    ...((P = m.parameters) == null ? void 0 : P.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-phi-3">
      <Container variant="reading">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Reading Container</h3>
          <p className="text-body">
            Optimized for 45-75 characters per line, perfect for articles and documentation.
          </p>
        </div>
      </Container>

      <Container variant="golden">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Golden Container</h3>
          <p className="text-body">Golden ratio width for balanced content and whitespace.</p>
        </div>
      </Container>

      <Container variant="wide">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Wide Container</h3>
          <p className="text-body">Maximum 7xl width for dashboards and data-heavy interfaces.</p>
        </div>
      </Container>

      <Container variant="full">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Full Container</h3>
          <p className="text-body">Full width with padding for edge-to-edge layouts.</p>
        </div>
      </Container>
    </div>
}`,
      ...((H = (k = m.parameters) == null ? void 0 : k.docs) == null ? void 0 : H.source),
    },
  },
};
const T = [
  'Introduction',
  'GoldenRatioSpacing',
  'LayoutPatterns',
  'GoldenProportions',
  'ApplicationLayout',
  'ContainerVariants',
];
const Q = Object.freeze(
  Object.defineProperty(
    {
      __proto__: null,
      ApplicationLayout: p,
      ContainerVariants: m,
      GoldenProportions: c,
      GoldenRatioSpacing: d,
      Introduction: r,
      LayoutPatterns: l,
      __namedExportsOrder: T,
      default: O,
    },
    Symbol.toStringTag,
    { value: 'Module' }
  )
);
export { m as C, c as G, l as L, Q as S };
