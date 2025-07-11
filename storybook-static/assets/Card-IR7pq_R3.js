import { r as i } from './iframe-Cy2I62ob.js';
import { j as o } from './jsx-runtime-BjG_zV1W.js';
import { c as n } from './utils-DuMXYCiK.js';
const d = i.forwardRef(
  (
    {
      className: l,
      density: e = 'comfortable',
      interactive: a = !1,
      prominence: t = 'default',
      ...r
    },
    s
  ) =>
    o.jsx('div', {
      ref: s,
      className: n(
        'rounded-lg border bg-card text-card-foreground transition-all duration-200',
        {
          'border-border shadow-sm': t === 'subtle',
          'border-border shadow-md': t === 'default',
          'border-border shadow-lg': t === 'elevated',
        },
        a &&
          'cursor-pointer hover:shadow-md hover:border-accent-foreground/20 hover:scale-[1.02] active:scale-[0.98]',
        a && 'min-h-[44px]',
        l
      ),
      role: a ? 'button' : void 0,
      tabIndex: a ? 0 : void 0,
      ...r,
    })
);
d.displayName = 'Card';
const m = i.forwardRef(({ className: l, density: e = 'comfortable', ...a }, t) =>
  o.jsx('div', {
    ref: t,
    className: n(
      'flex flex-col space-y-1.5',
      { 'p-4': e === 'compact', 'p-6': e === 'comfortable', 'p-8': e === 'spacious' },
      l
    ),
    ...a,
  })
);
m.displayName = 'CardHeader';
const u = i.forwardRef(({ className: l, level: e = 3, weight: a = 'semibold', ...t }, r) => {
  const s = `h${e}`;
  return o.jsx(s, {
    ref: r,
    className: n(
      'leading-none tracking-tight',
      {
        'text-3xl': e === 1,
        'text-2xl': e === 2,
        'text-xl': e === 3,
        'text-lg': e === 4,
        'text-base': e === 5,
        'text-sm': e === 6,
      },
      {
        'font-normal': a === 'normal',
        'font-medium': a === 'medium',
        'font-semibold': a === 'semibold',
      },
      l
    ),
    ...t,
  });
});
u.displayName = 'CardTitle';
const c = i.forwardRef(({ className: l, truncate: e = !1, prominence: a = 'default', ...t }, r) =>
  o.jsx('p', {
    ref: r,
    className: n(
      'text-sm leading-relaxed',
      e && 'line-clamp-2',
      { 'text-muted-foreground/70': a === 'subtle', 'text-muted-foreground': a === 'default' },
      l
    ),
    ...t,
  })
);
c.displayName = 'CardDescription';
const f = i.forwardRef(
  ({ className: l, density: e = 'comfortable', layout: a = 'default', ...t }, r) =>
    o.jsx('div', {
      ref: r,
      className: n(
        'pt-0',
        { 'p-4': e === 'compact', 'p-6': e === 'comfortable', 'p-8': e === 'spacious' },
        { '': a === 'default', 'grid grid-cols-1 gap-4': a === 'grid', 'space-y-3': a === 'list' },
        l
      ),
      ...t,
    })
);
f.displayName = 'CardContent';
const p = i.forwardRef(
  ({ className: l, density: e = 'comfortable', justify: a = 'start', ...t }, r) =>
    o.jsx('div', {
      ref: r,
      className: n(
        'flex items-center pt-0',
        { 'p-4': e === 'compact', 'p-6': e === 'comfortable', 'p-8': e === 'spacious' },
        {
          'justify-start': a === 'start',
          'justify-center': a === 'center',
          'justify-end': a === 'end',
          'justify-between': a === 'between',
        },
        l
      ),
      ...t,
    })
);
p.displayName = 'CardFooter';
d.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'Card',
  props: {
    density: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'compact' | 'comfortable' | 'spacious'",
        elements: [
          { name: 'literal', value: "'compact'" },
          { name: 'literal', value: "'comfortable'" },
          { name: 'literal', value: "'spacious'" },
        ],
      },
      description: 'Cognitive load: Card density for information hierarchy',
      defaultValue: { value: "'comfortable'", computed: !1 },
    },
    interactive: {
      required: !1,
      tsType: { name: 'boolean' },
      description: 'Cognitive load: Interaction affordance',
      defaultValue: { value: 'false', computed: !1 },
    },
    prominence: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'subtle' | 'default' | 'elevated'",
        elements: [
          { name: 'literal', value: "'subtle'" },
          { name: 'literal', value: "'default'" },
          { name: 'literal', value: "'elevated'" },
        ],
      },
      description: 'Scanability: Visual prominence for important cards',
      defaultValue: { value: "'default'", computed: !1 },
    },
  },
};
m.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'CardHeader',
  props: {
    density: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'compact' | 'comfortable' | 'spacious'",
        elements: [
          { name: 'literal', value: "'compact'" },
          { name: 'literal', value: "'comfortable'" },
          { name: 'literal', value: "'spacious'" },
        ],
      },
      description: 'Cognitive load: Header density for information hierarchy',
      defaultValue: { value: "'comfortable'", computed: !1 },
    },
  },
};
u.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'CardTitle',
  props: {
    level: {
      required: !1,
      tsType: {
        name: 'union',
        raw: '1 | 2 | 3 | 4 | 5 | 6',
        elements: [
          { name: 'literal', value: '1' },
          { name: 'literal', value: '2' },
          { name: 'literal', value: '3' },
          { name: 'literal', value: '4' },
          { name: 'literal', value: '5' },
          { name: 'literal', value: '6' },
        ],
      },
      description: 'Information hierarchy: Semantic heading level',
      defaultValue: { value: '3', computed: !1 },
    },
    weight: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'normal' | 'medium' | 'semibold'",
        elements: [
          { name: 'literal', value: "'normal'" },
          { name: 'literal', value: "'medium'" },
          { name: 'literal', value: "'semibold'" },
        ],
      },
      description: 'Scanability: Visual weight for content hierarchy',
      defaultValue: { value: "'semibold'", computed: !1 },
    },
  },
};
c.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'CardDescription',
  props: {
    truncate: {
      required: !1,
      tsType: { name: 'boolean' },
      description: 'Cognitive load: Text length awareness for readability',
      defaultValue: { value: 'false', computed: !1 },
    },
    prominence: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'subtle' | 'default'",
        elements: [
          { name: 'literal', value: "'subtle'" },
          { name: 'literal', value: "'default'" },
        ],
      },
      description: 'Information hierarchy: Subtle vs prominent descriptions',
      defaultValue: { value: "'default'", computed: !1 },
    },
  },
};
f.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'CardContent',
  props: {
    density: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'compact' | 'comfortable' | 'spacious'",
        elements: [
          { name: 'literal', value: "'compact'" },
          { name: 'literal', value: "'comfortable'" },
          { name: 'literal', value: "'spacious'" },
        ],
      },
      description: 'Cognitive load: Content density for information hierarchy',
      defaultValue: { value: "'comfortable'", computed: !1 },
    },
    layout: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'default' | 'grid' | 'list'",
        elements: [
          { name: 'literal', value: "'default'" },
          { name: 'literal', value: "'grid'" },
          { name: 'literal', value: "'list'" },
        ],
      },
      description: 'Scanability: Content organization patterns',
      defaultValue: { value: "'default'", computed: !1 },
    },
  },
};
p.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'CardFooter',
  props: {
    density: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'compact' | 'comfortable' | 'spacious'",
        elements: [
          { name: 'literal', value: "'compact'" },
          { name: 'literal', value: "'comfortable'" },
          { name: 'literal', value: "'spacious'" },
        ],
      },
      description: 'Cognitive load: Footer density and action clarity',
      defaultValue: { value: "'comfortable'", computed: !1 },
    },
    justify: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'start' | 'center' | 'end' | 'between'",
        elements: [
          { name: 'literal', value: "'start'" },
          { name: 'literal', value: "'center'" },
          { name: 'literal', value: "'end'" },
          { name: 'literal', value: "'between'" },
        ],
      },
      description: 'Scanability: Action hierarchy in footer',
      defaultValue: { value: "'start'", computed: !1 },
    },
  },
};
export { d as C, m as a, u as b, c, f as d, p as e };
