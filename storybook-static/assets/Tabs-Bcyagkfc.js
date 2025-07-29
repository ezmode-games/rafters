import { r } from './iframe-Cy2I62ob.js';
import { c as G, a as Ie, e as U, d as V, u as k, b as y } from './index-BB5JR4LJ.js';
import { P as R } from './index-DoQPmrLJ.js';
import { u as q } from './index-DuwuiYca.js';
import { u as K, a as he } from './index-LIN26vHB.js';
import { j as l } from './jsx-runtime-BjG_zV1W.js';
import { c as F } from './utils-DuMXYCiK.js';
const P = 'rovingFocusGroup.onEntryFocus';
const Ne = { bubbles: !1, cancelable: !0 };
const A = 'RovingFocusGroup';
const [j, B, xe] = Ie(A);
const [we, z] = G(A, [xe]);
const [Re, Ae] = we(A);
const $ = r.forwardRef((e, t) =>
  l.jsx(j.Provider, {
    scope: e.__scopeRovingFocusGroup,
    children: l.jsx(j.Slot, {
      scope: e.__scopeRovingFocusGroup,
      children: l.jsx(Ee, { ...e, ref: t }),
    }),
  })
);
$.displayName = A;
const Ee = r.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: a,
    orientation: n,
    loop: o = !1,
    dir: i,
    currentTabStopId: u,
    defaultCurrentTabStopId: p,
    onCurrentTabStopIdChange: f,
    onEntryFocus: c,
    preventScrollOnEntryFocus: s = !1,
    ...d
  } = e;
  const v = r.useRef(null);
  const g = q(t, v);
  const x = V(i);
  const [w, m] = k({ prop: u, defaultProp: p ?? null, onChange: f, caller: A });
  const [I, _] = r.useState(!1);
  const T = he(c);
  const h = B(a);
  const S = r.useRef(!1);
  const [ve, D] = r.useState(0);
  return (
    r.useEffect(() => {
      const b = v.current;
      if (b) return b.addEventListener(P, T), () => b.removeEventListener(P, T);
    }, [T]),
    l.jsx(Re, {
      scope: a,
      orientation: n,
      dir: x,
      loop: o,
      currentTabStopId: w,
      onItemFocus: r.useCallback((b) => m(b), [m]),
      onItemShiftTab: r.useCallback(() => _(!0), []),
      onFocusableItemAdd: r.useCallback(() => D((b) => b + 1), []),
      onFocusableItemRemove: r.useCallback(() => D((b) => b - 1), []),
      children: l.jsx(R.div, {
        tabIndex: I || ve === 0 ? -1 : 0,
        'data-orientation': n,
        ...d,
        ref: g,
        style: { outline: 'none', ...e.style },
        onMouseDown: y(e.onMouseDown, () => {
          S.current = !0;
        }),
        onFocus: y(e.onFocus, (b) => {
          const be = !S.current;
          if (b.target === b.currentTarget && be && !I) {
            const L = new CustomEvent(P, Ne);
            if ((b.currentTarget.dispatchEvent(L), !L.defaultPrevented)) {
              const M = h().filter((N) => N.focusable);
              const ge = M.find((N) => N.active);
              const Te = M.find((N) => N.id === w);
              const ye = [ge, Te, ...M].filter(Boolean).map((N) => N.ref.current);
              H(ye, s);
            }
          }
          S.current = !1;
        }),
        onBlur: y(e.onBlur, () => _(!1)),
      }),
    })
  );
});
const W = 'RovingFocusGroupItem';
const Y = r.forwardRef((e, t) => {
  const {
    __scopeRovingFocusGroup: a,
    focusable: n = !0,
    active: o = !1,
    tabStopId: i,
    children: u,
    ...p
  } = e;
  const f = K();
  const c = i || f;
  const s = Ae(W, a);
  const d = s.currentTabStopId === c;
  const v = B(a);
  const { onFocusableItemAdd: g, onFocusableItemRemove: x, currentTabStopId: w } = s;
  return (
    r.useEffect(() => {
      if (n) return g(), () => x();
    }, [n, g, x]),
    l.jsx(j.ItemSlot, {
      scope: a,
      id: c,
      focusable: n,
      active: o,
      children: l.jsx(R.span, {
        tabIndex: d ? 0 : -1,
        'data-orientation': s.orientation,
        ...p,
        ref: t,
        onMouseDown: y(e.onMouseDown, (m) => {
          n ? s.onItemFocus(c) : m.preventDefault();
        }),
        onFocus: y(e.onFocus, () => s.onItemFocus(c)),
        onKeyDown: y(e.onKeyDown, (m) => {
          if (m.key === 'Tab' && m.shiftKey) {
            s.onItemShiftTab();
            return;
          }
          if (m.target !== m.currentTarget) return;
          const I = _e(m, s.orientation, s.dir);
          if (I !== void 0) {
            if (m.metaKey || m.ctrlKey || m.altKey || m.shiftKey) return;
            m.preventDefault();
            let T = v()
              .filter((h) => h.focusable)
              .map((h) => h.ref.current);
            if (I === 'last') T.reverse();
            else if (I === 'prev' || I === 'next') {
              I === 'prev' && T.reverse();
              const h = T.indexOf(m.currentTarget);
              T = s.loop ? Se(T, h + 1) : T.slice(h + 1);
            }
            setTimeout(() => H(T));
          }
        }),
        children: typeof u === 'function' ? u({ isCurrentTabStop: d, hasTabStop: w != null }) : u,
      }),
    })
  );
});
Y.displayName = W;
const Fe = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
};
function Ce(e, t) {
  return t !== 'rtl' ? e : e === 'ArrowLeft' ? 'ArrowRight' : e === 'ArrowRight' ? 'ArrowLeft' : e;
}
function _e(e, t, a) {
  const n = Ce(e.key, a);
  if (
    !(t === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(n)) &&
    !(t === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(n))
  )
    return Fe[n];
}
function H(e, t = !1) {
  const a = document.activeElement;
  for (const n of e)
    if (n === a || (n.focus({ preventScroll: t }), document.activeElement !== a)) return;
}
function Se(e, t) {
  return e.map((a, n) => e[(t + n) % e.length]);
}
const Me = $;
const Pe = Y;
function je(e, t) {
  return r.useReducer((a, n) => t[a][n] ?? a, e);
}
const J = (e) => {
  const { present: t, children: a } = e;
  const n = Oe(t);
  const o = typeof a === 'function' ? a({ present: n.isPresent }) : r.Children.only(a);
  const i = q(n.ref, De(o));
  return typeof a === 'function' || n.isPresent ? r.cloneElement(o, { ref: i }) : null;
};
J.displayName = 'Presence';
function Oe(e) {
  const [t, a] = r.useState();
  const n = r.useRef(null);
  const o = r.useRef(e);
  const i = r.useRef('none');
  const u = e ? 'mounted' : 'unmounted';
  const [p, f] = je(u, {
    mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
    unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
    unmounted: { MOUNT: 'mounted' },
  });
  return (
    r.useEffect(() => {
      const c = E(n.current);
      i.current = p === 'mounted' ? c : 'none';
    }, [p]),
    U(() => {
      const c = n.current;
      const s = o.current;
      if (s !== e) {
        const v = i.current;
        const g = E(c);
        e
          ? f('MOUNT')
          : g === 'none' || (c == null ? void 0 : c.display) === 'none'
            ? f('UNMOUNT')
            : f(s && v !== g ? 'ANIMATION_OUT' : 'UNMOUNT'),
          (o.current = e);
      }
    }, [e, f]),
    U(() => {
      if (t) {
        let c;
        const s = t.ownerDocument.defaultView ?? window;
        const d = (g) => {
          const w = E(n.current).includes(g.animationName);
          if (g.target === t && w && (f('ANIMATION_END'), !o.current)) {
            const m = t.style.animationFillMode;
            (t.style.animationFillMode = 'forwards'),
              (c = s.setTimeout(() => {
                t.style.animationFillMode === 'forwards' && (t.style.animationFillMode = m);
              }));
          }
        };
        const v = (g) => {
          g.target === t && (i.current = E(n.current));
        };
        return (
          t.addEventListener('animationstart', v),
          t.addEventListener('animationcancel', d),
          t.addEventListener('animationend', d),
          () => {
            s.clearTimeout(c),
              t.removeEventListener('animationstart', v),
              t.removeEventListener('animationcancel', d),
              t.removeEventListener('animationend', d);
          }
        );
      }
      f('ANIMATION_END');
    }, [t, f]),
    {
      isPresent: ['mounted', 'unmountSuspended'].includes(p),
      ref: r.useCallback((c) => {
        (n.current = c ? getComputedStyle(c) : null), a(c);
      }, []),
    }
  );
}
function E(e) {
  return (e == null ? void 0 : e.animationName) || 'none';
}
function De(e) {
  let n;
  let o;
  let t = (n = Object.getOwnPropertyDescriptor(e.props, 'ref')) == null ? void 0 : n.get;
  let a = t && 'isReactWarning' in t && t.isReactWarning;
  return a
    ? e.ref
    : ((t = (o = Object.getOwnPropertyDescriptor(e, 'ref')) == null ? void 0 : o.get),
      (a = t && 'isReactWarning' in t && t.isReactWarning),
      a ? e.props.ref : e.props.ref || e.ref);
}
const C = 'Tabs';
const [Le, Ye] = G(C, [z]);
const Q = z();
const [Ue, O] = Le(C);
const X = r.forwardRef((e, t) => {
  const {
    __scopeTabs: a,
    value: n,
    onValueChange: o,
    defaultValue: i,
    orientation: u = 'horizontal',
    dir: p,
    activationMode: f = 'automatic',
    ...c
  } = e;
  const s = V(p);
  const [d, v] = k({ prop: n, onChange: o, defaultProp: i ?? '', caller: C });
  return l.jsx(Ue, {
    scope: a,
    baseId: K(),
    value: d,
    onValueChange: v,
    orientation: u,
    dir: s,
    activationMode: f,
    children: l.jsx(R.div, { dir: s, 'data-orientation': u, ...c, ref: t }),
  });
});
X.displayName = C;
const Z = 'TabsList';
const ee = r.forwardRef((e, t) => {
  const { __scopeTabs: a, loop: n = !0, ...o } = e;
  const i = O(Z, a);
  const u = Q(a);
  return l.jsx(Me, {
    asChild: !0,
    ...u,
    orientation: i.orientation,
    dir: i.dir,
    loop: n,
    children: l.jsx(R.div, { role: 'tablist', 'aria-orientation': i.orientation, ...o, ref: t }),
  });
});
ee.displayName = Z;
const te = 'TabsTrigger';
const ne = r.forwardRef((e, t) => {
  const { __scopeTabs: a, value: n, disabled: o = !1, ...i } = e;
  const u = O(te, a);
  const p = Q(a);
  const f = re(u.baseId, n);
  const c = se(u.baseId, n);
  const s = n === u.value;
  return l.jsx(Pe, {
    asChild: !0,
    ...p,
    focusable: !o,
    active: s,
    children: l.jsx(R.button, {
      type: 'button',
      role: 'tab',
      'aria-selected': s,
      'aria-controls': c,
      'data-state': s ? 'active' : 'inactive',
      'data-disabled': o ? '' : void 0,
      disabled: o,
      id: f,
      ...i,
      ref: t,
      onMouseDown: y(e.onMouseDown, (d) => {
        !o && d.button === 0 && d.ctrlKey === !1 ? u.onValueChange(n) : d.preventDefault();
      }),
      onKeyDown: y(e.onKeyDown, (d) => {
        [' ', 'Enter'].includes(d.key) && u.onValueChange(n);
      }),
      onFocus: y(e.onFocus, () => {
        const d = u.activationMode !== 'manual';
        !s && !o && d && u.onValueChange(n);
      }),
    }),
  });
});
ne.displayName = te;
const ae = 'TabsContent';
const oe = r.forwardRef((e, t) => {
  const { __scopeTabs: a, value: n, forceMount: o, children: i, ...u } = e;
  const p = O(ae, a);
  const f = re(p.baseId, n);
  const c = se(p.baseId, n);
  const s = n === p.value;
  const d = r.useRef(s);
  return (
    r.useEffect(() => {
      const v = requestAnimationFrame(() => (d.current = !1));
      return () => cancelAnimationFrame(v);
    }, []),
    l.jsx(J, {
      present: o || s,
      children: ({ present: v }) =>
        l.jsx(R.div, {
          'data-state': s ? 'active' : 'inactive',
          'data-orientation': p.orientation,
          role: 'tabpanel',
          'aria-labelledby': f,
          hidden: !v,
          id: c,
          tabIndex: 0,
          ...u,
          ref: t,
          style: { ...e.style, animationDuration: d.current ? '0s' : void 0 },
          children: v && i,
        }),
    })
  );
});
oe.displayName = ae;
function re(e, t) {
  return `${e}-trigger-${t}`;
}
function se(e, t) {
  return `${e}-content-${t}`;
}
const ie = X;
const ce = ee;
const ue = ne;
const le = oe;
const de = r.forwardRef(
  ({ cognitiveLoad: e = 'standard', orientation: t = 'horizontal', wayfinding: a = !1, ...n }, o) =>
    l.jsx(ie, { ref: o, orientation: t, className: F('w-full', a && 'tabs-wayfinding'), ...n })
);
de.displayName = ie.displayName;
const fe = r.forwardRef(
  (
    {
      className: e,
      variant: t = 'default',
      density: a = 'comfortable',
      showIndicator: n = !0,
      ...o
    },
    i
  ) =>
    l.jsx(ce, {
      ref: i,
      className: F(
        'inline-flex items-center justify-center text-muted-foreground',
        {
          'rounded-md bg-muted p-1': t === 'default',
          'bg-transparent gap-2': t === 'pills',
          'bg-transparent border-b border-border': t === 'underline',
        },
        {
          'h-8 gap-1': a === 'compact',
          'h-10 gap-2': a === 'comfortable',
          'h-12 gap-3': a === 'spacious',
        },
        e
      ),
      ...o,
    })
);
fe.displayName = ce.displayName;
const me = r.forwardRef(({ className: e, badge: t, icon: a, children: n, disabled: o, ...i }, u) =>
  l.jsxs(ue, {
    ref: u,
    disabled: o,
    className: F(
      'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-disabled',
      'rounded-sm px-3 py-1.5',
      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      'hover:opacity-hover active:scale-active',
      'min-h-[44px] min-w-[44px]',
      e
    ),
    ...i,
    children: [
      a && l.jsx('span', { className: 'mr-2', children: a }),
      l.jsx('span', { children: n }),
      t &&
        l.jsx('span', {
          className:
            'ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground',
          children: t,
        }),
    ],
  })
);
me.displayName = ue.displayName;
const pe = r.forwardRef(({ className: e, loading: t = !1, lazy: a = !1, children: n, ...o }, i) =>
  l.jsx(le, {
    ref: i,
    className: F(
      'mt-2 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      t && 'opacity-50',
      e
    ),
    ...o,
    children: t
      ? l.jsx('div', {
          className: 'flex items-center justify-center p-8',
          children: l.jsx('div', {
            className: 'text-sm text-muted-foreground',
            children: 'Loading content...',
          }),
        })
      : n,
  })
);
pe.displayName = le.displayName;
const Ge = ({ activeTab: e, tabs: t }) => {
  let o;
  const a = t.findIndex((i) => i.value === e);
  const n = (o = t[a]) == null ? void 0 : o.label;
  return l.jsxs('div', {
    className: 'text-xs text-muted-foreground mb-2',
    role: 'status',
    'aria-live': 'polite',
    children: ['Tab ', a + 1, ' of ', t.length, ': ', n],
  });
};
de.__docgenInfo = {
  description: '',
  methods: [],
  props: {
    cognitiveLoad: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'minimal' | 'standard' | 'complex'",
        elements: [
          { name: 'literal', value: "'minimal'" },
          { name: 'literal', value: "'standard'" },
          { name: 'literal', value: "'complex'" },
        ],
      },
      description: '',
      defaultValue: { value: "'standard'", computed: !1 },
    },
    orientation: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'horizontal' | 'vertical'",
        elements: [
          { name: 'literal', value: "'horizontal'" },
          { name: 'literal', value: "'vertical'" },
        ],
      },
      description: '',
      defaultValue: { value: "'horizontal'", computed: !1 },
    },
    wayfinding: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
  },
};
fe.__docgenInfo = {
  description: '',
  methods: [],
  props: {
    variant: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'default' | 'pills' | 'underline'",
        elements: [
          { name: 'literal', value: "'default'" },
          { name: 'literal', value: "'pills'" },
          { name: 'literal', value: "'underline'" },
        ],
      },
      description: '',
      defaultValue: { value: "'default'", computed: !1 },
    },
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
      description: '',
      defaultValue: { value: "'comfortable'", computed: !1 },
    },
    showIndicator: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'true', computed: !1 },
    },
  },
};
me.__docgenInfo = {
  description: '',
  methods: [],
  props: {
    badge: {
      required: !1,
      tsType: {
        name: 'union',
        raw: 'string | number',
        elements: [{ name: 'string' }, { name: 'number' }],
      },
      description: '',
    },
    icon: {
      required: !1,
      tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
      description: '',
    },
    disabled: { required: !1, tsType: { name: 'boolean' }, description: '' },
  },
};
pe.__docgenInfo = {
  description: '',
  methods: [],
  props: {
    loading: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
    lazy: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
  },
};
Ge.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'TabsBreadcrumb',
  props: {
    activeTab: { required: !0, tsType: { name: 'string' }, description: '' },
    tabs: {
      required: !0,
      tsType: {
        name: 'Array',
        elements: [
          {
            name: 'signature',
            type: 'object',
            raw: '{ value: string; label: string }',
            signature: {
              properties: [
                { key: 'value', value: { name: 'string', required: !0 } },
                { key: 'label', value: { name: 'string', required: !0 } },
              ],
            },
          },
        ],
        raw: 'Array<{ value: string; label: string }>',
      },
      description: '',
    },
  },
};
export { de as T, fe as a, me as b, pe as c, Ge as d };
