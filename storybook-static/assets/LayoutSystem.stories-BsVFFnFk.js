import { a as U, c as at, u as z } from './Button-DdyNQfwD.js';
import { r as c, R as oo, e as we } from './iframe-Bh_nZMRn.js';
import { R as Ci, r as mt } from './index-BOc3uOBL.js';
import { j as u } from './jsx-runtime-BjG_zV1W.js';
var Ni = [
    'a',
    'button',
    'div',
    'form',
    'h2',
    'h3',
    'img',
    'input',
    'label',
    'li',
    'nav',
    'ol',
    'p',
    'select',
    'span',
    'svg',
    'ul',
  ],
  D = Ni.reduce((e, t) => {
    const n = at(`Primitive.${t}`),
      o = c.forwardRef((r, s) => {
        const { asChild: i, ...a } = r,
          l = i ? n : t;
        return (
          typeof window < 'u' && (window[Symbol.for('radix-ui')] = !0), u.jsx(l, { ...a, ref: s })
        );
      });
    return (o.displayName = `Primitive.${t}`), { ...e, [t]: o };
  }, {});
function Ei(e, t) {
  e && mt.flushSync(() => e.dispatchEvent(t));
}
var Ri = 'Label',
  ro = c.forwardRef((e, t) =>
    u.jsx(D.label, {
      ...e,
      ref: t,
      onMouseDown: (n) => {
        var r;
        n.target.closest('button, input, select, textarea') ||
          ((r = e.onMouseDown) == null || r.call(e, n),
          !n.defaultPrevented && n.detail > 1 && n.preventDefault());
      },
    })
  );
ro.displayName = Ri;
var io = ro;
const so = c.forwardRef(({ className: e, required: t, children: n, ...o }, r) =>
  u.jsxs(io, {
    ref: r,
    className: U(
      'text-sm font-medium leading-none text-foreground',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-disabled',
      e
    ),
    ...o,
    children: [n, t && u.jsx('span', { className: 'text-destructive ml-1', children: '*' })],
  })
);
so.displayName = io.displayName;
so.__docgenInfo = {
  description: '',
  methods: [],
  props: { required: { required: !1, tsType: { name: 'boolean' }, description: '' } },
};
const ao = c.forwardRef(({ variant: e = 'default', className: t, ...n }, o) =>
  u.jsx('input', {
    ref: o,
    className: U(
      'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-disabled',
      'transition-all duration-200',
      'hover:opacity-hover',
      {
        'border-input bg-background focus-visible:ring-primary': e === 'default',
        'border-destructive bg-destructive/10 focus-visible:ring-destructive': e === 'error',
        'border-success bg-success/10 focus-visible:ring-success': e === 'success',
      },
      t
    ),
    ...n,
  })
);
ao.displayName = 'Input';
ao.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'Input',
  props: {
    variant: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'default' | 'error' | 'success'",
        elements: [
          { name: 'literal', value: "'default'" },
          { name: 'literal', value: "'error'" },
          { name: 'literal', value: "'success'" },
        ],
      },
      description: '',
      defaultValue: { value: "'default'", computed: !1 },
    },
  },
};
const co = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('div', {
    ref: n,
    className: U('rounded-lg border border-border bg-card text-card-foreground shadow-sm', e),
    ...t,
  })
);
co.displayName = 'Card';
const lo = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('div', { ref: n, className: U('flex flex-col space-y-1.5 p-6', e), ...t })
);
lo.displayName = 'CardHeader';
const uo = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('h3', {
    ref: n,
    className: U('text-2xl font-semibold leading-none tracking-tight', e),
    ...t,
  })
);
uo.displayName = 'CardTitle';
const fo = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('p', { ref: n, className: U('text-sm text-muted-foreground', e), ...t })
);
fo.displayName = 'CardDescription';
const po = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('div', { ref: n, className: U('p-6 pt-0', e), ...t })
);
po.displayName = 'CardContent';
const mo = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('div', { ref: n, className: U('flex items-center p-6 pt-0', e), ...t })
);
mo.displayName = 'CardFooter';
co.__docgenInfo = { description: '', methods: [], displayName: 'Card' };
lo.__docgenInfo = { description: '', methods: [], displayName: 'CardHeader' };
uo.__docgenInfo = { description: '', methods: [], displayName: 'CardTitle' };
fo.__docgenInfo = { description: '', methods: [], displayName: 'CardDescription' };
po.__docgenInfo = { description: '', methods: [], displayName: 'CardContent' };
mo.__docgenInfo = { description: '', methods: [], displayName: 'CardFooter' };
function ct(e, [t, n]) {
  return Math.min(n, Math.max(t, e));
}
function O(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return (r) => {
    if ((e == null || e(r), n === !1 || !r.defaultPrevented)) return t == null ? void 0 : t(r);
  };
}
function Ie(e, t = []) {
  let n = [];
  function o(s, i) {
    const a = c.createContext(i),
      l = n.length;
    n = [...n, i];
    const d = (f) => {
      var y;
      const { scope: h, children: v, ...b } = f,
        p = ((y = h == null ? void 0 : h[e]) == null ? void 0 : y[l]) || a,
        g = c.useMemo(() => b, Object.values(b));
      return u.jsx(p.Provider, { value: g, children: v });
    };
    d.displayName = s + 'Provider';
    function m(f, h) {
      var p;
      const v = ((p = h == null ? void 0 : h[e]) == null ? void 0 : p[l]) || a,
        b = c.useContext(v);
      if (b) return b;
      if (i !== void 0) return i;
      throw new Error(`\`${f}\` must be used within \`${s}\``);
    }
    return [d, m];
  }
  const r = () => {
    const s = n.map((i) => c.createContext(i));
    return (a) => {
      const l = (a == null ? void 0 : a[e]) || s;
      return c.useMemo(() => ({ [`__scope${e}`]: { ...a, [e]: l } }), [a, l]);
    };
  };
  return (r.scopeName = e), [o, Pi(r, ...t)];
}
function Pi(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const o = e.map((r) => ({ useScope: r(), scopeName: r.scopeName }));
    return (s) => {
      const i = o.reduce((a, { useScope: l, scopeName: d }) => {
        const f = l(s)[`__scope${d}`];
        return { ...a, ...f };
      }, {});
      return c.useMemo(() => ({ [`__scope${t.scopeName}`]: i }), [i]);
    };
  };
  return (n.scopeName = t.scopeName), n;
}
function Yt(e) {
  const t = e + 'CollectionProvider',
    [n, o] = Ie(t),
    [r, s] = n(t, { collectionRef: { current: null }, itemMap: new Map() }),
    i = (p) => {
      const { scope: g, children: y } = p,
        w = we.useRef(null),
        x = we.useRef(new Map()).current;
      return u.jsx(r, { scope: g, itemMap: x, collectionRef: w, children: y });
    };
  i.displayName = t;
  const a = e + 'CollectionSlot',
    l = at(a),
    d = we.forwardRef((p, g) => {
      const { scope: y, children: w } = p,
        x = s(a, y),
        S = z(g, x.collectionRef);
      return u.jsx(l, { ref: S, children: w });
    });
  d.displayName = a;
  const m = e + 'CollectionItemSlot',
    f = 'data-radix-collection-item',
    h = at(m),
    v = we.forwardRef((p, g) => {
      const { scope: y, children: w, ...x } = p,
        S = we.useRef(null),
        C = z(g, S),
        E = s(m, y);
      return (
        we.useEffect(() => (E.itemMap.set(S, { ref: S, ...x }), () => void E.itemMap.delete(S))),
        u.jsx(h, { [f]: '', ref: C, children: w })
      );
    });
  v.displayName = m;
  function b(p) {
    const g = s(e + 'CollectionConsumer', p);
    return we.useCallback(() => {
      const w = g.collectionRef.current;
      if (!w) return [];
      const x = Array.from(w.querySelectorAll(`[${f}]`));
      return Array.from(g.itemMap.values()).sort(
        (E, N) => x.indexOf(E.ref.current) - x.indexOf(N.ref.current)
      );
    }, [g.collectionRef, g.itemMap]);
  }
  return [{ Provider: i, Slot: d, ItemSlot: v }, b, o];
}
var Ai = c.createContext(void 0);
function Xt(e) {
  const t = c.useContext(Ai);
  return e || t || 'ltr';
}
function me(e) {
  const t = c.useRef(e);
  return (
    c.useEffect(() => {
      t.current = e;
    }),
    c.useMemo(
      () =>
        (...n) => {
          var o;
          return (o = t.current) == null ? void 0 : o.call(t, ...n);
        },
      []
    )
  );
}
function Ti(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = me(e);
  c.useEffect(() => {
    const o = (r) => {
      r.key === 'Escape' && n(r);
    };
    return (
      t.addEventListener('keydown', o, { capture: !0 }),
      () => t.removeEventListener('keydown', o, { capture: !0 })
    );
  }, [n, t]);
}
var Ii = 'DismissableLayer',
  jt = 'dismissableLayer.update',
  _i = 'dismissableLayer.pointerDownOutside',
  Oi = 'dismissableLayer.focusOutside',
  xn,
  ho = c.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  go = c.forwardRef((e, t) => {
    const {
        disableOutsidePointerEvents: n = !1,
        onEscapeKeyDown: o,
        onPointerDownOutside: r,
        onFocusOutside: s,
        onInteractOutside: i,
        onDismiss: a,
        ...l
      } = e,
      d = c.useContext(ho),
      [m, f] = c.useState(null),
      h =
        (m == null ? void 0 : m.ownerDocument) ??
        (globalThis == null ? void 0 : globalThis.document),
      [, v] = c.useState({}),
      b = z(t, (N) => f(N)),
      p = Array.from(d.layers),
      [g] = [...d.layersWithOutsidePointerEventsDisabled].slice(-1),
      y = p.indexOf(g),
      w = m ? p.indexOf(m) : -1,
      x = d.layersWithOutsidePointerEventsDisabled.size > 0,
      S = w >= y,
      C = Li((N) => {
        const R = N.target,
          F = [...d.branches].some((_) => _.contains(R));
        !S || F || (r == null || r(N), i == null || i(N), N.defaultPrevented || a == null || a());
      }, h),
      E = Di((N) => {
        const R = N.target;
        [...d.branches].some((_) => _.contains(R)) ||
          (s == null || s(N), i == null || i(N), N.defaultPrevented || a == null || a());
      }, h);
    return (
      Ti((N) => {
        w === d.layers.size - 1 &&
          (o == null || o(N), !N.defaultPrevented && a && (N.preventDefault(), a()));
      }, h),
      c.useEffect(() => {
        if (m)
          return (
            n &&
              (d.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((xn = h.body.style.pointerEvents), (h.body.style.pointerEvents = 'none')),
              d.layersWithOutsidePointerEventsDisabled.add(m)),
            d.layers.add(m),
            wn(),
            () => {
              n &&
                d.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (h.body.style.pointerEvents = xn);
            }
          );
      }, [m, h, n, d]),
      c.useEffect(
        () => () => {
          m && (d.layers.delete(m), d.layersWithOutsidePointerEventsDisabled.delete(m), wn());
        },
        [m, d]
      ),
      c.useEffect(() => {
        const N = () => v({});
        return document.addEventListener(jt, N), () => document.removeEventListener(jt, N);
      }, []),
      u.jsx(D.div, {
        ...l,
        ref: b,
        style: { pointerEvents: x ? (S ? 'auto' : 'none') : void 0, ...e.style },
        onFocusCapture: O(e.onFocusCapture, E.onFocusCapture),
        onBlurCapture: O(e.onBlurCapture, E.onBlurCapture),
        onPointerDownCapture: O(e.onPointerDownCapture, C.onPointerDownCapture),
      })
    );
  });
go.displayName = Ii;
var Mi = 'DismissableLayerBranch',
  ji = c.forwardRef((e, t) => {
    const n = c.useContext(ho),
      o = c.useRef(null),
      r = z(t, o);
    return (
      c.useEffect(() => {
        const s = o.current;
        if (s)
          return (
            n.branches.add(s),
            () => {
              n.branches.delete(s);
            }
          );
      }, [n.branches]),
      u.jsx(D.div, { ...e, ref: r })
    );
  });
ji.displayName = Mi;
function Li(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = me(e),
    o = c.useRef(!1),
    r = c.useRef(() => {});
  return (
    c.useEffect(() => {
      const s = (a) => {
          if (a.target && !o.current) {
            const l = () => {
              vo(_i, n, d, { discrete: !0 });
            };
            const d = { originalEvent: a };
            a.pointerType === 'touch'
              ? (t.removeEventListener('click', r.current),
                (r.current = l),
                t.addEventListener('click', r.current, { once: !0 }))
              : l();
          } else t.removeEventListener('click', r.current);
          o.current = !1;
        },
        i = window.setTimeout(() => {
          t.addEventListener('pointerdown', s);
        }, 0);
      return () => {
        window.clearTimeout(i),
          t.removeEventListener('pointerdown', s),
          t.removeEventListener('click', r.current);
      };
    }, [t, n]),
    { onPointerDownCapture: () => (o.current = !0) }
  );
}
function Di(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = me(e),
    o = c.useRef(!1);
  return (
    c.useEffect(() => {
      const r = (s) => {
        s.target && !o.current && vo(Oi, n, { originalEvent: s }, { discrete: !1 });
      };
      return t.addEventListener('focusin', r), () => t.removeEventListener('focusin', r);
    }, [t, n]),
    { onFocusCapture: () => (o.current = !0), onBlurCapture: () => (o.current = !1) }
  );
}
function wn() {
  const e = new CustomEvent(jt);
  document.dispatchEvent(e);
}
function vo(e, t, n, { discrete: o }) {
  const r = n.originalEvent.target,
    s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  t && r.addEventListener(e, t, { once: !0 }), o ? Ei(r, s) : r.dispatchEvent(s);
}
var Nt = 0;
function ki() {
  c.useEffect(() => {
    const e = document.querySelectorAll('[data-radix-focus-guard]');
    return (
      document.body.insertAdjacentElement('afterbegin', e[0] ?? bn()),
      document.body.insertAdjacentElement('beforeend', e[1] ?? bn()),
      Nt++,
      () => {
        Nt === 1 &&
          document.querySelectorAll('[data-radix-focus-guard]').forEach((t) => t.remove()),
          Nt--;
      }
    );
  }, []);
}
function bn() {
  const e = document.createElement('span');
  return (
    e.setAttribute('data-radix-focus-guard', ''),
    (e.tabIndex = 0),
    (e.style.outline = 'none'),
    (e.style.opacity = '0'),
    (e.style.position = 'fixed'),
    (e.style.pointerEvents = 'none'),
    e
  );
}
var Et = 'focusScope.autoFocusOnMount',
  Rt = 'focusScope.autoFocusOnUnmount',
  Sn = { bubbles: !1, cancelable: !0 },
  Fi = 'FocusScope',
  yo = c.forwardRef((e, t) => {
    const { loop: n = !1, trapped: o = !1, onMountAutoFocus: r, onUnmountAutoFocus: s, ...i } = e,
      [a, l] = c.useState(null),
      d = me(r),
      m = me(s),
      f = c.useRef(null),
      h = z(t, (p) => l(p)),
      v = c.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    c.useEffect(() => {
      if (o) {
        const p = (x) => {
            if (v.paused || !a) return;
            const S = x.target;
            a.contains(S) ? (f.current = S) : pe(f.current, { select: !0 });
          },
          g = (x) => {
            if (v.paused || !a) return;
            const S = x.relatedTarget;
            S !== null && (a.contains(S) || pe(f.current, { select: !0 }));
          },
          y = (x) => {
            if (document.activeElement === document.body)
              for (const C of x) C.removedNodes.length > 0 && pe(a);
          };
        document.addEventListener('focusin', p), document.addEventListener('focusout', g);
        const w = new MutationObserver(y);
        return (
          a && w.observe(a, { childList: !0, subtree: !0 }),
          () => {
            document.removeEventListener('focusin', p),
              document.removeEventListener('focusout', g),
              w.disconnect();
          }
        );
      }
    }, [o, a, v.paused]),
      c.useEffect(() => {
        if (a) {
          Nn.add(v);
          const p = document.activeElement;
          if (!a.contains(p)) {
            const y = new CustomEvent(Et, Sn);
            a.addEventListener(Et, d),
              a.dispatchEvent(y),
              y.defaultPrevented ||
                (Bi(Ui(xo(a)), { select: !0 }), document.activeElement === p && pe(a));
          }
          return () => {
            a.removeEventListener(Et, d),
              setTimeout(() => {
                const y = new CustomEvent(Rt, Sn);
                a.addEventListener(Rt, m),
                  a.dispatchEvent(y),
                  y.defaultPrevented || pe(p ?? document.body, { select: !0 }),
                  a.removeEventListener(Rt, m),
                  Nn.remove(v);
              }, 0);
          };
        }
      }, [a, d, m, v]);
    const b = c.useCallback(
      (p) => {
        if ((!n && !o) || v.paused) return;
        const g = p.key === 'Tab' && !p.altKey && !p.ctrlKey && !p.metaKey,
          y = document.activeElement;
        if (g && y) {
          const w = p.currentTarget,
            [x, S] = $i(w);
          x && S
            ? !p.shiftKey && y === S
              ? (p.preventDefault(), n && pe(x, { select: !0 }))
              : p.shiftKey && y === x && (p.preventDefault(), n && pe(S, { select: !0 }))
            : y === w && p.preventDefault();
        }
      },
      [n, o, v.paused]
    );
    return u.jsx(D.div, { tabIndex: -1, ...i, ref: h, onKeyDown: b });
  });
yo.displayName = Fi;
function Bi(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const o of e) if ((pe(o, { select: t }), document.activeElement !== n)) return;
}
function $i(e) {
  const t = xo(e),
    n = Cn(t, e),
    o = Cn(t.reverse(), e);
  return [n, o];
}
function xo(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (o) => {
        const r = o.tagName === 'INPUT' && o.type === 'hidden';
        return o.disabled || o.hidden || r
          ? NodeFilter.FILTER_SKIP
          : o.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  while (n.nextNode()) t.push(n.currentNode);
  return t;
}
function Cn(e, t) {
  for (const n of e) if (!Wi(n, { upTo: t })) return n;
}
function Wi(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === 'hidden') return !0;
  while (e) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === 'none') return !0;
    e = e.parentElement;
  }
  return !1;
}
function Hi(e) {
  return e instanceof HTMLInputElement && 'select' in e;
}
function pe(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    e.focus({ preventScroll: !0 }), e !== n && Hi(e) && t && e.select();
  }
}
var Nn = Vi();
function Vi() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      t !== n && (n == null || n.pause()), (e = En(e, t)), e.unshift(t);
    },
    remove(t) {
      var n;
      (e = En(e, t)), (n = e[0]) == null || n.resume();
    },
  };
}
function En(e, t) {
  const n = [...e],
    o = n.indexOf(t);
  return o !== -1 && n.splice(o, 1), n;
}
function Ui(e) {
  return e.filter((t) => t.tagName !== 'A');
}
var Y = globalThis != null && globalThis.document ? c.useLayoutEffect : () => {},
  Ki = oo[' useId '.trim().toString()] || (() => {}),
  zi = 0;
function ht(e) {
  const [t, n] = c.useState(Ki());
  return (
    Y(() => {
      n((o) => o ?? String(zi++));
    }, [e]),
    t ? `radix-${t}` : ''
  );
}
const Gi = ['top', 'right', 'bottom', 'left'],
  he = Math.min,
  Z = Math.max,
  lt = Math.round,
  Qe = Math.floor,
  se = (e) => ({ x: e, y: e }),
  Yi = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' },
  Xi = { start: 'end', end: 'start' };
function Lt(e, t, n) {
  return Z(e, he(t, n));
}
function de(e, t) {
  return typeof e == 'function' ? e(t) : e;
}
function ue(e) {
  return e.split('-')[0];
}
function _e(e) {
  return e.split('-')[1];
}
function qt(e) {
  return e === 'x' ? 'y' : 'x';
}
function Zt(e) {
  return e === 'y' ? 'height' : 'width';
}
function ie(e) {
  return ['top', 'bottom'].includes(ue(e)) ? 'y' : 'x';
}
function Qt(e) {
  return qt(ie(e));
}
function qi(e, t, n) {
  n === void 0 && (n = !1);
  const o = _e(e),
    r = Qt(e),
    s = Zt(r);
  let i =
    r === 'x' ? (o === (n ? 'end' : 'start') ? 'right' : 'left') : o === 'start' ? 'bottom' : 'top';
  return t.reference[s] > t.floating[s] && (i = dt(i)), [i, dt(i)];
}
function Zi(e) {
  const t = dt(e);
  return [Dt(e), t, Dt(t)];
}
function Dt(e) {
  return e.replace(/start|end/g, (t) => Xi[t]);
}
function Qi(e, t, n) {
  const o = ['left', 'right'],
    r = ['right', 'left'],
    s = ['top', 'bottom'],
    i = ['bottom', 'top'];
  switch (e) {
    case 'top':
    case 'bottom':
      return n ? (t ? r : o) : t ? o : r;
    case 'left':
    case 'right':
      return t ? s : i;
    default:
      return [];
  }
}
function Ji(e, t, n, o) {
  const r = _e(e);
  let s = Qi(ue(e), n === 'start', o);
  return r && ((s = s.map((i) => i + '-' + r)), t && (s = s.concat(s.map(Dt)))), s;
}
function dt(e) {
  return e.replace(/left|right|bottom|top/g, (t) => Yi[t]);
}
function es(e) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...e };
}
function wo(e) {
  return typeof e != 'number' ? es(e) : { top: e, right: e, bottom: e, left: e };
}
function ut(e) {
  const { x: t, y: n, width: o, height: r } = e;
  return { width: o, height: r, top: n, left: t, right: t + o, bottom: n + r, x: t, y: n };
}
function Rn(e, t, n) {
  const { reference: o, floating: r } = e;
  const s = ie(t),
    i = Qt(t),
    a = Zt(i),
    l = ue(t),
    d = s === 'y',
    m = o.x + o.width / 2 - r.width / 2,
    f = o.y + o.height / 2 - r.height / 2,
    h = o[a] / 2 - r[a] / 2;
  let v;
  switch (l) {
    case 'top':
      v = { x: m, y: o.y - r.height };
      break;
    case 'bottom':
      v = { x: m, y: o.y + o.height };
      break;
    case 'right':
      v = { x: o.x + o.width, y: f };
      break;
    case 'left':
      v = { x: o.x - r.width, y: f };
      break;
    default:
      v = { x: o.x, y: o.y };
  }
  switch (_e(t)) {
    case 'start':
      v[i] -= h * (n && d ? -1 : 1);
      break;
    case 'end':
      v[i] += h * (n && d ? -1 : 1);
      break;
  }
  return v;
}
const ts = async (e, t, n) => {
  const { placement: o = 'bottom', strategy: r = 'absolute', middleware: s = [], platform: i } = n,
    a = s.filter(Boolean),
    l = await (i.isRTL == null ? void 0 : i.isRTL(t));
  let d = await i.getElementRects({ reference: e, floating: t, strategy: r }),
    { x: m, y: f } = Rn(d, o, l),
    h = o,
    v = {},
    b = 0;
  for (let p = 0; p < a.length; p++) {
    const { name: g, fn: y } = a[p],
      {
        x: w,
        y: x,
        data: S,
        reset: C,
      } = await y({
        x: m,
        y: f,
        initialPlacement: o,
        placement: h,
        strategy: r,
        middlewareData: v,
        rects: d,
        platform: i,
        elements: { reference: e, floating: t },
      });
    (m = w ?? m),
      (f = x ?? f),
      (v = { ...v, [g]: { ...v[g], ...S } }),
      C &&
        b <= 50 &&
        (b++,
        typeof C == 'object' &&
          (C.placement && (h = C.placement),
          C.rects &&
            (d =
              C.rects === !0
                ? await i.getElementRects({ reference: e, floating: t, strategy: r })
                : C.rects),
          ({ x: m, y: f } = Rn(d, h, l))),
        (p = -1));
  }
  return { x: m, y: f, placement: h, strategy: r, middlewareData: v };
};
async function Ge(e, t) {
  var n;
  t === void 0 && (t = {});
  const { x: o, y: r, platform: s, rects: i, elements: a, strategy: l } = e,
    {
      boundary: d = 'clippingAncestors',
      rootBoundary: m = 'viewport',
      elementContext: f = 'floating',
      altBoundary: h = !1,
      padding: v = 0,
    } = de(t, e),
    b = wo(v),
    g = a[h ? (f === 'floating' ? 'reference' : 'floating') : f],
    y = ut(
      await s.getClippingRect({
        element:
          (n = await (s.isElement == null ? void 0 : s.isElement(g))) == null || n
            ? g
            : g.contextElement ||
              (await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating))),
        boundary: d,
        rootBoundary: m,
        strategy: l,
      })
    ),
    w =
      f === 'floating'
        ? { x: o, y: r, width: i.floating.width, height: i.floating.height }
        : i.reference,
    x = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)),
    S = (await (s.isElement == null ? void 0 : s.isElement(x)))
      ? (await (s.getScale == null ? void 0 : s.getScale(x))) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    C = ut(
      s.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: a,
            rect: w,
            offsetParent: x,
            strategy: l,
          })
        : w
    );
  return {
    top: (y.top - C.top + b.top) / S.y,
    bottom: (C.bottom - y.bottom + b.bottom) / S.y,
    left: (y.left - C.left + b.left) / S.x,
    right: (C.right - y.right + b.right) / S.x,
  };
}
const ns = (e) => ({
    name: 'arrow',
    options: e,
    async fn(t) {
      const { x: n, y: o, placement: r, rects: s, platform: i, elements: a, middlewareData: l } = t,
        { element: d, padding: m = 0 } = de(e, t) || {};
      if (d == null) return {};
      const f = wo(m),
        h = { x: n, y: o },
        v = Qt(r),
        b = Zt(v),
        p = await i.getDimensions(d),
        g = v === 'y',
        y = g ? 'top' : 'left',
        w = g ? 'bottom' : 'right',
        x = g ? 'clientHeight' : 'clientWidth',
        S = s.reference[b] + s.reference[v] - h[v] - s.floating[b],
        C = h[v] - s.reference[v],
        E = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(d));
      let N = E ? E[x] : 0;
      (!N || !(await (i.isElement == null ? void 0 : i.isElement(E)))) &&
        (N = a.floating[x] || s.floating[b]);
      const R = S / 2 - C / 2,
        F = N / 2 - p[b] / 2 - 1,
        _ = he(f[y], F),
        T = he(f[w], F),
        j = _,
        M = N - p[b] - T,
        k = N / 2 - p[b] / 2 + R,
        H = Lt(j, k, M),
        I =
          !l.arrow &&
          _e(r) != null &&
          k !== H &&
          s.reference[b] / 2 - (k < j ? _ : T) - p[b] / 2 < 0,
        L = I ? (k < j ? k - j : k - M) : 0;
      return {
        [v]: h[v] + L,
        data: { [v]: H, centerOffset: k - H - L, ...(I && { alignmentOffset: L }) },
        reset: I,
      };
    },
  }),
  os = (e) => (
    e === void 0 && (e = {}),
    {
      name: 'flip',
      options: e,
      async fn(t) {
        var n, o;
        const {
            placement: r,
            middlewareData: s,
            rects: i,
            initialPlacement: a,
            platform: l,
            elements: d,
          } = t,
          {
            mainAxis: m = !0,
            crossAxis: f = !0,
            fallbackPlacements: h,
            fallbackStrategy: v = 'bestFit',
            fallbackAxisSideDirection: b = 'none',
            flipAlignment: p = !0,
            ...g
          } = de(e, t);
        if ((n = s.arrow) != null && n.alignmentOffset) return {};
        const y = ue(r),
          w = ie(a),
          x = ue(a) === a,
          S = await (l.isRTL == null ? void 0 : l.isRTL(d.floating)),
          C = h || (x || !p ? [dt(a)] : Zi(a)),
          E = b !== 'none';
        !h && E && C.push(...Ji(a, p, b, S));
        const N = [a, ...C],
          R = await Ge(t, g),
          F = [];
        let _ = ((o = s.flip) == null ? void 0 : o.overflows) || [];
        if ((m && F.push(R[y]), f)) {
          const k = qi(r, i, S);
          F.push(R[k[0]], R[k[1]]);
        }
        if (((_ = [..._, { placement: r, overflows: F }]), !F.every((k) => k <= 0))) {
          var T, j;
          const k = (((T = s.flip) == null ? void 0 : T.index) || 0) + 1,
            H = N[k];
          if (
            H &&
            (!(f === 'alignment' ? w !== ie(H) : !1) ||
              _.every((P) => P.overflows[0] > 0 && ie(P.placement) === w))
          )
            return { data: { index: k, overflows: _ }, reset: { placement: H } };
          let I =
            (j = _.filter((L) => L.overflows[0] <= 0).sort(
              (L, P) => L.overflows[1] - P.overflows[1]
            )[0]) == null
              ? void 0
              : j.placement;
          if (!I)
            switch (v) {
              case 'bestFit': {
                var M;
                const L =
                  (M = _.filter((P) => {
                    if (E) {
                      const B = ie(P.placement);
                      return B === w || B === 'y';
                    }
                    return !0;
                  })
                    .map((P) => [
                      P.placement,
                      P.overflows.filter((B) => B > 0).reduce((B, X) => B + X, 0),
                    ])
                    .sort((P, B) => P[1] - B[1])[0]) == null
                    ? void 0
                    : M[0];
                L && (I = L);
                break;
              }
              case 'initialPlacement':
                I = a;
                break;
            }
          if (r !== I) return { reset: { placement: I } };
        }
        return {};
      },
    }
  );
function Pn(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width,
  };
}
function An(e) {
  return Gi.some((t) => e[t] >= 0);
}
const rs = (e) => (
  e === void 0 && (e = {}),
  {
    name: 'hide',
    options: e,
    async fn(t) {
      const { rects: n } = t,
        { strategy: o = 'referenceHidden', ...r } = de(e, t);
      switch (o) {
        case 'referenceHidden': {
          const s = await Ge(t, { ...r, elementContext: 'reference' }),
            i = Pn(s, n.reference);
          return { data: { referenceHiddenOffsets: i, referenceHidden: An(i) } };
        }
        case 'escaped': {
          const s = await Ge(t, { ...r, altBoundary: !0 }),
            i = Pn(s, n.floating);
          return { data: { escapedOffsets: i, escaped: An(i) } };
        }
        default:
          return {};
      }
    },
  }
);
async function is(e, t) {
  const { placement: n, platform: o, elements: r } = e,
    s = await (o.isRTL == null ? void 0 : o.isRTL(r.floating)),
    i = ue(n),
    a = _e(n),
    l = ie(n) === 'y',
    d = ['left', 'top'].includes(i) ? -1 : 1,
    m = s && l ? -1 : 1,
    f = de(t, e);
  let {
    mainAxis: h,
    crossAxis: v,
    alignmentAxis: b,
  } = typeof f == 'number'
    ? { mainAxis: f, crossAxis: 0, alignmentAxis: null }
    : { mainAxis: f.mainAxis || 0, crossAxis: f.crossAxis || 0, alignmentAxis: f.alignmentAxis };
  return (
    a && typeof b == 'number' && (v = a === 'end' ? b * -1 : b),
    l ? { x: v * m, y: h * d } : { x: h * d, y: v * m }
  );
}
const ss = (e) => (
    e === void 0 && (e = 0),
    {
      name: 'offset',
      options: e,
      async fn(t) {
        var n, o;
        const { x: r, y: s, placement: i, middlewareData: a } = t,
          l = await is(t, e);
        return i === ((n = a.offset) == null ? void 0 : n.placement) &&
          (o = a.arrow) != null &&
          o.alignmentOffset
          ? {}
          : { x: r + l.x, y: s + l.y, data: { ...l, placement: i } };
      },
    }
  ),
  as = (e) => (
    e === void 0 && (e = {}),
    {
      name: 'shift',
      options: e,
      async fn(t) {
        const { x: n, y: o, placement: r } = t,
          {
            mainAxis: s = !0,
            crossAxis: i = !1,
            limiter: a = {
              fn: (g) => {
                const { x: y, y: w } = g;
                return { x: y, y: w };
              },
            },
            ...l
          } = de(e, t),
          d = { x: n, y: o },
          m = await Ge(t, l),
          f = ie(ue(r)),
          h = qt(f);
        let v = d[h],
          b = d[f];
        if (s) {
          const g = h === 'y' ? 'top' : 'left',
            y = h === 'y' ? 'bottom' : 'right',
            w = v + m[g],
            x = v - m[y];
          v = Lt(w, v, x);
        }
        if (i) {
          const g = f === 'y' ? 'top' : 'left',
            y = f === 'y' ? 'bottom' : 'right',
            w = b + m[g],
            x = b - m[y];
          b = Lt(w, b, x);
        }
        const p = a.fn({ ...t, [h]: v, [f]: b });
        return { ...p, data: { x: p.x - n, y: p.y - o, enabled: { [h]: s, [f]: i } } };
      },
    }
  ),
  cs = (e) => (
    e === void 0 && (e = {}),
    {
      options: e,
      fn(t) {
        const { x: n, y: o, placement: r, rects: s, middlewareData: i } = t,
          { offset: a = 0, mainAxis: l = !0, crossAxis: d = !0 } = de(e, t),
          m = { x: n, y: o },
          f = ie(r),
          h = qt(f);
        let v = m[h],
          b = m[f];
        const p = de(a, t),
          g =
            typeof p == 'number'
              ? { mainAxis: p, crossAxis: 0 }
              : { mainAxis: 0, crossAxis: 0, ...p };
        if (l) {
          const x = h === 'y' ? 'height' : 'width',
            S = s.reference[h] - s.floating[x] + g.mainAxis,
            C = s.reference[h] + s.reference[x] - g.mainAxis;
          v < S ? (v = S) : v > C && (v = C);
        }
        if (d) {
          var y, w;
          const x = h === 'y' ? 'width' : 'height',
            S = ['top', 'left'].includes(ue(r)),
            C =
              s.reference[f] -
              s.floating[x] +
              ((S && ((y = i.offset) == null ? void 0 : y[f])) || 0) +
              (S ? 0 : g.crossAxis),
            E =
              s.reference[f] +
              s.reference[x] +
              (S ? 0 : ((w = i.offset) == null ? void 0 : w[f]) || 0) -
              (S ? g.crossAxis : 0);
          b < C ? (b = C) : b > E && (b = E);
        }
        return { [h]: v, [f]: b };
      },
    }
  ),
  ls = (e) => (
    e === void 0 && (e = {}),
    {
      name: 'size',
      options: e,
      async fn(t) {
        var n, o;
        const { placement: r, rects: s, platform: i, elements: a } = t,
          { apply: l = () => {}, ...d } = de(e, t),
          m = await Ge(t, d),
          f = ue(r),
          h = _e(r),
          v = ie(r) === 'y',
          { width: b, height: p } = s.floating;
        let g, y;
        f === 'top' || f === 'bottom'
          ? ((g = f),
            (y =
              h === ((await (i.isRTL == null ? void 0 : i.isRTL(a.floating))) ? 'start' : 'end')
                ? 'left'
                : 'right'))
          : ((y = f), (g = h === 'end' ? 'top' : 'bottom'));
        const w = p - m.top - m.bottom,
          x = b - m.left - m.right,
          S = he(p - m[g], w),
          C = he(b - m[y], x),
          E = !t.middlewareData.shift;
        let N = S,
          R = C;
        if (
          ((n = t.middlewareData.shift) != null && n.enabled.x && (R = x),
          (o = t.middlewareData.shift) != null && o.enabled.y && (N = w),
          E && !h)
        ) {
          const _ = Z(m.left, 0),
            T = Z(m.right, 0),
            j = Z(m.top, 0),
            M = Z(m.bottom, 0);
          v
            ? (R = b - 2 * (_ !== 0 || T !== 0 ? _ + T : Z(m.left, m.right)))
            : (N = p - 2 * (j !== 0 || M !== 0 ? j + M : Z(m.top, m.bottom)));
        }
        await l({ ...t, availableWidth: R, availableHeight: N });
        const F = await i.getDimensions(a.floating);
        return b !== F.width || p !== F.height ? { reset: { rects: !0 } } : {};
      },
    }
  );
function gt() {
  return typeof window < 'u';
}
function Oe(e) {
  return bo(e) ? (e.nodeName || '').toLowerCase() : '#document';
}
function Q(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ce(e) {
  var t;
  return (t = (bo(e) ? e.ownerDocument : e.document) || window.document) == null
    ? void 0
    : t.documentElement;
}
function bo(e) {
  return gt() ? e instanceof Node || e instanceof Q(e).Node : !1;
}
function te(e) {
  return gt() ? e instanceof Element || e instanceof Q(e).Element : !1;
}
function ae(e) {
  return gt() ? e instanceof HTMLElement || e instanceof Q(e).HTMLElement : !1;
}
function Tn(e) {
  return !gt() || typeof ShadowRoot > 'u'
    ? !1
    : e instanceof ShadowRoot || e instanceof Q(e).ShadowRoot;
}
function Xe(e) {
  const { overflow: t, overflowX: n, overflowY: o, display: r } = ne(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + o + n) && !['inline', 'contents'].includes(r);
}
function ds(e) {
  return ['table', 'td', 'th'].includes(Oe(e));
}
function vt(e) {
  return [':popover-open', ':modal'].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function Jt(e) {
  const t = en(),
    n = te(e) ? ne(e) : e;
  return (
    ['transform', 'translate', 'scale', 'rotate', 'perspective'].some((o) =>
      n[o] ? n[o] !== 'none' : !1
    ) ||
    (n.containerType ? n.containerType !== 'normal' : !1) ||
    (!t && (n.backdropFilter ? n.backdropFilter !== 'none' : !1)) ||
    (!t && (n.filter ? n.filter !== 'none' : !1)) ||
    ['transform', 'translate', 'scale', 'rotate', 'perspective', 'filter'].some((o) =>
      (n.willChange || '').includes(o)
    ) ||
    ['paint', 'layout', 'strict', 'content'].some((o) => (n.contain || '').includes(o))
  );
}
function us(e) {
  let t = ge(e);
  while (ae(t) && !Te(t)) {
    if (Jt(t)) return t;
    if (vt(t)) return null;
    t = ge(t);
  }
  return null;
}
function en() {
  return typeof CSS > 'u' || !CSS.supports ? !1 : CSS.supports('-webkit-backdrop-filter', 'none');
}
function Te(e) {
  return ['html', 'body', '#document'].includes(Oe(e));
}
function ne(e) {
  return Q(e).getComputedStyle(e);
}
function yt(e) {
  return te(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
}
function ge(e) {
  if (Oe(e) === 'html') return e;
  const t = e.assignedSlot || e.parentNode || (Tn(e) && e.host) || ce(e);
  return Tn(t) ? t.host : t;
}
function So(e) {
  const t = ge(e);
  return Te(t) ? (e.ownerDocument ? e.ownerDocument.body : e.body) : ae(t) && Xe(t) ? t : So(t);
}
function Ye(e, t, n) {
  var o;
  t === void 0 && (t = []), n === void 0 && (n = !0);
  const r = So(e),
    s = r === ((o = e.ownerDocument) == null ? void 0 : o.body),
    i = Q(r);
  if (s) {
    const a = kt(i);
    return t.concat(i, i.visualViewport || [], Xe(r) ? r : [], a && n ? Ye(a) : []);
  }
  return t.concat(r, Ye(r, [], n));
}
function kt(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Co(e) {
  const t = ne(e);
  let n = Number.parseFloat(t.width) || 0,
    o = Number.parseFloat(t.height) || 0;
  const r = ae(e),
    s = r ? e.offsetWidth : n,
    i = r ? e.offsetHeight : o,
    a = lt(n) !== s || lt(o) !== i;
  return a && ((n = s), (o = i)), { width: n, height: o, $: a };
}
function tn(e) {
  return te(e) ? e : e.contextElement;
}
function Pe(e) {
  const t = tn(e);
  if (!ae(t)) return se(1);
  const n = t.getBoundingClientRect(),
    { width: o, height: r, $: s } = Co(t);
  let i = (s ? lt(n.width) : n.width) / o,
    a = (s ? lt(n.height) : n.height) / r;
  return (
    (!i || !Number.isFinite(i)) && (i = 1), (!a || !Number.isFinite(a)) && (a = 1), { x: i, y: a }
  );
}
const fs = se(0);
function No(e) {
  const t = Q(e);
  return !en() || !t.visualViewport
    ? fs
    : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function ps(e, t, n) {
  return t === void 0 && (t = !1), !n || (t && n !== Q(e)) ? !1 : t;
}
function be(e, t, n, o) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const r = e.getBoundingClientRect(),
    s = tn(e);
  let i = se(1);
  t && (o ? te(o) && (i = Pe(o)) : (i = Pe(e)));
  const a = ps(s, n, o) ? No(s) : se(0);
  let l = (r.left + a.x) / i.x,
    d = (r.top + a.y) / i.y,
    m = r.width / i.x,
    f = r.height / i.y;
  if (s) {
    const h = Q(s),
      v = o && te(o) ? Q(o) : o;
    let b = h,
      p = kt(b);
    while (p && o && v !== b) {
      const g = Pe(p),
        y = p.getBoundingClientRect(),
        w = ne(p),
        x = y.left + (p.clientLeft + Number.parseFloat(w.paddingLeft)) * g.x,
        S = y.top + (p.clientTop + Number.parseFloat(w.paddingTop)) * g.y;
      (l *= g.x), (d *= g.y), (m *= g.x), (f *= g.y), (l += x), (d += S), (b = Q(p)), (p = kt(b));
    }
  }
  return ut({ width: m, height: f, x: l, y: d });
}
function nn(e, t) {
  const n = yt(e).scrollLeft;
  return t ? t.left + n : be(ce(e)).left + n;
}
function Eo(e, t, n) {
  n === void 0 && (n = !1);
  const o = e.getBoundingClientRect(),
    r = o.left + t.scrollLeft - (n ? 0 : nn(e, o)),
    s = o.top + t.scrollTop;
  return { x: r, y: s };
}
function ms(e) {
  const { elements: t, rect: n, offsetParent: o, strategy: r } = e;
  const s = r === 'fixed',
    i = ce(o),
    a = t ? vt(t.floating) : !1;
  if (o === i || (a && s)) return n;
  let l = { scrollLeft: 0, scrollTop: 0 },
    d = se(1);
  const m = se(0),
    f = ae(o);
  if ((f || (!f && !s)) && ((Oe(o) !== 'body' || Xe(i)) && (l = yt(o)), ae(o))) {
    const v = be(o);
    (d = Pe(o)), (m.x = v.x + o.clientLeft), (m.y = v.y + o.clientTop);
  }
  const h = i && !f && !s ? Eo(i, l, !0) : se(0);
  return {
    width: n.width * d.x,
    height: n.height * d.y,
    x: n.x * d.x - l.scrollLeft * d.x + m.x + h.x,
    y: n.y * d.y - l.scrollTop * d.y + m.y + h.y,
  };
}
function hs(e) {
  return Array.from(e.getClientRects());
}
function gs(e) {
  const t = ce(e),
    n = yt(e),
    o = e.ownerDocument.body,
    r = Z(t.scrollWidth, t.clientWidth, o.scrollWidth, o.clientWidth),
    s = Z(t.scrollHeight, t.clientHeight, o.scrollHeight, o.clientHeight);
  let i = -n.scrollLeft + nn(e);
  const a = -n.scrollTop;
  return (
    ne(o).direction === 'rtl' && (i += Z(t.clientWidth, o.clientWidth) - r),
    { width: r, height: s, x: i, y: a }
  );
}
function vs(e, t) {
  const n = Q(e),
    o = ce(e),
    r = n.visualViewport;
  let s = o.clientWidth,
    i = o.clientHeight,
    a = 0,
    l = 0;
  if (r) {
    (s = r.width), (i = r.height);
    const d = en();
    (!d || (d && t === 'fixed')) && ((a = r.offsetLeft), (l = r.offsetTop));
  }
  return { width: s, height: i, x: a, y: l };
}
function ys(e, t) {
  const n = be(e, !0, t === 'fixed'),
    o = n.top + e.clientTop,
    r = n.left + e.clientLeft,
    s = ae(e) ? Pe(e) : se(1),
    i = e.clientWidth * s.x,
    a = e.clientHeight * s.y,
    l = r * s.x,
    d = o * s.y;
  return { width: i, height: a, x: l, y: d };
}
function In(e, t, n) {
  let o;
  if (t === 'viewport') o = vs(e, n);
  else if (t === 'document') o = gs(ce(e));
  else if (te(t)) o = ys(t, n);
  else {
    const r = No(e);
    o = { x: t.x - r.x, y: t.y - r.y, width: t.width, height: t.height };
  }
  return ut(o);
}
function Ro(e, t) {
  const n = ge(e);
  return n === t || !te(n) || Te(n) ? !1 : ne(n).position === 'fixed' || Ro(n, t);
}
function xs(e, t) {
  const n = t.get(e);
  if (n) return n;
  let o = Ye(e, [], !1).filter((a) => te(a) && Oe(a) !== 'body'),
    r = null;
  const s = ne(e).position === 'fixed';
  let i = s ? ge(e) : e;
  while (te(i) && !Te(i)) {
    const a = ne(i),
      l = Jt(i);
    !l && a.position === 'fixed' && (r = null),
      (
        s
          ? !l && !r
          : (!l && a.position === 'static' && !!r && ['absolute', 'fixed'].includes(r.position)) ||
            (Xe(i) && !l && Ro(e, i))
      )
        ? (o = o.filter((m) => m !== i))
        : (r = a),
      (i = ge(i));
  }
  return t.set(e, o), o;
}
function ws(e) {
  const { element: t, boundary: n, rootBoundary: o, strategy: r } = e;
  const i = [...(n === 'clippingAncestors' ? (vt(t) ? [] : xs(t, this._c)) : [].concat(n)), o],
    a = i[0],
    l = i.reduce(
      (d, m) => {
        const f = In(t, m, r);
        return (
          (d.top = Z(f.top, d.top)),
          (d.right = he(f.right, d.right)),
          (d.bottom = he(f.bottom, d.bottom)),
          (d.left = Z(f.left, d.left)),
          d
        );
      },
      In(t, a, r)
    );
  return { width: l.right - l.left, height: l.bottom - l.top, x: l.left, y: l.top };
}
function bs(e) {
  const { width: t, height: n } = Co(e);
  return { width: t, height: n };
}
function Ss(e, t, n) {
  const o = ae(t),
    r = ce(t),
    s = n === 'fixed',
    i = be(e, !0, s, t);
  let a = { scrollLeft: 0, scrollTop: 0 };
  const l = se(0);
  function d() {
    l.x = nn(r);
  }
  if (o || (!o && !s))
    if (((Oe(t) !== 'body' || Xe(r)) && (a = yt(t)), o)) {
      const v = be(t, !0, s, t);
      (l.x = v.x + t.clientLeft), (l.y = v.y + t.clientTop);
    } else r && d();
  s && !o && r && d();
  const m = r && !o && !s ? Eo(r, a) : se(0),
    f = i.left + a.scrollLeft - l.x - m.x,
    h = i.top + a.scrollTop - l.y - m.y;
  return { x: f, y: h, width: i.width, height: i.height };
}
function Pt(e) {
  return ne(e).position === 'static';
}
function _n(e, t) {
  if (!ae(e) || ne(e).position === 'fixed') return null;
  if (t) return t(e);
  let n = e.offsetParent;
  return ce(e) === n && (n = n.ownerDocument.body), n;
}
function Po(e, t) {
  const n = Q(e);
  if (vt(e)) return n;
  if (!ae(e)) {
    let r = ge(e);
    while (r && !Te(r)) {
      if (te(r) && !Pt(r)) return r;
      r = ge(r);
    }
    return n;
  }
  let o = _n(e, t);
  while (o && ds(o) && Pt(o)) o = _n(o, t);
  return o && Te(o) && Pt(o) && !Jt(o) ? n : o || us(e) || n;
}
const Cs = async function (e) {
  const t = this.getOffsetParent || Po,
    n = this.getDimensions,
    o = await n(e.floating);
  return {
    reference: Ss(e.reference, await t(e.floating), e.strategy),
    floating: { x: 0, y: 0, width: o.width, height: o.height },
  };
};
function Ns(e) {
  return ne(e).direction === 'rtl';
}
const Es = {
  convertOffsetParentRelativeRectToViewportRelativeRect: ms,
  getDocumentElement: ce,
  getClippingRect: ws,
  getOffsetParent: Po,
  getElementRects: Cs,
  getClientRects: hs,
  getDimensions: bs,
  getScale: Pe,
  isElement: te,
  isRTL: Ns,
};
function Ao(e, t) {
  return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Rs(e, t) {
  let n = null,
    o;
  const r = ce(e);
  function s() {
    var a;
    clearTimeout(o), (a = n) == null || a.disconnect(), (n = null);
  }
  function i(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const d = e.getBoundingClientRect(),
      { left: m, top: f, width: h, height: v } = d;
    if ((a || t(), !h || !v)) return;
    const b = Qe(f),
      p = Qe(r.clientWidth - (m + h)),
      g = Qe(r.clientHeight - (f + v)),
      y = Qe(m),
      x = {
        rootMargin: -b + 'px ' + -p + 'px ' + -g + 'px ' + -y + 'px',
        threshold: Z(0, he(1, l)) || 1,
      };
    let S = !0;
    function C(E) {
      const N = E[0].intersectionRatio;
      if (N !== l) {
        if (!S) return i();
        N
          ? i(!1, N)
          : (o = setTimeout(() => {
              i(!1, 1e-7);
            }, 1e3));
      }
      N === 1 && !Ao(d, e.getBoundingClientRect()) && i(), (S = !1);
    }
    try {
      n = new IntersectionObserver(C, { ...x, root: r.ownerDocument });
    } catch {
      n = new IntersectionObserver(C, x);
    }
    n.observe(e);
  }
  return i(!0), s;
}
function Ps(e, t, n, o) {
  o === void 0 && (o = {});
  const {
      ancestorScroll: r = !0,
      ancestorResize: s = !0,
      elementResize: i = typeof ResizeObserver == 'function',
      layoutShift: a = typeof IntersectionObserver == 'function',
      animationFrame: l = !1,
    } = o,
    d = tn(e),
    m = r || s ? [...(d ? Ye(d) : []), ...Ye(t)] : [];
  m.forEach((y) => {
    r && y.addEventListener('scroll', n, { passive: !0 }), s && y.addEventListener('resize', n);
  });
  const f = d && a ? Rs(d, n) : null;
  let h = -1,
    v = null;
  i &&
    ((v = new ResizeObserver((y) => {
      const [w] = y;
      w &&
        w.target === d &&
        v &&
        (v.unobserve(t),
        cancelAnimationFrame(h),
        (h = requestAnimationFrame(() => {
          var x;
          (x = v) == null || x.observe(t);
        }))),
        n();
    })),
    d && !l && v.observe(d),
    v.observe(t));
  let b,
    p = l ? be(e) : null;
  l && g();
  function g() {
    const y = be(e);
    p && !Ao(p, y) && n(), (p = y), (b = requestAnimationFrame(g));
  }
  return (
    n(),
    () => {
      var y;
      m.forEach((w) => {
        r && w.removeEventListener('scroll', n), s && w.removeEventListener('resize', n);
      }),
        f == null || f(),
        (y = v) == null || y.disconnect(),
        (v = null),
        l && cancelAnimationFrame(b);
    }
  );
}
const As = ss,
  Ts = as,
  Is = os,
  _s = ls,
  Os = rs,
  On = ns,
  Ms = cs,
  js = (e, t, n) => {
    const o = new Map(),
      r = { platform: Es, ...n },
      s = { ...r.platform, _c: o };
    return ts(e, t, { ...r, platform: s });
  };
var Ls = typeof document < 'u',
  Ds = () => {},
  rt = Ls ? c.useLayoutEffect : Ds;
function ft(e, t) {
  if (e === t) return !0;
  if (typeof e != typeof t) return !1;
  if (typeof e == 'function' && e.toString() === t.toString()) return !0;
  let n, o, r;
  if (e && t && typeof e == 'object') {
    if (Array.isArray(e)) {
      if (((n = e.length), n !== t.length)) return !1;
      for (o = n; o-- !== 0; ) if (!ft(e[o], t[o])) return !1;
      return !0;
    }
    if (((r = Object.keys(e)), (n = r.length), n !== Object.keys(t).length)) return !1;
    for (o = n; o-- !== 0; ) if (!{}.hasOwnProperty.call(t, r[o])) return !1;
    for (o = n; o-- !== 0; ) {
      const s = r[o];
      if (!(s === '_owner' && e.$$typeof) && !ft(e[s], t[s])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function To(e) {
  return typeof window > 'u' ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Mn(e, t) {
  const n = To(e);
  return Math.round(t * n) / n;
}
function At(e) {
  const t = c.useRef(e);
  return (
    rt(() => {
      t.current = e;
    }),
    t
  );
}
function ks(e) {
  e === void 0 && (e = {});
  const {
      placement: t = 'bottom',
      strategy: n = 'absolute',
      middleware: o = [],
      platform: r,
      elements: { reference: s, floating: i } = {},
      transform: a = !0,
      whileElementsMounted: l,
      open: d,
    } = e,
    [m, f] = c.useState({
      x: 0,
      y: 0,
      strategy: n,
      placement: t,
      middlewareData: {},
      isPositioned: !1,
    }),
    [h, v] = c.useState(o);
  ft(h, o) || v(o);
  const [b, p] = c.useState(null),
    [g, y] = c.useState(null),
    w = c.useCallback((P) => {
      P !== E.current && ((E.current = P), p(P));
    }, []),
    x = c.useCallback((P) => {
      P !== N.current && ((N.current = P), y(P));
    }, []),
    S = s || b,
    C = i || g,
    E = c.useRef(null),
    N = c.useRef(null),
    R = c.useRef(m),
    F = l != null,
    _ = At(l),
    T = At(r),
    j = At(d),
    M = c.useCallback(() => {
      if (!E.current || !N.current) return;
      const P = { placement: t, strategy: n, middleware: h };
      T.current && (P.platform = T.current),
        js(E.current, N.current, P).then((B) => {
          const X = { ...B, isPositioned: j.current !== !1 };
          k.current &&
            !ft(R.current, X) &&
            ((R.current = X),
            mt.flushSync(() => {
              f(X);
            }));
        });
    }, [h, t, n, T, j]);
  rt(() => {
    d === !1 &&
      R.current.isPositioned &&
      ((R.current.isPositioned = !1), f((P) => ({ ...P, isPositioned: !1 })));
  }, [d]);
  const k = c.useRef(!1);
  rt(
    () => (
      (k.current = !0),
      () => {
        k.current = !1;
      }
    ),
    []
  ),
    rt(() => {
      if ((S && (E.current = S), C && (N.current = C), S && C)) {
        if (_.current) return _.current(S, C, M);
        M();
      }
    }, [S, C, M, _, F]);
  const H = c.useMemo(
      () => ({ reference: E, floating: N, setReference: w, setFloating: x }),
      [w, x]
    ),
    I = c.useMemo(() => ({ reference: S, floating: C }), [S, C]),
    L = c.useMemo(() => {
      const P = { position: n, left: 0, top: 0 };
      if (!I.floating) return P;
      const B = Mn(I.floating, m.x),
        X = Mn(I.floating, m.y);
      return a
        ? {
            ...P,
            transform: 'translate(' + B + 'px, ' + X + 'px)',
            ...(To(I.floating) >= 1.5 && { willChange: 'transform' }),
          }
        : { position: n, left: B, top: X };
    }, [n, a, I.floating, m.x, m.y]);
  return c.useMemo(
    () => ({ ...m, update: M, refs: H, elements: I, floatingStyles: L }),
    [m, M, H, I, L]
  );
}
const Fs = (e) => {
    function t(n) {
      return {}.hasOwnProperty.call(n, 'current');
    }
    return {
      name: 'arrow',
      options: e,
      fn(n) {
        const { element: o, padding: r } = typeof e == 'function' ? e(n) : e;
        return o && t(o)
          ? o.current != null
            ? On({ element: o.current, padding: r }).fn(n)
            : {}
          : o
            ? On({ element: o, padding: r }).fn(n)
            : {};
      },
    };
  },
  Bs = (e, t) => ({ ...As(e), options: [e, t] }),
  $s = (e, t) => ({ ...Ts(e), options: [e, t] }),
  Ws = (e, t) => ({ ...Ms(e), options: [e, t] }),
  Hs = (e, t) => ({ ...Is(e), options: [e, t] }),
  Vs = (e, t) => ({ ..._s(e), options: [e, t] }),
  Us = (e, t) => ({ ...Os(e), options: [e, t] }),
  Ks = (e, t) => ({ ...Fs(e), options: [e, t] });
var zs = 'Arrow',
  Io = c.forwardRef((e, t) => {
    const { children: n, width: o = 10, height: r = 5, ...s } = e;
    return u.jsx(D.svg, {
      ...s,
      ref: t,
      width: o,
      height: r,
      viewBox: '0 0 30 10',
      preserveAspectRatio: 'none',
      children: e.asChild ? n : u.jsx('polygon', { points: '0,0 30,0 15,10' }),
    });
  });
Io.displayName = zs;
var Gs = Io;
function _o(e) {
  const [t, n] = c.useState(void 0);
  return (
    Y(() => {
      if (e) {
        n({ width: e.offsetWidth, height: e.offsetHeight });
        const o = new ResizeObserver((r) => {
          if (!Array.isArray(r) || !r.length) return;
          const s = r[0];
          let i, a;
          if ('borderBoxSize' in s) {
            const l = s.borderBoxSize,
              d = Array.isArray(l) ? l[0] : l;
            (i = d.inlineSize), (a = d.blockSize);
          } else (i = e.offsetWidth), (a = e.offsetHeight);
          n({ width: i, height: a });
        });
        return o.observe(e, { box: 'border-box' }), () => o.unobserve(e);
      } else n(void 0);
    }, [e]),
    t
  );
}
var Oo = 'Popper',
  [Mo, jo] = Ie(Oo),
  [pl, Lo] = Mo(Oo),
  Do = 'PopperAnchor',
  ko = c.forwardRef((e, t) => {
    const { __scopePopper: n, virtualRef: o, ...r } = e,
      s = Lo(Do, n),
      i = c.useRef(null),
      a = z(t, i);
    return (
      c.useEffect(() => {
        s.onAnchorChange((o == null ? void 0 : o.current) || i.current);
      }),
      o ? null : u.jsx(D.div, { ...r, ref: a })
    );
  });
ko.displayName = Do;
var on = 'PopperContent',
  [Ys, Xs] = Mo(on),
  Fo = c.forwardRef((e, t) => {
    var A, K, G, V, $, W;
    const {
        __scopePopper: n,
        side: o = 'bottom',
        sideOffset: r = 0,
        align: s = 'center',
        alignOffset: i = 0,
        arrowPadding: a = 0,
        avoidCollisions: l = !0,
        collisionBoundary: d = [],
        collisionPadding: m = 0,
        sticky: f = 'partial',
        hideWhenDetached: h = !1,
        updatePositionStrategy: v = 'optimized',
        onPlaced: b,
        ...p
      } = e,
      g = Lo(on, n),
      [y, w] = c.useState(null),
      x = z(t, (q) => w(q)),
      [S, C] = c.useState(null),
      E = _o(S),
      N = (E == null ? void 0 : E.width) ?? 0,
      R = (E == null ? void 0 : E.height) ?? 0,
      F = o + (s !== 'center' ? '-' + s : ''),
      _ = typeof m == 'number' ? m : { top: 0, right: 0, bottom: 0, left: 0, ...m },
      T = Array.isArray(d) ? d : [d],
      j = T.length > 0,
      M = { padding: _, boundary: T.filter(Zs), altBoundary: j },
      {
        refs: k,
        floatingStyles: H,
        placement: I,
        isPositioned: L,
        middlewareData: P,
      } = ks({
        strategy: 'fixed',
        placement: F,
        whileElementsMounted: (...q) => Ps(...q, { animationFrame: v === 'always' }),
        elements: { reference: g.anchor },
        middleware: [
          Bs({ mainAxis: r + R, alignmentAxis: i }),
          l && $s({ mainAxis: !0, crossAxis: !1, limiter: f === 'partial' ? Ws() : void 0, ...M }),
          l && Hs({ ...M }),
          Vs({
            ...M,
            apply: ({ elements: q, rects: oe, availableWidth: ke, availableHeight: Fe }) => {
              const { width: Be, height: Si } = oe.reference,
                Ze = q.floating.style;
              Ze.setProperty('--radix-popper-available-width', `${ke}px`),
                Ze.setProperty('--radix-popper-available-height', `${Fe}px`),
                Ze.setProperty('--radix-popper-anchor-width', `${Be}px`),
                Ze.setProperty('--radix-popper-anchor-height', `${Si}px`);
            },
          }),
          S && Ks({ element: S, padding: a }),
          Qs({ arrowWidth: N, arrowHeight: R }),
          h && Us({ strategy: 'referenceHidden', ...M }),
        ],
      }),
      [B, X] = Wo(I),
      le = me(b);
    Y(() => {
      L && (le == null || le());
    }, [L, le]);
    const Le = (A = P.arrow) == null ? void 0 : A.x,
      De = (K = P.arrow) == null ? void 0 : K.y,
      fe = ((G = P.arrow) == null ? void 0 : G.centerOffset) !== 0,
      [Ce, xe] = c.useState();
    return (
      Y(() => {
        y && xe(window.getComputedStyle(y).zIndex);
      }, [y]),
      u.jsx('div', {
        ref: k.setFloating,
        'data-radix-popper-content-wrapper': '',
        style: {
          ...H,
          transform: L ? H.transform : 'translate(0, -200%)',
          minWidth: 'max-content',
          zIndex: Ce,
          '--radix-popper-transform-origin': [
            (V = P.transformOrigin) == null ? void 0 : V.x,
            ($ = P.transformOrigin) == null ? void 0 : $.y,
          ].join(' '),
          ...(((W = P.hide) == null ? void 0 : W.referenceHidden) && {
            visibility: 'hidden',
            pointerEvents: 'none',
          }),
        },
        dir: e.dir,
        children: u.jsx(Ys, {
          scope: n,
          placedSide: B,
          onArrowChange: C,
          arrowX: Le,
          arrowY: De,
          shouldHideArrow: fe,
          children: u.jsx(D.div, {
            'data-side': B,
            'data-align': X,
            ...p,
            ref: x,
            style: { ...p.style, animation: L ? void 0 : 'none' },
          }),
        }),
      })
    );
  });
Fo.displayName = on;
var Bo = 'PopperArrow',
  qs = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' },
  $o = c.forwardRef((t, n) => {
    const { __scopePopper: o, ...r } = t,
      s = Xs(Bo, o),
      i = qs[s.placedSide];
    return u.jsx('span', {
      ref: s.onArrowChange,
      style: {
        position: 'absolute',
        left: s.arrowX,
        top: s.arrowY,
        [i]: 0,
        transformOrigin: { top: '', right: '0 0', bottom: 'center 0', left: '100% 0' }[
          s.placedSide
        ],
        transform: {
          top: 'translateY(100%)',
          right: 'translateY(50%) rotate(90deg) translateX(-50%)',
          bottom: 'rotate(180deg)',
          left: 'translateY(50%) rotate(-90deg) translateX(50%)',
        }[s.placedSide],
        visibility: s.shouldHideArrow ? 'hidden' : void 0,
      },
      children: u.jsx(Gs, { ...r, ref: n, style: { ...r.style, display: 'block' } }),
    });
  });
$o.displayName = Bo;
function Zs(e) {
  return e !== null;
}
var Qs = (e) => ({
  name: 'transformOrigin',
  options: e,
  fn(t) {
    var g, y, w;
    const { placement: n, rects: o, middlewareData: r } = t,
      i = ((g = r.arrow) == null ? void 0 : g.centerOffset) !== 0,
      a = i ? 0 : e.arrowWidth,
      l = i ? 0 : e.arrowHeight,
      [d, m] = Wo(n),
      f = { start: '0%', center: '50%', end: '100%' }[m],
      h = (((y = r.arrow) == null ? void 0 : y.x) ?? 0) + a / 2,
      v = (((w = r.arrow) == null ? void 0 : w.y) ?? 0) + l / 2;
    let b = '',
      p = '';
    return (
      d === 'bottom'
        ? ((b = i ? f : `${h}px`), (p = `${-l}px`))
        : d === 'top'
          ? ((b = i ? f : `${h}px`), (p = `${o.floating.height + l}px`))
          : d === 'right'
            ? ((b = `${-l}px`), (p = i ? f : `${v}px`))
            : d === 'left' && ((b = `${o.floating.width + l}px`), (p = i ? f : `${v}px`)),
      { data: { x: b, y: p } }
    );
  },
});
function Wo(e) {
  const [t, n = 'center'] = e.split('-');
  return [t, n];
}
var Js = ko,
  ea = Fo,
  ta = $o,
  na = 'Portal',
  Ho = c.forwardRef((e, t) => {
    var a;
    const { container: n, ...o } = e,
      [r, s] = c.useState(!1);
    Y(() => s(!0), []);
    const i =
      n ||
      (r && ((a = globalThis == null ? void 0 : globalThis.document) == null ? void 0 : a.body));
    return i ? Ci.createPortal(u.jsx(D.div, { ...o, ref: t }), i) : null;
  });
Ho.displayName = na;
var oa = oo[' useInsertionEffect '.trim().toString()] || Y;
function rn({ prop: e, defaultProp: t, onChange: n = () => {}, caller: o }) {
  const [r, s, i] = ra({ defaultProp: t, onChange: n }),
    a = e !== void 0,
    l = a ? e : r;
  {
    const m = c.useRef(e !== void 0);
    c.useEffect(() => {
      const f = m.current;
      f !== a &&
        console.warn(
          `${o} is changing from ${f ? 'controlled' : 'uncontrolled'} to ${a ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        ),
        (m.current = a);
    }, [a, o]);
  }
  const d = c.useCallback(
    (m) => {
      var f;
      if (a) {
        const h = ia(m) ? m(e) : m;
        h !== e && ((f = i.current) == null || f.call(i, h));
      } else s(m);
    },
    [a, e, s, i]
  );
  return [l, d];
}
function ra({ defaultProp: e, onChange: t }) {
  const [n, o] = c.useState(e),
    r = c.useRef(n),
    s = c.useRef(t);
  return (
    oa(() => {
      s.current = t;
    }, [t]),
    c.useEffect(() => {
      var i;
      r.current !== n && ((i = s.current) == null || i.call(s, n), (r.current = n));
    }, [n, r]),
    [n, o, s]
  );
}
function ia(e) {
  return typeof e == 'function';
}
function Vo(e) {
  const t = c.useRef({ value: e, previous: e });
  return c.useMemo(
    () => (
      t.current.value !== e && ((t.current.previous = t.current.value), (t.current.value = e)),
      t.current.previous
    ),
    [e]
  );
}
var Uo = Object.freeze({
    position: 'absolute',
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    wordWrap: 'normal',
  }),
  sa = 'VisuallyHidden',
  aa = c.forwardRef((e, t) => u.jsx(D.span, { ...e, ref: t, style: { ...Uo, ...e.style } }));
aa.displayName = sa;
var ca = (e) => {
    if (typeof document > 'u') return null;
    var t = Array.isArray(e) ? e[0] : e;
    return t.ownerDocument.body;
  },
  Ne = new WeakMap(),
  Je = new WeakMap(),
  et = {},
  Tt = 0,
  Ko = (e) => e && (e.host || Ko(e.parentNode)),
  la = (e, t) =>
    t
      .map((n) => {
        if (e.contains(n)) return n;
        var o = Ko(n);
        return o && e.contains(o)
          ? o
          : (console.error('aria-hidden', n, 'in not contained inside', e, '. Doing nothing'),
            null);
      })
      .filter((n) => !!n),
  da = (e, t, n, o) => {
    var r = la(t, Array.isArray(e) ? e : [e]);
    et[n] || (et[n] = new WeakMap());
    var s = et[n],
      i = [],
      a = new Set(),
      l = new Set(r),
      d = (f) => {
        !f || a.has(f) || (a.add(f), d(f.parentNode));
      };
    r.forEach(d);
    var m = (f) => {
      !f ||
        l.has(f) ||
        Array.prototype.forEach.call(f.children, (h) => {
          if (a.has(h)) m(h);
          else
            try {
              var v = h.getAttribute(o),
                b = v !== null && v !== 'false',
                p = (Ne.get(h) || 0) + 1,
                g = (s.get(h) || 0) + 1;
              Ne.set(h, p),
                s.set(h, g),
                i.push(h),
                p === 1 && b && Je.set(h, !0),
                g === 1 && h.setAttribute(n, 'true'),
                b || h.setAttribute(o, 'true');
            } catch (y) {
              console.error('aria-hidden: cannot operate on ', h, y);
            }
        });
    };
    return (
      m(t),
      a.clear(),
      Tt++,
      () => {
        i.forEach((f) => {
          var h = Ne.get(f) - 1,
            v = s.get(f) - 1;
          Ne.set(f, h),
            s.set(f, v),
            h || (Je.has(f) || f.removeAttribute(o), Je.delete(f)),
            v || f.removeAttribute(n);
        }),
          Tt--,
          Tt || ((Ne = new WeakMap()), (Ne = new WeakMap()), (Je = new WeakMap()), (et = {}));
      }
    );
  },
  ua = (e, t, n) => {
    n === void 0 && (n = 'data-aria-hidden');
    var o = Array.from(Array.isArray(e) ? e : [e]),
      r = ca(e);
    return r
      ? (o.push.apply(o, Array.from(r.querySelectorAll('[aria-live], script'))),
        da(o, r, n, 'aria-hidden'))
      : () => null;
  },
  re = function () {
    return (
      (re =
        Object.assign ||
        ((t) => {
          for (var n, o = 1, r = arguments.length; o < r; o++) {
            n = arguments[o];
            for (var s in n) Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
          }
          return t;
        })),
      re.apply(this, arguments)
    );
  };
function zo(e, t) {
  var n = {};
  for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var r = 0, o = Object.getOwnPropertySymbols(e); r < o.length; r++)
      t.indexOf(o[r]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, o[r]) &&
        (n[o[r]] = e[o[r]]);
  return n;
}
function fa(e, t, n) {
  if (n || arguments.length === 2)
    for (var o = 0, r = t.length, s; o < r; o++)
      (s || !(o in t)) && (s || (s = Array.prototype.slice.call(t, 0, o)), (s[o] = t[o]));
  return e.concat(s || Array.prototype.slice.call(t));
}
var it = 'right-scroll-bar-position',
  st = 'width-before-scroll-bar',
  pa = 'with-scroll-bars-hidden',
  ma = '--removed-body-scroll-bar-size';
function It(e, t) {
  return typeof e == 'function' ? e(t) : e && (e.current = t), e;
}
function ha(e, t) {
  var n = c.useState(() => ({
    value: e,
    callback: t,
    facade: {
      get current() {
        return n.value;
      },
      set current(o) {
        var r = n.value;
        r !== o && ((n.value = o), n.callback(o, r));
      },
    },
  }))[0];
  return (n.callback = t), n.facade;
}
var ga = typeof window < 'u' ? c.useLayoutEffect : c.useEffect,
  jn = new WeakMap();
function va(e, t) {
  var n = ha(null, (o) => e.forEach((r) => It(r, o)));
  return (
    ga(() => {
      var o = jn.get(n);
      if (o) {
        var r = new Set(o),
          s = new Set(e),
          i = n.current;
        r.forEach((a) => {
          s.has(a) || It(a, null);
        }),
          s.forEach((a) => {
            r.has(a) || It(a, i);
          });
      }
      jn.set(n, e);
    }, [e]),
    n
  );
}
function ya(e) {
  return e;
}
function xa(e, t) {
  t === void 0 && (t = ya);
  var n = [],
    o = !1,
    r = {
      read: () => {
        if (o)
          throw new Error(
            'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.'
          );
        return n.length ? n[n.length - 1] : e;
      },
      useMedium: (s) => {
        var i = t(s, o);
        return (
          n.push(i),
          () => {
            n = n.filter((a) => a !== i);
          }
        );
      },
      assignSyncMedium: (s) => {
        for (o = !0; n.length; ) {
          var i = n;
          (n = []), i.forEach(s);
        }
        n = { push: (a) => s(a), filter: () => n };
      },
      assignMedium: (s) => {
        o = !0;
        var i = [];
        if (n.length) {
          var a = n;
          (n = []), a.forEach(s), (i = n);
        }
        var l = () => {
            var m = i;
            (i = []), m.forEach(s);
          },
          d = () => Promise.resolve().then(l);
        d(),
          (n = {
            push: (m) => {
              i.push(m), d();
            },
            filter: (m) => ((i = i.filter(m)), n),
          });
      },
    };
  return r;
}
function wa(e) {
  e === void 0 && (e = {});
  var t = xa(null);
  return (t.options = re({ async: !0, ssr: !1 }, e)), t;
}
var Go = (e) => {
  var t = e.sideCar,
    n = zo(e, ['sideCar']);
  if (!t) throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  var o = t.read();
  if (!o) throw new Error('Sidecar medium not found');
  return c.createElement(o, re({}, n));
};
Go.isSideCarExport = !0;
function ba(e, t) {
  return e.useMedium(t), Go;
}
var Yo = wa(),
  _t = () => {},
  xt = c.forwardRef((e, t) => {
    var n = c.useRef(null),
      o = c.useState({ onScrollCapture: _t, onWheelCapture: _t, onTouchMoveCapture: _t }),
      r = o[0],
      s = o[1],
      i = e.forwardProps,
      a = e.children,
      l = e.className,
      d = e.removeScrollBar,
      m = e.enabled,
      f = e.shards,
      h = e.sideCar,
      v = e.noRelative,
      b = e.noIsolation,
      p = e.inert,
      g = e.allowPinchZoom,
      y = e.as,
      w = y === void 0 ? 'div' : y,
      x = e.gapMode,
      S = zo(e, [
        'forwardProps',
        'children',
        'className',
        'removeScrollBar',
        'enabled',
        'shards',
        'sideCar',
        'noRelative',
        'noIsolation',
        'inert',
        'allowPinchZoom',
        'as',
        'gapMode',
      ]),
      C = h,
      E = va([n, t]),
      N = re(re({}, S), r);
    return c.createElement(
      c.Fragment,
      null,
      m &&
        c.createElement(C, {
          sideCar: Yo,
          removeScrollBar: d,
          shards: f,
          noRelative: v,
          noIsolation: b,
          inert: p,
          setCallbacks: s,
          allowPinchZoom: !!g,
          lockRef: n,
          gapMode: x,
        }),
      i
        ? c.cloneElement(c.Children.only(a), re(re({}, N), { ref: E }))
        : c.createElement(w, re({}, N, { className: l, ref: E }), a)
    );
  });
xt.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
xt.classNames = { fullWidth: st, zeroRight: it };
var Sa = () => {
  if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__;
};
function Ca() {
  if (!document) return null;
  var e = document.createElement('style');
  e.type = 'text/css';
  var t = Sa();
  return t && e.setAttribute('nonce', t), e;
}
function Na(e, t) {
  e.styleSheet ? (e.styleSheet.cssText = t) : e.appendChild(document.createTextNode(t));
}
function Ea(e) {
  var t = document.head || document.getElementsByTagName('head')[0];
  t.appendChild(e);
}
var Ra = () => {
    var e = 0,
      t = null;
    return {
      add: (n) => {
        e == 0 && (t = Ca()) && (Na(t, n), Ea(t)), e++;
      },
      remove: () => {
        e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null));
      },
    };
  },
  Pa = () => {
    var e = Ra();
    return (t, n) => {
      c.useEffect(
        () => (
          e.add(t),
          () => {
            e.remove();
          }
        ),
        [t && n]
      );
    };
  },
  Xo = () => {
    var e = Pa(),
      t = (n) => {
        var o = n.styles,
          r = n.dynamic;
        return e(o, r), null;
      };
    return t;
  },
  Aa = { left: 0, top: 0, right: 0, gap: 0 },
  Ot = (e) => Number.parseInt(e || '', 10) || 0,
  Ta = (e) => {
    var t = window.getComputedStyle(document.body),
      n = t[e === 'padding' ? 'paddingLeft' : 'marginLeft'],
      o = t[e === 'padding' ? 'paddingTop' : 'marginTop'],
      r = t[e === 'padding' ? 'paddingRight' : 'marginRight'];
    return [Ot(n), Ot(o), Ot(r)];
  },
  Ia = (e) => {
    if ((e === void 0 && (e = 'margin'), typeof window > 'u')) return Aa;
    var t = Ta(e),
      n = document.documentElement.clientWidth,
      o = window.innerWidth;
    return { left: t[0], top: t[1], right: t[2], gap: Math.max(0, o - n + t[2] - t[0]) };
  },
  _a = Xo(),
  Ae = 'data-scroll-locked',
  Oa = (e, t, n, o) => {
    var r = e.left,
      s = e.top,
      i = e.right,
      a = e.gap;
    return (
      n === void 0 && (n = 'margin'),
      `
  .`
        .concat(
          pa,
          ` {
   overflow: hidden `
        )
        .concat(
          o,
          `;
   padding-right: `
        )
        .concat(a, 'px ')
        .concat(
          o,
          `;
  }
  body[`
        )
        .concat(
          Ae,
          `] {
    overflow: hidden `
        )
        .concat(
          o,
          `;
    overscroll-behavior: contain;
    `
        )
        .concat(
          [
            t && 'position: relative '.concat(o, ';'),
            n === 'margin' &&
              `
    padding-left: `
                .concat(
                  r,
                  `px;
    padding-top: `
                )
                .concat(
                  s,
                  `px;
    padding-right: `
                )
                .concat(
                  i,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `
                )
                .concat(a, 'px ')
                .concat(
                  o,
                  `;
    `
                ),
            n === 'padding' && 'padding-right: '.concat(a, 'px ').concat(o, ';'),
          ]
            .filter(Boolean)
            .join(''),
          `
  }
  
  .`
        )
        .concat(
          it,
          ` {
    right: `
        )
        .concat(a, 'px ')
        .concat(
          o,
          `;
  }
  
  .`
        )
        .concat(
          st,
          ` {
    margin-right: `
        )
        .concat(a, 'px ')
        .concat(
          o,
          `;
  }
  
  .`
        )
        .concat(it, ' .')
        .concat(
          it,
          ` {
    right: 0 `
        )
        .concat(
          o,
          `;
  }
  
  .`
        )
        .concat(st, ' .')
        .concat(
          st,
          ` {
    margin-right: 0 `
        )
        .concat(
          o,
          `;
  }
  
  body[`
        )
        .concat(
          Ae,
          `] {
    `
        )
        .concat(ma, ': ')
        .concat(
          a,
          `px;
  }
`
        )
    );
  },
  Ln = () => {
    var e = Number.parseInt(document.body.getAttribute(Ae) || '0', 10);
    return isFinite(e) ? e : 0;
  },
  Ma = () => {
    c.useEffect(
      () => (
        document.body.setAttribute(Ae, (Ln() + 1).toString()),
        () => {
          var e = Ln() - 1;
          e <= 0 ? document.body.removeAttribute(Ae) : document.body.setAttribute(Ae, e.toString());
        }
      ),
      []
    );
  },
  ja = (e) => {
    var t = e.noRelative,
      n = e.noImportant,
      o = e.gapMode,
      r = o === void 0 ? 'margin' : o;
    Ma();
    var s = c.useMemo(() => Ia(r), [r]);
    return c.createElement(_a, { styles: Oa(s, !t, r, n ? '' : '!important') });
  },
  Ft = !1;
if (typeof window < 'u')
  try {
    var tt = Object.defineProperty({}, 'passive', { get: () => ((Ft = !0), !0) });
    window.addEventListener('test', tt, tt), window.removeEventListener('test', tt, tt);
  } catch {
    Ft = !1;
  }
var Ee = Ft ? { passive: !1 } : !1,
  La = (e) => e.tagName === 'TEXTAREA',
  qo = (e, t) => {
    if (!(e instanceof Element)) return !1;
    var n = window.getComputedStyle(e);
    return n[t] !== 'hidden' && !(n.overflowY === n.overflowX && !La(e) && n[t] === 'visible');
  },
  Da = (e) => qo(e, 'overflowY'),
  ka = (e) => qo(e, 'overflowX'),
  Dn = (e, t) => {
    var n = t.ownerDocument,
      o = t;
    do {
      typeof ShadowRoot < 'u' && o instanceof ShadowRoot && (o = o.host);
      var r = Zo(e, o);
      if (r) {
        var s = Qo(e, o),
          i = s[1],
          a = s[2];
        if (i > a) return !0;
      }
      o = o.parentNode;
    } while (o && o !== n.body);
    return !1;
  },
  Fa = (e) => {
    var t = e.scrollTop,
      n = e.scrollHeight,
      o = e.clientHeight;
    return [t, n, o];
  },
  Ba = (e) => {
    var t = e.scrollLeft,
      n = e.scrollWidth,
      o = e.clientWidth;
    return [t, n, o];
  },
  Zo = (e, t) => (e === 'v' ? Da(t) : ka(t)),
  Qo = (e, t) => (e === 'v' ? Fa(t) : Ba(t)),
  $a = (e, t) => (e === 'h' && t === 'rtl' ? -1 : 1),
  Wa = (e, t, n, o, r) => {
    var s = $a(e, window.getComputedStyle(t).direction),
      i = s * o,
      a = n.target,
      l = t.contains(a),
      d = !1,
      m = i > 0,
      f = 0,
      h = 0;
    do {
      if (!a) break;
      var v = Qo(e, a),
        b = v[0],
        p = v[1],
        g = v[2],
        y = p - g - s * b;
      (b || y) && Zo(e, a) && ((f += y), (h += b));
      var w = a.parentNode;
      a = w && w.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? w.host : w;
    } while ((!l && a !== document.body) || (l && (t.contains(a) || t === a)));
    return ((m && Math.abs(f) < 1) || (!m && Math.abs(h) < 1)) && (d = !0), d;
  },
  nt = (e) =>
    'changedTouches' in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0],
  kn = (e) => [e.deltaX, e.deltaY],
  Fn = (e) => (e && 'current' in e ? e.current : e),
  Ha = (e, t) => e[0] === t[0] && e[1] === t[1],
  Va = (e) =>
    `
  .block-interactivity-`
      .concat(
        e,
        ` {pointer-events: none;}
  .allow-interactivity-`
      )
      .concat(
        e,
        ` {pointer-events: all;}
`
      ),
  Ua = 0,
  Re = [];
function Ka(e) {
  var t = c.useRef([]),
    n = c.useRef([0, 0]),
    o = c.useRef(),
    r = c.useState(Ua++)[0],
    s = c.useState(Xo)[0],
    i = c.useRef(e);
  c.useEffect(() => {
    i.current = e;
  }, [e]),
    c.useEffect(() => {
      if (e.inert) {
        document.body.classList.add('block-interactivity-'.concat(r));
        var p = fa([e.lockRef.current], (e.shards || []).map(Fn), !0).filter(Boolean);
        return (
          p.forEach((g) => g.classList.add('allow-interactivity-'.concat(r))),
          () => {
            document.body.classList.remove('block-interactivity-'.concat(r)),
              p.forEach((g) => g.classList.remove('allow-interactivity-'.concat(r)));
          }
        );
      }
    }, [e.inert, e.lockRef.current, e.shards]);
  var a = c.useCallback((p, g) => {
      if (('touches' in p && p.touches.length === 2) || (p.type === 'wheel' && p.ctrlKey))
        return !i.current.allowPinchZoom;
      var y = nt(p),
        w = n.current,
        x = 'deltaX' in p ? p.deltaX : w[0] - y[0],
        S = 'deltaY' in p ? p.deltaY : w[1] - y[1],
        C,
        E = p.target,
        N = Math.abs(x) > Math.abs(S) ? 'h' : 'v';
      if ('touches' in p && N === 'h' && E.type === 'range') return !1;
      var R = Dn(N, E);
      if (!R) return !0;
      if ((R ? (C = N) : ((C = N === 'v' ? 'h' : 'v'), (R = Dn(N, E))), !R)) return !1;
      if ((!o.current && 'changedTouches' in p && (x || S) && (o.current = C), !C)) return !0;
      var F = o.current || C;
      return Wa(F, g, p, F === 'h' ? x : S);
    }, []),
    l = c.useCallback((p) => {
      var g = p;
      if (!(!Re.length || Re[Re.length - 1] !== s)) {
        var y = 'deltaY' in g ? kn(g) : nt(g),
          w = t.current.filter(
            (C) =>
              C.name === g.type &&
              (C.target === g.target || g.target === C.shadowParent) &&
              Ha(C.delta, y)
          )[0];
        if (w && w.should) {
          g.cancelable && g.preventDefault();
          return;
        }
        if (!w) {
          var x = (i.current.shards || [])
              .map(Fn)
              .filter(Boolean)
              .filter((C) => C.contains(g.target)),
            S = x.length > 0 ? a(g, x[0]) : !i.current.noIsolation;
          S && g.cancelable && g.preventDefault();
        }
      }
    }, []),
    d = c.useCallback((p, g, y, w) => {
      var x = { name: p, delta: g, target: y, should: w, shadowParent: za(y) };
      t.current.push(x),
        setTimeout(() => {
          t.current = t.current.filter((S) => S !== x);
        }, 1);
    }, []),
    m = c.useCallback((p) => {
      (n.current = nt(p)), (o.current = void 0);
    }, []),
    f = c.useCallback((p) => {
      d(p.type, kn(p), p.target, a(p, e.lockRef.current));
    }, []),
    h = c.useCallback((p) => {
      d(p.type, nt(p), p.target, a(p, e.lockRef.current));
    }, []);
  c.useEffect(
    () => (
      Re.push(s),
      e.setCallbacks({ onScrollCapture: f, onWheelCapture: f, onTouchMoveCapture: h }),
      document.addEventListener('wheel', l, Ee),
      document.addEventListener('touchmove', l, Ee),
      document.addEventListener('touchstart', m, Ee),
      () => {
        (Re = Re.filter((p) => p !== s)),
          document.removeEventListener('wheel', l, Ee),
          document.removeEventListener('touchmove', l, Ee),
          document.removeEventListener('touchstart', m, Ee);
      }
    ),
    []
  );
  var v = e.removeScrollBar,
    b = e.inert;
  return c.createElement(
    c.Fragment,
    null,
    b ? c.createElement(s, { styles: Va(r) }) : null,
    v ? c.createElement(ja, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function za(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && ((t = e.host), (e = e.host)), (e = e.parentNode);
  return t;
}
const Ga = ba(Yo, Ka);
var Jo = c.forwardRef((e, t) => c.createElement(xt, re({}, e, { ref: t, sideCar: Ga })));
Jo.classNames = xt.classNames;
var Ya = [' ', 'Enter', 'ArrowUp', 'ArrowDown'],
  Xa = [' ', 'Enter'],
  wt = 'Select',
  [sn, bt, qa] = Yt(wt),
  [Me, ml] = Ie(wt, [qa, jo]),
  an = jo(),
  [hl, ve] = Me(wt),
  [gl, Za] = Me(wt),
  er = 'SelectTrigger',
  tr = c.forwardRef((e, t) => {
    const { __scopeSelect: n, disabled: o = !1, ...r } = e,
      s = an(n),
      i = ve(er, n),
      a = i.disabled || o,
      l = z(t, i.onTriggerChange),
      d = bt(n),
      m = c.useRef('touch'),
      [f, h, v] = Cr((p) => {
        const g = d().filter((x) => !x.disabled),
          y = g.find((x) => x.value === i.value),
          w = Nr(g, p, y);
        w !== void 0 && i.onValueChange(w.value);
      }),
      b = (p) => {
        a || (i.onOpenChange(!0), v()),
          p &&
            (i.triggerPointerDownPosRef.current = {
              x: Math.round(p.pageX),
              y: Math.round(p.pageY),
            });
      };
    return u.jsx(Js, {
      asChild: !0,
      ...s,
      children: u.jsx(D.button, {
        type: 'button',
        role: 'combobox',
        'aria-controls': i.contentId,
        'aria-expanded': i.open,
        'aria-required': i.required,
        'aria-autocomplete': 'none',
        dir: i.dir,
        'data-state': i.open ? 'open' : 'closed',
        disabled: a,
        'data-disabled': a ? '' : void 0,
        'data-placeholder': Sr(i.value) ? '' : void 0,
        ...r,
        ref: l,
        onClick: O(r.onClick, (p) => {
          p.currentTarget.focus(), m.current !== 'mouse' && b(p);
        }),
        onPointerDown: O(r.onPointerDown, (p) => {
          m.current = p.pointerType;
          const g = p.target;
          g.hasPointerCapture(p.pointerId) && g.releasePointerCapture(p.pointerId),
            p.button === 0 &&
              p.ctrlKey === !1 &&
              p.pointerType === 'mouse' &&
              (b(p), p.preventDefault());
        }),
        onKeyDown: O(r.onKeyDown, (p) => {
          const g = f.current !== '';
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && h(p.key),
            !(g && p.key === ' ') && Ya.includes(p.key) && (b(), p.preventDefault());
        }),
      }),
    });
  });
tr.displayName = er;
var nr = 'SelectValue',
  Qa = c.forwardRef((e, t) => {
    const { __scopeSelect: n, className: o, style: r, children: s, placeholder: i = '', ...a } = e,
      l = ve(nr, n),
      { onValueNodeHasChildrenChange: d } = l,
      m = s !== void 0,
      f = z(t, l.onValueNodeChange);
    return (
      Y(() => {
        d(m);
      }, [d, m]),
      u.jsx(D.span, {
        ...a,
        ref: f,
        style: { pointerEvents: 'none' },
        children: Sr(l.value) ? u.jsx(u.Fragment, { children: i }) : s,
      })
    );
  });
Qa.displayName = nr;
var Ja = 'SelectIcon',
  or = c.forwardRef((e, t) => {
    const { __scopeSelect: n, children: o, ...r } = e;
    return u.jsx(D.span, { 'aria-hidden': !0, ...r, ref: t, children: o || '▼' });
  });
or.displayName = Ja;
var ec = 'SelectPortal',
  rr = (e) => u.jsx(Ho, { asChild: !0, ...e });
rr.displayName = ec;
var Se = 'SelectContent',
  ir = c.forwardRef((e, t) => {
    const n = ve(Se, e.__scopeSelect),
      [o, r] = c.useState();
    if (
      (Y(() => {
        r(new DocumentFragment());
      }, []),
      !n.open)
    ) {
      const s = o;
      return s
        ? mt.createPortal(
            u.jsx(sr, {
              scope: e.__scopeSelect,
              children: u.jsx(sn.Slot, {
                scope: e.__scopeSelect,
                children: u.jsx('div', { children: e.children }),
              }),
            }),
            s
          )
        : null;
    }
    return u.jsx(ar, { ...e, ref: t });
  });
ir.displayName = Se;
var J = 10,
  [sr, ye] = Me(Se),
  tc = 'SelectContentImpl',
  nc = at('SelectContent.RemoveScroll'),
  ar = c.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        position: o = 'item-aligned',
        onCloseAutoFocus: r,
        onEscapeKeyDown: s,
        onPointerDownOutside: i,
        side: a,
        sideOffset: l,
        align: d,
        alignOffset: m,
        arrowPadding: f,
        collisionBoundary: h,
        collisionPadding: v,
        sticky: b,
        hideWhenDetached: p,
        avoidCollisions: g,
        ...y
      } = e,
      w = ve(Se, n),
      [x, S] = c.useState(null),
      [C, E] = c.useState(null),
      N = z(t, (A) => S(A)),
      [R, F] = c.useState(null),
      [_, T] = c.useState(null),
      j = bt(n),
      [M, k] = c.useState(!1),
      H = c.useRef(!1);
    c.useEffect(() => {
      if (x) return ua(x);
    }, [x]),
      ki();
    const I = c.useCallback(
        (A) => {
          const [K, ...G] = j().map((W) => W.ref.current),
            [V] = G.slice(-1),
            $ = document.activeElement;
          for (const W of A)
            if (
              W === $ ||
              (W == null || W.scrollIntoView({ block: 'nearest' }),
              W === K && C && (C.scrollTop = 0),
              W === V && C && (C.scrollTop = C.scrollHeight),
              W == null || W.focus(),
              document.activeElement !== $)
            )
              return;
        },
        [j, C]
      ),
      L = c.useCallback(() => I([R, x]), [I, R, x]);
    c.useEffect(() => {
      M && L();
    }, [M, L]);
    const { onOpenChange: P, triggerPointerDownPosRef: B } = w;
    c.useEffect(() => {
      if (x) {
        let A = { x: 0, y: 0 };
        const K = (V) => {
            var $, W;
            A = {
              x: Math.abs(Math.round(V.pageX) - ((($ = B.current) == null ? void 0 : $.x) ?? 0)),
              y: Math.abs(Math.round(V.pageY) - (((W = B.current) == null ? void 0 : W.y) ?? 0)),
            };
          },
          G = (V) => {
            A.x <= 10 && A.y <= 10 ? V.preventDefault() : x.contains(V.target) || P(!1),
              document.removeEventListener('pointermove', K),
              (B.current = null);
          };
        return (
          B.current !== null &&
            (document.addEventListener('pointermove', K),
            document.addEventListener('pointerup', G, { capture: !0, once: !0 })),
          () => {
            document.removeEventListener('pointermove', K),
              document.removeEventListener('pointerup', G, { capture: !0 });
          }
        );
      }
    }, [x, P, B]),
      c.useEffect(() => {
        const A = () => P(!1);
        return (
          window.addEventListener('blur', A),
          window.addEventListener('resize', A),
          () => {
            window.removeEventListener('blur', A), window.removeEventListener('resize', A);
          }
        );
      }, [P]);
    const [X, le] = Cr((A) => {
        const K = j().filter(($) => !$.disabled),
          G = K.find(($) => $.ref.current === document.activeElement),
          V = Nr(K, A, G);
        V && setTimeout(() => V.ref.current.focus());
      }),
      Le = c.useCallback(
        (A, K, G) => {
          const V = !H.current && !G;
          ((w.value !== void 0 && w.value === K) || V) && (F(A), V && (H.current = !0));
        },
        [w.value]
      ),
      De = c.useCallback(() => (x == null ? void 0 : x.focus()), [x]),
      fe = c.useCallback(
        (A, K, G) => {
          const V = !H.current && !G;
          ((w.value !== void 0 && w.value === K) || V) && T(A);
        },
        [w.value]
      ),
      Ce = o === 'popper' ? Bt : cr,
      xe =
        Ce === Bt
          ? {
              side: a,
              sideOffset: l,
              align: d,
              alignOffset: m,
              arrowPadding: f,
              collisionBoundary: h,
              collisionPadding: v,
              sticky: b,
              hideWhenDetached: p,
              avoidCollisions: g,
            }
          : {};
    return u.jsx(sr, {
      scope: n,
      content: x,
      viewport: C,
      onViewportChange: E,
      itemRefCallback: Le,
      selectedItem: R,
      onItemLeave: De,
      itemTextRefCallback: fe,
      focusSelectedItem: L,
      selectedItemText: _,
      position: o,
      isPositioned: M,
      searchRef: X,
      children: u.jsx(Jo, {
        as: nc,
        allowPinchZoom: !0,
        children: u.jsx(yo, {
          asChild: !0,
          trapped: w.open,
          onMountAutoFocus: (A) => {
            A.preventDefault();
          },
          onUnmountAutoFocus: O(r, (A) => {
            var K;
            (K = w.trigger) == null || K.focus({ preventScroll: !0 }), A.preventDefault();
          }),
          children: u.jsx(go, {
            asChild: !0,
            disableOutsidePointerEvents: !0,
            onEscapeKeyDown: s,
            onPointerDownOutside: i,
            onFocusOutside: (A) => A.preventDefault(),
            onDismiss: () => w.onOpenChange(!1),
            children: u.jsx(Ce, {
              role: 'listbox',
              id: w.contentId,
              'data-state': w.open ? 'open' : 'closed',
              dir: w.dir,
              onContextMenu: (A) => A.preventDefault(),
              ...y,
              ...xe,
              onPlaced: () => k(!0),
              ref: N,
              style: { display: 'flex', flexDirection: 'column', outline: 'none', ...y.style },
              onKeyDown: O(y.onKeyDown, (A) => {
                const K = A.ctrlKey || A.altKey || A.metaKey;
                if (
                  (A.key === 'Tab' && A.preventDefault(),
                  !K && A.key.length === 1 && le(A.key),
                  ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(A.key))
                ) {
                  let V = j()
                    .filter(($) => !$.disabled)
                    .map(($) => $.ref.current);
                  if (
                    (['ArrowUp', 'End'].includes(A.key) && (V = V.slice().reverse()),
                    ['ArrowUp', 'ArrowDown'].includes(A.key))
                  ) {
                    const $ = A.target,
                      W = V.indexOf($);
                    V = V.slice(W + 1);
                  }
                  setTimeout(() => I(V)), A.preventDefault();
                }
              }),
            }),
          }),
        }),
      }),
    });
  });
ar.displayName = tc;
var oc = 'SelectItemAlignedPosition',
  cr = c.forwardRef((e, t) => {
    const { __scopeSelect: n, onPlaced: o, ...r } = e,
      s = ve(Se, n),
      i = ye(Se, n),
      [a, l] = c.useState(null),
      [d, m] = c.useState(null),
      f = z(t, (N) => m(N)),
      h = bt(n),
      v = c.useRef(!1),
      b = c.useRef(!0),
      { viewport: p, selectedItem: g, selectedItemText: y, focusSelectedItem: w } = i,
      x = c.useCallback(() => {
        if (s.trigger && s.valueNode && a && d && p && g && y) {
          const N = s.trigger.getBoundingClientRect(),
            R = d.getBoundingClientRect(),
            F = s.valueNode.getBoundingClientRect(),
            _ = y.getBoundingClientRect();
          if (s.dir !== 'rtl') {
            const $ = _.left - R.left,
              W = F.left - $,
              q = N.left - W,
              oe = N.width + q,
              ke = Math.max(oe, R.width),
              Fe = window.innerWidth - J,
              Be = ct(W, [J, Math.max(J, Fe - ke)]);
            (a.style.minWidth = oe + 'px'), (a.style.left = Be + 'px');
          } else {
            const $ = R.right - _.right,
              W = window.innerWidth - F.right - $,
              q = window.innerWidth - N.right - W,
              oe = N.width + q,
              ke = Math.max(oe, R.width),
              Fe = window.innerWidth - J,
              Be = ct(W, [J, Math.max(J, Fe - ke)]);
            (a.style.minWidth = oe + 'px'), (a.style.right = Be + 'px');
          }
          const T = h(),
            j = window.innerHeight - J * 2,
            M = p.scrollHeight,
            k = window.getComputedStyle(d),
            H = Number.parseInt(k.borderTopWidth, 10),
            I = Number.parseInt(k.paddingTop, 10),
            L = Number.parseInt(k.borderBottomWidth, 10),
            P = Number.parseInt(k.paddingBottom, 10),
            B = H + I + M + P + L,
            X = Math.min(g.offsetHeight * 5, B),
            le = window.getComputedStyle(p),
            Le = Number.parseInt(le.paddingTop, 10),
            De = Number.parseInt(le.paddingBottom, 10),
            fe = N.top + N.height / 2 - J,
            Ce = j - fe,
            xe = g.offsetHeight / 2,
            A = g.offsetTop + xe,
            K = H + I + A,
            G = B - K;
          if (K <= fe) {
            const $ = T.length > 0 && g === T[T.length - 1].ref.current;
            a.style.bottom = '0px';
            const W = d.clientHeight - p.offsetTop - p.offsetHeight,
              q = Math.max(Ce, xe + ($ ? De : 0) + W + L),
              oe = K + q;
            a.style.height = oe + 'px';
          } else {
            const $ = T.length > 0 && g === T[0].ref.current;
            a.style.top = '0px';
            const q = Math.max(fe, H + p.offsetTop + ($ ? Le : 0) + xe) + G;
            (a.style.height = q + 'px'), (p.scrollTop = K - fe + p.offsetTop);
          }
          (a.style.margin = `${J}px 0`),
            (a.style.minHeight = X + 'px'),
            (a.style.maxHeight = j + 'px'),
            o == null || o(),
            requestAnimationFrame(() => (v.current = !0));
        }
      }, [h, s.trigger, s.valueNode, a, d, p, g, y, s.dir, o]);
    Y(() => x(), [x]);
    const [S, C] = c.useState();
    Y(() => {
      d && C(window.getComputedStyle(d).zIndex);
    }, [d]);
    const E = c.useCallback(
      (N) => {
        N && b.current === !0 && (x(), w == null || w(), (b.current = !1));
      },
      [x, w]
    );
    return u.jsx(ic, {
      scope: n,
      contentWrapper: a,
      shouldExpandOnScrollRef: v,
      onScrollButtonChange: E,
      children: u.jsx('div', {
        ref: l,
        style: { display: 'flex', flexDirection: 'column', position: 'fixed', zIndex: S },
        children: u.jsx(D.div, {
          ...r,
          ref: f,
          style: { boxSizing: 'border-box', maxHeight: '100%', ...r.style },
        }),
      }),
    });
  });
cr.displayName = oc;
var rc = 'SelectPopperPosition',
  Bt = c.forwardRef((e, t) => {
    const { __scopeSelect: n, align: o = 'start', collisionPadding: r = J, ...s } = e,
      i = an(n);
    return u.jsx(ea, {
      ...i,
      ...s,
      ref: t,
      align: o,
      collisionPadding: r,
      style: {
        boxSizing: 'border-box',
        ...s.style,
        '--radix-select-content-transform-origin': 'var(--radix-popper-transform-origin)',
        '--radix-select-content-available-width': 'var(--radix-popper-available-width)',
        '--radix-select-content-available-height': 'var(--radix-popper-available-height)',
        '--radix-select-trigger-width': 'var(--radix-popper-anchor-width)',
        '--radix-select-trigger-height': 'var(--radix-popper-anchor-height)',
      },
    });
  });
Bt.displayName = rc;
var [ic, cn] = Me(Se, {}),
  $t = 'SelectViewport',
  lr = c.forwardRef((e, t) => {
    const { __scopeSelect: n, nonce: o, ...r } = e,
      s = ye($t, n),
      i = cn($t, n),
      a = z(t, s.onViewportChange),
      l = c.useRef(0);
    return u.jsxs(u.Fragment, {
      children: [
        u.jsx('style', {
          dangerouslySetInnerHTML: {
            __html:
              '[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}',
          },
          nonce: o,
        }),
        u.jsx(sn.Slot, {
          scope: n,
          children: u.jsx(D.div, {
            'data-radix-select-viewport': '',
            role: 'presentation',
            ...r,
            ref: a,
            style: { position: 'relative', flex: 1, overflow: 'hidden auto', ...r.style },
            onScroll: O(r.onScroll, (d) => {
              const m = d.currentTarget,
                { contentWrapper: f, shouldExpandOnScrollRef: h } = i;
              if (h != null && h.current && f) {
                const v = Math.abs(l.current - m.scrollTop);
                if (v > 0) {
                  const b = window.innerHeight - J * 2,
                    p = Number.parseFloat(f.style.minHeight),
                    g = Number.parseFloat(f.style.height),
                    y = Math.max(p, g);
                  if (y < b) {
                    const w = y + v,
                      x = Math.min(b, w),
                      S = w - x;
                    (f.style.height = x + 'px'),
                      f.style.bottom === '0px' &&
                        ((m.scrollTop = S > 0 ? S : 0), (f.style.justifyContent = 'flex-end'));
                  }
                }
              }
              l.current = m.scrollTop;
            }),
          }),
        }),
      ],
    });
  });
lr.displayName = $t;
var dr = 'SelectGroup',
  [sc, ac] = Me(dr),
  cc = c.forwardRef((e, t) => {
    const { __scopeSelect: n, ...o } = e,
      r = ht();
    return u.jsx(sc, {
      scope: n,
      id: r,
      children: u.jsx(D.div, { role: 'group', 'aria-labelledby': r, ...o, ref: t }),
    });
  });
cc.displayName = dr;
var ur = 'SelectLabel',
  fr = c.forwardRef((e, t) => {
    const { __scopeSelect: n, ...o } = e,
      r = ac(ur, n);
    return u.jsx(D.div, { id: r.id, ...o, ref: t });
  });
fr.displayName = ur;
var pt = 'SelectItem',
  [lc, pr] = Me(pt),
  mr = c.forwardRef((e, t) => {
    const { __scopeSelect: n, value: o, disabled: r = !1, textValue: s, ...i } = e,
      a = ve(pt, n),
      l = ye(pt, n),
      d = a.value === o,
      [m, f] = c.useState(s ?? ''),
      [h, v] = c.useState(!1),
      b = z(t, (w) => {
        var x;
        return (x = l.itemRefCallback) == null ? void 0 : x.call(l, w, o, r);
      }),
      p = ht(),
      g = c.useRef('touch'),
      y = () => {
        r || (a.onValueChange(o), a.onOpenChange(!1));
      };
    if (o === '')
      throw new Error(
        'A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.'
      );
    return u.jsx(lc, {
      scope: n,
      value: o,
      disabled: r,
      textId: p,
      isSelected: d,
      onItemTextChange: c.useCallback((w) => {
        f((x) => x || ((w == null ? void 0 : w.textContent) ?? '').trim());
      }, []),
      children: u.jsx(sn.ItemSlot, {
        scope: n,
        value: o,
        disabled: r,
        textValue: m,
        children: u.jsx(D.div, {
          role: 'option',
          'aria-labelledby': p,
          'data-highlighted': h ? '' : void 0,
          'aria-selected': d && h,
          'data-state': d ? 'checked' : 'unchecked',
          'aria-disabled': r || void 0,
          'data-disabled': r ? '' : void 0,
          tabIndex: r ? void 0 : -1,
          ...i,
          ref: b,
          onFocus: O(i.onFocus, () => v(!0)),
          onBlur: O(i.onBlur, () => v(!1)),
          onClick: O(i.onClick, () => {
            g.current !== 'mouse' && y();
          }),
          onPointerUp: O(i.onPointerUp, () => {
            g.current === 'mouse' && y();
          }),
          onPointerDown: O(i.onPointerDown, (w) => {
            g.current = w.pointerType;
          }),
          onPointerMove: O(i.onPointerMove, (w) => {
            var x;
            (g.current = w.pointerType),
              r
                ? (x = l.onItemLeave) == null || x.call(l)
                : g.current === 'mouse' && w.currentTarget.focus({ preventScroll: !0 });
          }),
          onPointerLeave: O(i.onPointerLeave, (w) => {
            var x;
            w.currentTarget === document.activeElement &&
              ((x = l.onItemLeave) == null || x.call(l));
          }),
          onKeyDown: O(i.onKeyDown, (w) => {
            var S;
            (((S = l.searchRef) == null ? void 0 : S.current) !== '' && w.key === ' ') ||
              (Xa.includes(w.key) && y(), w.key === ' ' && w.preventDefault());
          }),
        }),
      }),
    });
  });
mr.displayName = pt;
var $e = 'SelectItemText',
  hr = c.forwardRef((e, t) => {
    const { __scopeSelect: n, className: o, style: r, ...s } = e,
      i = ve($e, n),
      a = ye($e, n),
      l = pr($e, n),
      d = Za($e, n),
      [m, f] = c.useState(null),
      h = z(
        t,
        (y) => f(y),
        l.onItemTextChange,
        (y) => {
          var w;
          return (w = a.itemTextRefCallback) == null ? void 0 : w.call(a, y, l.value, l.disabled);
        }
      ),
      v = m == null ? void 0 : m.textContent,
      b = c.useMemo(
        () => u.jsx('option', { value: l.value, disabled: l.disabled, children: v }, l.value),
        [l.disabled, l.value, v]
      ),
      { onNativeOptionAdd: p, onNativeOptionRemove: g } = d;
    return (
      Y(() => (p(b), () => g(b)), [p, g, b]),
      u.jsxs(u.Fragment, {
        children: [
          u.jsx(D.span, { id: l.textId, ...s, ref: h }),
          l.isSelected && i.valueNode && !i.valueNodeHasChildren
            ? mt.createPortal(s.children, i.valueNode)
            : null,
        ],
      })
    );
  });
hr.displayName = $e;
var gr = 'SelectItemIndicator',
  vr = c.forwardRef((e, t) => {
    const { __scopeSelect: n, ...o } = e;
    return pr(gr, n).isSelected ? u.jsx(D.span, { 'aria-hidden': !0, ...o, ref: t }) : null;
  });
vr.displayName = gr;
var Wt = 'SelectScrollUpButton',
  yr = c.forwardRef((e, t) => {
    const n = ye(Wt, e.__scopeSelect),
      o = cn(Wt, e.__scopeSelect),
      [r, s] = c.useState(!1),
      i = z(t, o.onScrollButtonChange);
    return (
      Y(() => {
        if (n.viewport && n.isPositioned) {
          const a = () => {
            const d = l.scrollTop > 0;
            s(d);
          };
          const l = n.viewport;
          return a(), l.addEventListener('scroll', a), () => l.removeEventListener('scroll', a);
        }
      }, [n.viewport, n.isPositioned]),
      r
        ? u.jsx(wr, {
            ...e,
            ref: i,
            onAutoScroll: () => {
              const { viewport: a, selectedItem: l } = n;
              a && l && (a.scrollTop = a.scrollTop - l.offsetHeight);
            },
          })
        : null
    );
  });
yr.displayName = Wt;
var Ht = 'SelectScrollDownButton',
  xr = c.forwardRef((e, t) => {
    const n = ye(Ht, e.__scopeSelect),
      o = cn(Ht, e.__scopeSelect),
      [r, s] = c.useState(!1),
      i = z(t, o.onScrollButtonChange);
    return (
      Y(() => {
        if (n.viewport && n.isPositioned) {
          const a = () => {
            const d = l.scrollHeight - l.clientHeight,
              m = Math.ceil(l.scrollTop) < d;
            s(m);
          };
          const l = n.viewport;
          return a(), l.addEventListener('scroll', a), () => l.removeEventListener('scroll', a);
        }
      }, [n.viewport, n.isPositioned]),
      r
        ? u.jsx(wr, {
            ...e,
            ref: i,
            onAutoScroll: () => {
              const { viewport: a, selectedItem: l } = n;
              a && l && (a.scrollTop = a.scrollTop + l.offsetHeight);
            },
          })
        : null
    );
  });
xr.displayName = Ht;
var wr = c.forwardRef((e, t) => {
    const { __scopeSelect: n, onAutoScroll: o, ...r } = e,
      s = ye('SelectScrollButton', n),
      i = c.useRef(null),
      a = bt(n),
      l = c.useCallback(() => {
        i.current !== null && (window.clearInterval(i.current), (i.current = null));
      }, []);
    return (
      c.useEffect(() => () => l(), [l]),
      Y(() => {
        var m;
        const d = a().find((f) => f.ref.current === document.activeElement);
        (m = d == null ? void 0 : d.ref.current) == null || m.scrollIntoView({ block: 'nearest' });
      }, [a]),
      u.jsx(D.div, {
        'aria-hidden': !0,
        ...r,
        ref: t,
        style: { flexShrink: 0, ...r.style },
        onPointerDown: O(r.onPointerDown, () => {
          i.current === null && (i.current = window.setInterval(o, 50));
        }),
        onPointerMove: O(r.onPointerMove, () => {
          var d;
          (d = s.onItemLeave) == null || d.call(s),
            i.current === null && (i.current = window.setInterval(o, 50));
        }),
        onPointerLeave: O(r.onPointerLeave, () => {
          l();
        }),
      })
    );
  }),
  dc = 'SelectSeparator',
  br = c.forwardRef((e, t) => {
    const { __scopeSelect: n, ...o } = e;
    return u.jsx(D.div, { 'aria-hidden': !0, ...o, ref: t });
  });
br.displayName = dc;
var Vt = 'SelectArrow',
  uc = c.forwardRef((e, t) => {
    const { __scopeSelect: n, ...o } = e,
      r = an(n),
      s = ve(Vt, n),
      i = ye(Vt, n);
    return s.open && i.position === 'popper' ? u.jsx(ta, { ...r, ...o, ref: t }) : null;
  });
uc.displayName = Vt;
var fc = 'SelectBubbleInput',
  pc = c.forwardRef(({ __scopeSelect: e, value: t, ...n }, o) => {
    const r = c.useRef(null),
      s = z(o, r),
      i = Vo(t);
    return (
      c.useEffect(() => {
        const a = r.current;
        if (!a) return;
        const l = window.HTMLSelectElement.prototype,
          m = Object.getOwnPropertyDescriptor(l, 'value').set;
        if (i !== t && m) {
          const f = new Event('change', { bubbles: !0 });
          m.call(a, t), a.dispatchEvent(f);
        }
      }, [i, t]),
      u.jsx(D.select, { ...n, style: { ...Uo, ...n.style }, ref: s, defaultValue: t })
    );
  });
pc.displayName = fc;
function Sr(e) {
  return e === '' || e === void 0;
}
function Cr(e) {
  const t = me(e),
    n = c.useRef(''),
    o = c.useRef(0),
    r = c.useCallback(
      (i) => {
        const a = n.current + i;
        t(a),
          (function l(d) {
            (n.current = d),
              window.clearTimeout(o.current),
              d !== '' && (o.current = window.setTimeout(() => l(''), 1e3));
          })(a);
      },
      [t]
    ),
    s = c.useCallback(() => {
      (n.current = ''), window.clearTimeout(o.current);
    }, []);
  return c.useEffect(() => () => window.clearTimeout(o.current), []), [n, r, s];
}
function Nr(e, t, n) {
  const r = t.length > 1 && Array.from(t).every((d) => d === t[0]) ? t[0] : t,
    s = n ? e.indexOf(n) : -1;
  let i = mc(e, Math.max(s, 0));
  r.length === 1 && (i = i.filter((d) => d !== n));
  const l = i.find((d) => d.textValue.toLowerCase().startsWith(r.toLowerCase()));
  return l !== n ? l : void 0;
}
function mc(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
var Er = tr,
  hc = or,
  gc = rr,
  Rr = ir,
  vc = lr,
  Pr = fr,
  Ar = mr,
  yc = hr,
  xc = vr,
  Tr = yr,
  Ir = xr,
  _r = br;
function ln(e, t) {
  if (e == null) return {};
  var n = {},
    o = Object.keys(e),
    r,
    s;
  for (s = 0; s < o.length; s++) (r = o[s]), !(t.indexOf(r) >= 0) && (n[r] = e[r]);
  return n;
}
var wc = ['color'],
  bc = c.forwardRef((e, t) => {
    var n = e.color,
      o = n === void 0 ? 'currentColor' : n,
      r = ln(e, wc);
    return c.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        r,
        { ref: t }
      ),
      c.createElement('path', {
        d: 'M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      })
    );
  }),
  Sc = ['color'],
  Or = c.forwardRef((e, t) => {
    var n = e.color,
      o = n === void 0 ? 'currentColor' : n,
      r = ln(e, Sc);
    return c.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        r,
        { ref: t }
      ),
      c.createElement('path', {
        d: 'M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      })
    );
  }),
  Cc = ['color'],
  Nc = c.forwardRef((e, t) => {
    var n = e.color,
      o = n === void 0 ? 'currentColor' : n,
      r = ln(e, Cc);
    return c.createElement(
      'svg',
      Object.assign(
        {
          width: '15',
          height: '15',
          viewBox: '0 0 15 15',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        r,
        { ref: t }
      ),
      c.createElement('path', {
        d: 'M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z',
        fill: o,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
      })
    );
  });
const Mr = c.forwardRef(({ className: e, children: t, ...n }, o) =>
  u.jsxs(Er, {
    ref: o,
    className: U(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-disabled',
      'transition-all duration-200 hover:opacity-hover',
      '[&>span]:line-clamp-1',
      e
    ),
    ...n,
    children: [
      t,
      u.jsx(hc, { asChild: !0, children: u.jsx(Or, { className: 'h-4 w-4 opacity-50' }) }),
    ],
  })
);
Mr.displayName = Er.displayName;
const dn = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx(Tr, {
    ref: n,
    className: U('flex cursor-default items-center justify-center py-1', e),
    ...t,
    children: u.jsx(Nc, { className: 'h-4 w-4' }),
  })
);
dn.displayName = Tr.displayName;
const un = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx(Ir, {
    ref: n,
    className: U('flex cursor-default items-center justify-center py-1', e),
    ...t,
    children: u.jsx(Or, { className: 'h-4 w-4' }),
  })
);
un.displayName = Ir.displayName;
const jr = c.forwardRef(({ className: e, children: t, position: n = 'popper', ...o }, r) =>
  u.jsx(gc, {
    children: u.jsxs(Rr, {
      ref: r,
      className: U(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        n === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        e
      ),
      position: n,
      ...o,
      children: [
        u.jsx(dn, {}),
        u.jsx(vc, {
          className: U(
            'p-1',
            n === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          ),
          children: t,
        }),
        u.jsx(un, {}),
      ],
    }),
  })
);
jr.displayName = Rr.displayName;
const Lr = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx(Pr, { ref: n, className: U('py-1.5 pl-8 pr-2 text-sm font-semibold', e), ...t })
);
Lr.displayName = Pr.displayName;
const Dr = c.forwardRef(({ className: e, children: t, ...n }, o) =>
  u.jsxs(Ar, {
    ref: o,
    className: U(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-disabled',
      'transition-colors duration-200',
      e
    ),
    ...n,
    children: [
      u.jsx('span', {
        className: 'absolute left-2 flex h-3.5 w-3.5 items-center justify-center',
        children: u.jsx(xc, { children: u.jsx(bc, { className: 'h-4 w-4' }) }),
      }),
      u.jsx(yc, { children: t }),
    ],
  })
);
Dr.displayName = Ar.displayName;
const kr = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx(_r, { ref: n, className: U('-mx-1 my-1 h-px bg-muted', e), ...t })
);
kr.displayName = _r.displayName;
Mr.__docgenInfo = { description: '', methods: [] };
jr.__docgenInfo = {
  description: '',
  methods: [],
  props: { position: { defaultValue: { value: "'popper'", computed: !1 }, required: !1 } },
};
Lr.__docgenInfo = { description: '', methods: [] };
Dr.__docgenInfo = { description: '', methods: [] };
kr.__docgenInfo = { description: '', methods: [] };
dn.__docgenInfo = { description: '', methods: [] };
un.__docgenInfo = { description: '', methods: [] };
var Fr = ['PageUp', 'PageDown'],
  Br = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  $r = {
    'from-left': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
    'from-right': ['Home', 'PageDown', 'ArrowDown', 'ArrowRight'],
    'from-bottom': ['Home', 'PageDown', 'ArrowDown', 'ArrowLeft'],
    'from-top': ['Home', 'PageDown', 'ArrowUp', 'ArrowLeft'],
  },
  je = 'Slider',
  [Ut, Ec, Rc] = Yt(je),
  [Wr, vl] = Ie(je, [Rc]),
  [Pc, St] = Wr(je),
  Hr = c.forwardRef((e, t) => {
    const {
        name: n,
        min: o = 0,
        max: r = 100,
        step: s = 1,
        orientation: i = 'horizontal',
        disabled: a = !1,
        minStepsBetweenThumbs: l = 0,
        defaultValue: d = [o],
        value: m,
        onValueChange: f = () => {},
        onValueCommit: h = () => {},
        inverted: v = !1,
        form: b,
        ...p
      } = e,
      g = c.useRef(new Set()),
      y = c.useRef(0),
      x = i === 'horizontal' ? Ac : Tc,
      [S = [], C] = rn({
        prop: m,
        defaultProp: d,
        onChange: (T) => {
          var M;
          (M = [...g.current][y.current]) == null || M.focus(), f(T);
        },
      }),
      E = c.useRef(S);
    function N(T) {
      const j = jc(S, T);
      _(T, j);
    }
    function R(T) {
      _(T, y.current);
    }
    function F() {
      const T = E.current[y.current];
      S[y.current] !== T && h(S);
    }
    function _(T, j, { commit: M } = { commit: !1 }) {
      const k = Fc(s),
        H = Bc(Math.round((T - o) / s) * s + o, k),
        I = ct(H, [o, r]);
      C((L = []) => {
        const P = Oc(L, I, j);
        if (kc(P, l * s)) {
          y.current = P.indexOf(I);
          const B = String(P) !== String(L);
          return B && M && h(P), B ? P : L;
        } else return L;
      });
    }
    return u.jsx(Pc, {
      scope: e.__scopeSlider,
      name: n,
      disabled: a,
      min: o,
      max: r,
      valueIndexToChangeRef: y,
      thumbs: g.current,
      values: S,
      orientation: i,
      form: b,
      children: u.jsx(Ut.Provider, {
        scope: e.__scopeSlider,
        children: u.jsx(Ut.Slot, {
          scope: e.__scopeSlider,
          children: u.jsx(x, {
            'aria-disabled': a,
            'data-disabled': a ? '' : void 0,
            ...p,
            ref: t,
            onPointerDown: O(p.onPointerDown, () => {
              a || (E.current = S);
            }),
            min: o,
            max: r,
            inverted: v,
            onSlideStart: a ? void 0 : N,
            onSlideMove: a ? void 0 : R,
            onSlideEnd: a ? void 0 : F,
            onHomeKeyDown: () => !a && _(o, 0, { commit: !0 }),
            onEndKeyDown: () => !a && _(r, S.length - 1, { commit: !0 }),
            onStepKeyDown: ({ event: T, direction: j }) => {
              if (!a) {
                const H = Fr.includes(T.key) || (T.shiftKey && Br.includes(T.key)) ? 10 : 1,
                  I = y.current,
                  L = S[I],
                  P = s * H * j;
                _(L + P, I, { commit: !0 });
              }
            },
          }),
        }),
      }),
    });
  });
Hr.displayName = je;
var [Vr, Ur] = Wr(je, { startEdge: 'left', endEdge: 'right', size: 'width', direction: 1 }),
  Ac = c.forwardRef((e, t) => {
    const {
        min: n,
        max: o,
        dir: r,
        inverted: s,
        onSlideStart: i,
        onSlideMove: a,
        onSlideEnd: l,
        onStepKeyDown: d,
        ...m
      } = e,
      [f, h] = c.useState(null),
      v = z(t, (x) => h(x)),
      b = c.useRef(void 0),
      p = Xt(r),
      g = p === 'ltr',
      y = (g && !s) || (!g && s);
    function w(x) {
      const S = b.current || f.getBoundingClientRect(),
        C = [0, S.width],
        N = fn(C, y ? [n, o] : [o, n]);
      return (b.current = S), N(x - S.left);
    }
    return u.jsx(Vr, {
      scope: e.__scopeSlider,
      startEdge: y ? 'left' : 'right',
      endEdge: y ? 'right' : 'left',
      direction: y ? 1 : -1,
      size: 'width',
      children: u.jsx(Kr, {
        dir: p,
        'data-orientation': 'horizontal',
        ...m,
        ref: v,
        style: { ...m.style, '--radix-slider-thumb-transform': 'translateX(-50%)' },
        onSlideStart: (x) => {
          const S = w(x.clientX);
          i == null || i(S);
        },
        onSlideMove: (x) => {
          const S = w(x.clientX);
          a == null || a(S);
        },
        onSlideEnd: () => {
          (b.current = void 0), l == null || l();
        },
        onStepKeyDown: (x) => {
          const C = $r[y ? 'from-left' : 'from-right'].includes(x.key);
          d == null || d({ event: x, direction: C ? -1 : 1 });
        },
      }),
    });
  }),
  Tc = c.forwardRef((e, t) => {
    const {
        min: n,
        max: o,
        inverted: r,
        onSlideStart: s,
        onSlideMove: i,
        onSlideEnd: a,
        onStepKeyDown: l,
        ...d
      } = e,
      m = c.useRef(null),
      f = z(t, m),
      h = c.useRef(void 0),
      v = !r;
    function b(p) {
      const g = h.current || m.current.getBoundingClientRect(),
        y = [0, g.height],
        x = fn(y, v ? [o, n] : [n, o]);
      return (h.current = g), x(p - g.top);
    }
    return u.jsx(Vr, {
      scope: e.__scopeSlider,
      startEdge: v ? 'bottom' : 'top',
      endEdge: v ? 'top' : 'bottom',
      size: 'height',
      direction: v ? 1 : -1,
      children: u.jsx(Kr, {
        'data-orientation': 'vertical',
        ...d,
        ref: f,
        style: { ...d.style, '--radix-slider-thumb-transform': 'translateY(50%)' },
        onSlideStart: (p) => {
          const g = b(p.clientY);
          s == null || s(g);
        },
        onSlideMove: (p) => {
          const g = b(p.clientY);
          i == null || i(g);
        },
        onSlideEnd: () => {
          (h.current = void 0), a == null || a();
        },
        onStepKeyDown: (p) => {
          const y = $r[v ? 'from-bottom' : 'from-top'].includes(p.key);
          l == null || l({ event: p, direction: y ? -1 : 1 });
        },
      }),
    });
  }),
  Kr = c.forwardRef((e, t) => {
    const {
        __scopeSlider: n,
        onSlideStart: o,
        onSlideMove: r,
        onSlideEnd: s,
        onHomeKeyDown: i,
        onEndKeyDown: a,
        onStepKeyDown: l,
        ...d
      } = e,
      m = St(je, n);
    return u.jsx(D.span, {
      ...d,
      ref: t,
      onKeyDown: O(e.onKeyDown, (f) => {
        f.key === 'Home'
          ? (i(f), f.preventDefault())
          : f.key === 'End'
            ? (a(f), f.preventDefault())
            : Fr.concat(Br).includes(f.key) && (l(f), f.preventDefault());
      }),
      onPointerDown: O(e.onPointerDown, (f) => {
        const h = f.target;
        h.setPointerCapture(f.pointerId), f.preventDefault(), m.thumbs.has(h) ? h.focus() : o(f);
      }),
      onPointerMove: O(e.onPointerMove, (f) => {
        f.target.hasPointerCapture(f.pointerId) && r(f);
      }),
      onPointerUp: O(e.onPointerUp, (f) => {
        const h = f.target;
        h.hasPointerCapture(f.pointerId) && (h.releasePointerCapture(f.pointerId), s(f));
      }),
    });
  }),
  zr = 'SliderTrack',
  Gr = c.forwardRef((e, t) => {
    const { __scopeSlider: n, ...o } = e,
      r = St(zr, n);
    return u.jsx(D.span, {
      'data-disabled': r.disabled ? '' : void 0,
      'data-orientation': r.orientation,
      ...o,
      ref: t,
    });
  });
Gr.displayName = zr;
var Kt = 'SliderRange',
  Yr = c.forwardRef((e, t) => {
    const { __scopeSlider: n, ...o } = e,
      r = St(Kt, n),
      s = Ur(Kt, n),
      i = c.useRef(null),
      a = z(t, i),
      l = r.values.length,
      d = r.values.map((h) => Zr(h, r.min, r.max)),
      m = l > 1 ? Math.min(...d) : 0,
      f = 100 - Math.max(...d);
    return u.jsx(D.span, {
      'data-orientation': r.orientation,
      'data-disabled': r.disabled ? '' : void 0,
      ...o,
      ref: a,
      style: { ...e.style, [s.startEdge]: m + '%', [s.endEdge]: f + '%' },
    });
  });
Yr.displayName = Kt;
var zt = 'SliderThumb',
  Xr = c.forwardRef((e, t) => {
    const n = Ec(e.__scopeSlider),
      [o, r] = c.useState(null),
      s = z(t, (a) => r(a)),
      i = c.useMemo(() => (o ? n().findIndex((a) => a.ref.current === o) : -1), [n, o]);
    return u.jsx(Ic, { ...e, ref: s, index: i });
  }),
  Ic = c.forwardRef((e, t) => {
    const { __scopeSlider: n, index: o, name: r, ...s } = e,
      i = St(zt, n),
      a = Ur(zt, n),
      [l, d] = c.useState(null),
      m = z(t, (w) => d(w)),
      f = l ? i.form || !!l.closest('form') : !0,
      h = _o(l),
      v = i.values[o],
      b = v === void 0 ? 0 : Zr(v, i.min, i.max),
      p = Mc(o, i.values.length),
      g = h == null ? void 0 : h[a.size],
      y = g ? Lc(g, b, a.direction) : 0;
    return (
      c.useEffect(() => {
        if (l)
          return (
            i.thumbs.add(l),
            () => {
              i.thumbs.delete(l);
            }
          );
      }, [l, i.thumbs]),
      u.jsxs('span', {
        style: {
          transform: 'var(--radix-slider-thumb-transform)',
          position: 'absolute',
          [a.startEdge]: `calc(${b}% + ${y}px)`,
        },
        children: [
          u.jsx(Ut.ItemSlot, {
            scope: e.__scopeSlider,
            children: u.jsx(D.span, {
              role: 'slider',
              'aria-label': e['aria-label'] || p,
              'aria-valuemin': i.min,
              'aria-valuenow': v,
              'aria-valuemax': i.max,
              'aria-orientation': i.orientation,
              'data-orientation': i.orientation,
              'data-disabled': i.disabled ? '' : void 0,
              tabIndex: i.disabled ? void 0 : 0,
              ...s,
              ref: m,
              style: v === void 0 ? { display: 'none' } : e.style,
              onFocus: O(e.onFocus, () => {
                i.valueIndexToChangeRef.current = o;
              }),
            }),
          }),
          f &&
            u.jsx(
              qr,
              {
                name: r ?? (i.name ? i.name + (i.values.length > 1 ? '[]' : '') : void 0),
                form: i.form,
                value: v,
              },
              o
            ),
        ],
      })
    );
  });
Xr.displayName = zt;
var _c = 'RadioBubbleInput',
  qr = c.forwardRef(({ __scopeSlider: e, value: t, ...n }, o) => {
    const r = c.useRef(null),
      s = z(r, o),
      i = Vo(t);
    return (
      c.useEffect(() => {
        const a = r.current;
        if (!a) return;
        const l = window.HTMLInputElement.prototype,
          m = Object.getOwnPropertyDescriptor(l, 'value').set;
        if (i !== t && m) {
          const f = new Event('input', { bubbles: !0 });
          m.call(a, t), a.dispatchEvent(f);
        }
      }, [i, t]),
      u.jsx(D.input, { style: { display: 'none' }, ...n, ref: s, defaultValue: t })
    );
  });
qr.displayName = _c;
function Oc(e = [], t, n) {
  const o = [...e];
  return (o[n] = t), o.sort((r, s) => r - s);
}
function Zr(e, t, n) {
  const s = (100 / (n - t)) * (e - t);
  return ct(s, [0, 100]);
}
function Mc(e, t) {
  return t > 2 ? `Value ${e + 1} of ${t}` : t === 2 ? ['Minimum', 'Maximum'][e] : void 0;
}
function jc(e, t) {
  if (e.length === 1) return 0;
  const n = e.map((r) => Math.abs(r - t)),
    o = Math.min(...n);
  return n.indexOf(o);
}
function Lc(e, t, n) {
  const o = e / 2,
    s = fn([0, 50], [0, o]);
  return (o - s(t) * n) * n;
}
function Dc(e) {
  return e.slice(0, -1).map((t, n) => e[n + 1] - t);
}
function kc(e, t) {
  if (t > 0) {
    const n = Dc(e);
    return Math.min(...n) >= t;
  }
  return !0;
}
function fn(e, t) {
  return (n) => {
    if (e[0] === e[1] || t[0] === t[1]) return t[0];
    const o = (t[1] - t[0]) / (e[1] - e[0]);
    return t[0] + o * (n - e[0]);
  };
}
function Fc(e) {
  return (String(e).split('.')[1] || '').length;
}
function Bc(e, t) {
  const n = Math.pow(10, t);
  return Math.round(e * n) / n;
}
var Qr = Hr,
  $c = Gr,
  Wc = Yr,
  Hc = Xr;
const Jr = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsxs(Qr, {
    ref: n,
    className: U(
      'relative flex w-full touch-none select-none items-center',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-disabled',
      e
    ),
    ...t,
    children: [
      u.jsx($c, {
        className: 'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
        children: u.jsx(Wc, {
          className: 'absolute h-full bg-primary transition-all duration-200',
        }),
      }),
      u.jsx(Hc, {
        className:
          'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-110 active:scale-active disabled:pointer-events-none disabled:opacity-disabled',
      }),
    ],
  })
);
Jr.displayName = Qr.displayName;
Jr.__docgenInfo = { description: '', methods: [] };
var Mt = 'rovingFocusGroup.onEntryFocus',
  Vc = { bubbles: !1, cancelable: !0 },
  qe = 'RovingFocusGroup',
  [Gt, ei, Uc] = Yt(qe),
  [Kc, ti] = Ie(qe, [Uc]),
  [zc, Gc] = Kc(qe),
  ni = c.forwardRef((e, t) =>
    u.jsx(Gt.Provider, {
      scope: e.__scopeRovingFocusGroup,
      children: u.jsx(Gt.Slot, {
        scope: e.__scopeRovingFocusGroup,
        children: u.jsx(Yc, { ...e, ref: t }),
      }),
    })
  );
ni.displayName = qe;
var Yc = c.forwardRef((e, t) => {
    const {
        __scopeRovingFocusGroup: n,
        orientation: o,
        loop: r = !1,
        dir: s,
        currentTabStopId: i,
        defaultCurrentTabStopId: a,
        onCurrentTabStopIdChange: l,
        onEntryFocus: d,
        preventScrollOnEntryFocus: m = !1,
        ...f
      } = e,
      h = c.useRef(null),
      v = z(t, h),
      b = Xt(s),
      [p, g] = rn({ prop: i, defaultProp: a ?? null, onChange: l, caller: qe }),
      [y, w] = c.useState(!1),
      x = me(d),
      S = ei(n),
      C = c.useRef(!1),
      [E, N] = c.useState(0);
    return (
      c.useEffect(() => {
        const R = h.current;
        if (R) return R.addEventListener(Mt, x), () => R.removeEventListener(Mt, x);
      }, [x]),
      u.jsx(zc, {
        scope: n,
        orientation: o,
        dir: b,
        loop: r,
        currentTabStopId: p,
        onItemFocus: c.useCallback((R) => g(R), [g]),
        onItemShiftTab: c.useCallback(() => w(!0), []),
        onFocusableItemAdd: c.useCallback(() => N((R) => R + 1), []),
        onFocusableItemRemove: c.useCallback(() => N((R) => R - 1), []),
        children: u.jsx(D.div, {
          tabIndex: y || E === 0 ? -1 : 0,
          'data-orientation': o,
          ...f,
          ref: v,
          style: { outline: 'none', ...e.style },
          onMouseDown: O(e.onMouseDown, () => {
            C.current = !0;
          }),
          onFocus: O(e.onFocus, (R) => {
            const F = !C.current;
            if (R.target === R.currentTarget && F && !y) {
              const _ = new CustomEvent(Mt, Vc);
              if ((R.currentTarget.dispatchEvent(_), !_.defaultPrevented)) {
                const T = S().filter((I) => I.focusable),
                  j = T.find((I) => I.active),
                  M = T.find((I) => I.id === p),
                  H = [j, M, ...T].filter(Boolean).map((I) => I.ref.current);
                ii(H, m);
              }
            }
            C.current = !1;
          }),
          onBlur: O(e.onBlur, () => w(!1)),
        }),
      })
    );
  }),
  oi = 'RovingFocusGroupItem',
  ri = c.forwardRef((e, t) => {
    const {
        __scopeRovingFocusGroup: n,
        focusable: o = !0,
        active: r = !1,
        tabStopId: s,
        children: i,
        ...a
      } = e,
      l = ht(),
      d = s || l,
      m = Gc(oi, n),
      f = m.currentTabStopId === d,
      h = ei(n),
      { onFocusableItemAdd: v, onFocusableItemRemove: b, currentTabStopId: p } = m;
    return (
      c.useEffect(() => {
        if (o) return v(), () => b();
      }, [o, v, b]),
      u.jsx(Gt.ItemSlot, {
        scope: n,
        id: d,
        focusable: o,
        active: r,
        children: u.jsx(D.span, {
          tabIndex: f ? 0 : -1,
          'data-orientation': m.orientation,
          ...a,
          ref: t,
          onMouseDown: O(e.onMouseDown, (g) => {
            o ? m.onItemFocus(d) : g.preventDefault();
          }),
          onFocus: O(e.onFocus, () => m.onItemFocus(d)),
          onKeyDown: O(e.onKeyDown, (g) => {
            if (g.key === 'Tab' && g.shiftKey) {
              m.onItemShiftTab();
              return;
            }
            if (g.target !== g.currentTarget) return;
            const y = Zc(g, m.orientation, m.dir);
            if (y !== void 0) {
              if (g.metaKey || g.ctrlKey || g.altKey || g.shiftKey) return;
              g.preventDefault();
              let x = h()
                .filter((S) => S.focusable)
                .map((S) => S.ref.current);
              if (y === 'last') x.reverse();
              else if (y === 'prev' || y === 'next') {
                y === 'prev' && x.reverse();
                const S = x.indexOf(g.currentTarget);
                x = m.loop ? Qc(x, S + 1) : x.slice(S + 1);
              }
              setTimeout(() => ii(x));
            }
          }),
          children: typeof i == 'function' ? i({ isCurrentTabStop: f, hasTabStop: p != null }) : i,
        }),
      })
    );
  });
ri.displayName = oi;
var Xc = {
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageUp: 'first',
  Home: 'first',
  PageDown: 'last',
  End: 'last',
};
function qc(e, t) {
  return t !== 'rtl' ? e : e === 'ArrowLeft' ? 'ArrowRight' : e === 'ArrowRight' ? 'ArrowLeft' : e;
}
function Zc(e, t, n) {
  const o = qc(e.key, n);
  if (
    !(t === 'vertical' && ['ArrowLeft', 'ArrowRight'].includes(o)) &&
    !(t === 'horizontal' && ['ArrowUp', 'ArrowDown'].includes(o))
  )
    return Xc[o];
}
function ii(e, t = !1) {
  const n = document.activeElement;
  for (const o of e)
    if (o === n || (o.focus({ preventScroll: t }), document.activeElement !== n)) return;
}
function Qc(e, t) {
  return e.map((n, o) => e[(t + o) % e.length]);
}
var Jc = ni,
  el = ri;
function tl(e, t) {
  return c.useReducer((n, o) => t[n][o] ?? n, e);
}
var si = (e) => {
  const { present: t, children: n } = e,
    o = nl(t),
    r = typeof n == 'function' ? n({ present: o.isPresent }) : c.Children.only(n),
    s = z(o.ref, ol(r));
  return typeof n == 'function' || o.isPresent ? c.cloneElement(r, { ref: s }) : null;
};
si.displayName = 'Presence';
function nl(e) {
  const [t, n] = c.useState(),
    o = c.useRef(null),
    r = c.useRef(e),
    s = c.useRef('none'),
    i = e ? 'mounted' : 'unmounted',
    [a, l] = tl(i, {
      mounted: { UNMOUNT: 'unmounted', ANIMATION_OUT: 'unmountSuspended' },
      unmountSuspended: { MOUNT: 'mounted', ANIMATION_END: 'unmounted' },
      unmounted: { MOUNT: 'mounted' },
    });
  return (
    c.useEffect(() => {
      const d = ot(o.current);
      s.current = a === 'mounted' ? d : 'none';
    }, [a]),
    Y(() => {
      const d = o.current,
        m = r.current;
      if (m !== e) {
        const h = s.current,
          v = ot(d);
        e
          ? l('MOUNT')
          : v === 'none' || (d == null ? void 0 : d.display) === 'none'
            ? l('UNMOUNT')
            : l(m && h !== v ? 'ANIMATION_OUT' : 'UNMOUNT'),
          (r.current = e);
      }
    }, [e, l]),
    Y(() => {
      if (t) {
        let d;
        const m = t.ownerDocument.defaultView ?? window,
          f = (v) => {
            const p = ot(o.current).includes(v.animationName);
            if (v.target === t && p && (l('ANIMATION_END'), !r.current)) {
              const g = t.style.animationFillMode;
              (t.style.animationFillMode = 'forwards'),
                (d = m.setTimeout(() => {
                  t.style.animationFillMode === 'forwards' && (t.style.animationFillMode = g);
                }));
            }
          },
          h = (v) => {
            v.target === t && (s.current = ot(o.current));
          };
        return (
          t.addEventListener('animationstart', h),
          t.addEventListener('animationcancel', f),
          t.addEventListener('animationend', f),
          () => {
            m.clearTimeout(d),
              t.removeEventListener('animationstart', h),
              t.removeEventListener('animationcancel', f),
              t.removeEventListener('animationend', f);
          }
        );
      } else l('ANIMATION_END');
    }, [t, l]),
    {
      isPresent: ['mounted', 'unmountSuspended'].includes(a),
      ref: c.useCallback((d) => {
        (o.current = d ? getComputedStyle(d) : null), n(d);
      }, []),
    }
  );
}
function ot(e) {
  return (e == null ? void 0 : e.animationName) || 'none';
}
function ol(e) {
  var o, r;
  let t = (o = Object.getOwnPropertyDescriptor(e.props, 'ref')) == null ? void 0 : o.get,
    n = t && 'isReactWarning' in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t = (r = Object.getOwnPropertyDescriptor(e, 'ref')) == null ? void 0 : r.get),
      (n = t && 'isReactWarning' in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
var Ct = 'Tabs',
  [rl, yl] = Ie(Ct, [ti]),
  ai = ti(),
  [il, pn] = rl(Ct),
  sl = c.forwardRef((e, t) => {
    const {
        __scopeTabs: n,
        value: o,
        onValueChange: r,
        defaultValue: s,
        orientation: i = 'horizontal',
        dir: a,
        activationMode: l = 'automatic',
        ...d
      } = e,
      m = Xt(a),
      [f, h] = rn({ prop: o, onChange: r, defaultProp: s ?? '', caller: Ct });
    return u.jsx(il, {
      scope: n,
      baseId: ht(),
      value: f,
      onValueChange: h,
      orientation: i,
      dir: m,
      activationMode: l,
      children: u.jsx(D.div, { dir: m, 'data-orientation': i, ...d, ref: t }),
    });
  });
sl.displayName = Ct;
var ci = 'TabsList',
  li = c.forwardRef((e, t) => {
    const { __scopeTabs: n, loop: o = !0, ...r } = e,
      s = pn(ci, n),
      i = ai(n);
    return u.jsx(Jc, {
      asChild: !0,
      ...i,
      orientation: s.orientation,
      dir: s.dir,
      loop: o,
      children: u.jsx(D.div, { role: 'tablist', 'aria-orientation': s.orientation, ...r, ref: t }),
    });
  });
li.displayName = ci;
var di = 'TabsTrigger',
  ui = c.forwardRef((e, t) => {
    const { __scopeTabs: n, value: o, disabled: r = !1, ...s } = e,
      i = pn(di, n),
      a = ai(n),
      l = mi(i.baseId, o),
      d = hi(i.baseId, o),
      m = o === i.value;
    return u.jsx(el, {
      asChild: !0,
      ...a,
      focusable: !r,
      active: m,
      children: u.jsx(D.button, {
        type: 'button',
        role: 'tab',
        'aria-selected': m,
        'aria-controls': d,
        'data-state': m ? 'active' : 'inactive',
        'data-disabled': r ? '' : void 0,
        disabled: r,
        id: l,
        ...s,
        ref: t,
        onMouseDown: O(e.onMouseDown, (f) => {
          !r && f.button === 0 && f.ctrlKey === !1 ? i.onValueChange(o) : f.preventDefault();
        }),
        onKeyDown: O(e.onKeyDown, (f) => {
          [' ', 'Enter'].includes(f.key) && i.onValueChange(o);
        }),
        onFocus: O(e.onFocus, () => {
          const f = i.activationMode !== 'manual';
          !m && !r && f && i.onValueChange(o);
        }),
      }),
    });
  });
ui.displayName = di;
var fi = 'TabsContent',
  pi = c.forwardRef((e, t) => {
    const { __scopeTabs: n, value: o, forceMount: r, children: s, ...i } = e,
      a = pn(fi, n),
      l = mi(a.baseId, o),
      d = hi(a.baseId, o),
      m = o === a.value,
      f = c.useRef(m);
    return (
      c.useEffect(() => {
        const h = requestAnimationFrame(() => (f.current = !1));
        return () => cancelAnimationFrame(h);
      }, []),
      u.jsx(si, {
        present: r || m,
        children: ({ present: h }) =>
          u.jsx(D.div, {
            'data-state': m ? 'active' : 'inactive',
            'data-orientation': a.orientation,
            role: 'tabpanel',
            'aria-labelledby': l,
            hidden: !h,
            id: d,
            tabIndex: 0,
            ...i,
            ref: t,
            style: { ...e.style, animationDuration: f.current ? '0s' : void 0 },
            children: h && s,
          }),
      })
    );
  });
pi.displayName = fi;
function mi(e, t) {
  return `${e}-trigger-${t}`;
}
function hi(e, t) {
  return `${e}-content-${t}`;
}
var gi = li,
  vi = ui,
  yi = pi;
const xi = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx(gi, {
    ref: n,
    className: U(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      e
    ),
    ...t,
  })
);
xi.displayName = gi.displayName;
const wi = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx(vi, {
    ref: n,
    className: U(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-disabled',
      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      'hover:opacity-hover active:scale-active',
      e
    ),
    ...t,
  })
);
wi.displayName = vi.displayName;
const bi = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx(yi, {
    ref: n,
    className: U(
      'mt-2 ring-offset-background',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      e
    ),
    ...t,
  })
);
bi.displayName = yi.displayName;
xi.__docgenInfo = { description: '', methods: [] };
wi.__docgenInfo = { description: '', methods: [] };
bi.__docgenInfo = { description: '', methods: [] };
const ee = c.forwardRef(({ variant: e = 'golden', className: t, ...n }, o) => {
  const r = {
    reading: 'container-reading',
    golden: 'container-golden',
    wide: 'max-w-7xl mx-auto px-phi-1',
    full: 'w-full px-phi-1',
  };
  return u.jsx('div', { ref: o, className: U(r[e], t), ...n });
});
ee.displayName = 'Container';
const mn = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('div', { ref: n, className: U('reading-layout', e), ...t })
);
mn.displayName = 'ReadingLayout';
const hn = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('div', { ref: n, className: U('action-layout', e), ...t })
);
hn.displayName = 'ActionLayout';
const gn = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('div', { ref: n, className: U('content-sidebar', e), ...t })
);
gn.displayName = 'ContentSidebar';
const vn = c.forwardRef(({ className: e, ...t }, n) =>
  u.jsx('div', { ref: n, className: U('app-layout', e), ...t })
);
vn.displayName = 'AppLayout';
const yn = c.forwardRef(({ gap: e = 'phi-1', className: t, ...n }, o) =>
  u.jsx('div', { ref: o, className: U('content-stack', `gap-${e}`, t), ...n })
);
yn.displayName = 'ContentStack';
ee.__docgenInfo = {
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
mn.__docgenInfo = { description: '', methods: [], displayName: 'ReadingLayout' };
hn.__docgenInfo = { description: '', methods: [], displayName: 'ActionLayout' };
gn.__docgenInfo = { description: '', methods: [], displayName: 'ContentSidebar' };
vn.__docgenInfo = { description: '', methods: [], displayName: 'AppLayout' };
yn.__docgenInfo = {
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
const al = { title: '01 Identity/Layout System', parameters: { layout: 'fullscreen' } },
  We = {
    render: () =>
      u.jsx(ee, {
        variant: 'wide',
        children: u.jsxs('div', {
          className: 'py-phi-3 text-center',
          children: [
            u.jsx('h1', { className: 'heading-hero', children: 'Layout System' }),
            u.jsx('p', {
              className: 'text-body-large max-w-3xl mx-auto',
              children:
                'Spatial relationships that create order without constraint. Our layout system establishes foundations for content organization while preserving creative freedom and responsive adaptability.',
            }),
            u.jsxs('div', {
              className:
                'mt-phi-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-2 max-w-6xl mx-auto',
              children: [
                u.jsxs('div', {
                  className: 'p-phi-2 border border-muted rounded-lg text-left',
                  children: [
                    u.jsx('h3', { className: 'heading-component', children: 'Content First' }),
                    u.jsx('p', {
                      className: 'text-body',
                      children: 'Grid serves content needs, not design convenience',
                    }),
                  ],
                }),
                u.jsxs('div', {
                  className: 'p-phi-2 border border-muted rounded-lg text-left',
                  children: [
                    u.jsx('h3', {
                      className: 'heading-component',
                      children: 'Mathematical Harmony',
                    }),
                    u.jsx('p', {
                      className: 'text-body',
                      children: 'Golden ratio proportions create inherently pleasing relationships',
                    }),
                  ],
                }),
                u.jsxs('div', {
                  className: 'p-phi-2 border border-muted rounded-lg text-left',
                  children: [
                    u.jsx('h3', { className: 'heading-component', children: 'Cognitive Respect' }),
                    u.jsx('p', {
                      className: 'text-body',
                      children: 'Patterns based on eye-tracking research and memory limits',
                    }),
                  ],
                }),
                u.jsxs('div', {
                  className: 'p-phi-2 border border-muted rounded-lg text-left',
                  children: [
                    u.jsx('h3', {
                      className: 'heading-component',
                      children: 'Flexible Foundation',
                    }),
                    u.jsx('p', {
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
  },
  He = {
    render: () =>
      u.jsx(ee, {
        variant: 'golden',
        children: u.jsxs(yn, {
          children: [
            u.jsx('h1', { className: 'heading-display', children: 'Golden Ratio Spacing' }),
            u.jsx('p', {
              className: 'text-body',
              children: 'Typography classes have built-in phi spacing automatically.',
            }),
            u.jsx('h3', {
              className: 'heading-component',
              children: 'Utility Classes (for edge cases)',
            }),
            u.jsxs('div', {
              className: 'grid grid-cols-4 gap-phi-1',
              children: [
                u.jsx('div', { className: 'p-phi--2 bg-muted rounded', children: 'φ⁻² spacing' }),
                u.jsx('div', { className: 'p-phi--1 bg-muted rounded', children: 'φ⁻¹ spacing' }),
                u.jsx('div', { className: 'p-phi-1 bg-muted rounded', children: 'φ¹ spacing' }),
                u.jsx('div', { className: 'p-phi-2 bg-muted rounded', children: 'φ² spacing' }),
              ],
            }),
            u.jsx('p', {
              className: 'text-body-small',
              children: 'Use utilities only when you need to override defaults.',
            }),
          ],
        }),
      }),
  },
  Ve = {
    render: () =>
      u.jsxs('div', {
        className: 'space-y-phi-3',
        children: [
          u.jsx(ee, {
            variant: 'reading',
            children: u.jsxs(mn, {
              children: [
                u.jsx('h2', { className: 'heading-section', children: 'Reading Layout' }),
                u.jsxs('div', {
                  children: [
                    u.jsx('p', {
                      className: 'text-body',
                      children:
                        'Main content flows in scannable pattern optimized for text consumption...',
                    }),
                    u.jsx('p', {
                      className: 'text-body',
                      children: 'Second paragraph continues reading flow with proper spacing...',
                    }),
                  ],
                }),
                u.jsx('aside', {
                  className: 'text-body-small border-l-2 border-border pl-4',
                  children:
                    'Sidebar content for metadata, navigation, or supplementary information',
                }),
              ],
            }),
          }),
          u.jsx(ee, {
            variant: 'golden',
            children: u.jsxs(hn, {
              children: [
                u.jsx('div', { className: 'brand font-semibold', children: 'Logo' }),
                u.jsx('button', {
                  type: 'button',
                  className: 'bg-primary text-primary-foreground px-4 py-2 rounded',
                  children: 'Action',
                }),
                u.jsxs('div', {
                  className: 'hero text-center',
                  children: [
                    u.jsx('h1', { className: 'heading-hero', children: 'Hero Content' }),
                    u.jsx('p', {
                      className: 'text-body-large',
                      children: 'Conversion-focused layout for landing pages',
                    }),
                  ],
                }),
                u.jsx('button', {
                  type: 'button',
                  className: 'bg-secondary text-secondary-foreground px-6 py-3 rounded',
                  children: 'Call to Action',
                }),
              ],
            }),
          }),
        ],
      }),
  },
  Ue = {
    render: () =>
      u.jsx(ee, {
        variant: 'golden',
        children: u.jsxs('div', {
          className: 'space-y-phi-2',
          children: [
            u.jsxs(gn, {
              children: [
                u.jsxs('main', {
                  children: [
                    u.jsx('h2', { className: 'heading-section', children: 'Content (61.8%)' }),
                    u.jsx('p', {
                      className: 'text-body',
                      children:
                        'Primary content area gets the larger portion following golden ratio proportions.',
                    }),
                  ],
                }),
                u.jsxs('aside', {
                  className: 'bg-muted p-phi-1 rounded',
                  children: [
                    u.jsx('h3', { className: 'heading-component', children: 'Sidebar (38.2%)' }),
                    u.jsx('p', {
                      className: 'text-body-small',
                      children: 'Secondary content in complementary proportion.',
                    }),
                  ],
                }),
              ],
            }),
            u.jsxs('div', {
              className: 'hero-golden bg-muted rounded',
              children: [
                u.jsx('h1', { className: 'heading-hero', children: 'Hero Section' }),
                u.jsx('p', {
                  className: 'text-body-large',
                  children: '61.8vh height feels natural and draws attention',
                }),
              ],
            }),
          ],
        }),
      }),
  },
  Ke = {
    render: () =>
      u.jsxs('div', {
        className: 'space-y-phi-3',
        children: [
          u.jsx('h2', { className: 'heading-section px-4', children: 'Dashboard/App Layout' }),
          u.jsxs(vn, {
            children: [
              u.jsx('header', {
                className: 'bg-muted p-phi-1 border-b border-border',
                children: u.jsx('h3', { className: 'heading-component', children: 'App Header' }),
              }),
              u.jsx('nav', {
                className: 'bg-muted/50 p-phi-1 border-r border-border',
                children: u.jsx('p', {
                  className: 'text-body-small',
                  children: 'Navigation sidebar',
                }),
              }),
              u.jsxs('main', {
                className: 'p-phi-2',
                children: [
                  u.jsx('h1', { className: 'heading-display', children: 'Main Content' }),
                  u.jsx('p', {
                    className: 'text-body',
                    children: 'Dashboard content, forms, data views, and application features.',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
  },
  ze = {
    render: () =>
      u.jsxs('div', {
        className: 'space-y-phi-3',
        children: [
          u.jsx(ee, {
            variant: 'reading',
            children: u.jsxs('div', {
              className: 'bg-muted p-phi-1 rounded',
              children: [
                u.jsx('h3', { className: 'heading-component', children: 'Reading Container' }),
                u.jsx('p', {
                  className: 'text-body',
                  children:
                    'Optimized for 45-75 characters per line, perfect for articles and documentation.',
                }),
              ],
            }),
          }),
          u.jsx(ee, {
            variant: 'golden',
            children: u.jsxs('div', {
              className: 'bg-muted p-phi-1 rounded',
              children: [
                u.jsx('h3', { className: 'heading-component', children: 'Golden Container' }),
                u.jsx('p', {
                  className: 'text-body',
                  children: 'Golden ratio width for balanced content and whitespace.',
                }),
              ],
            }),
          }),
          u.jsx(ee, {
            variant: 'wide',
            children: u.jsxs('div', {
              className: 'bg-muted p-phi-1 rounded',
              children: [
                u.jsx('h3', { className: 'heading-component', children: 'Wide Container' }),
                u.jsx('p', {
                  className: 'text-body',
                  children: 'Maximum 7xl width for dashboards and data-heavy interfaces.',
                }),
              ],
            }),
          }),
          u.jsx(ee, {
            variant: 'full',
            children: u.jsxs('div', {
              className: 'bg-muted p-phi-1 rounded',
              children: [
                u.jsx('h3', { className: 'heading-component', children: 'Full Container' }),
                u.jsx('p', {
                  className: 'text-body',
                  children: 'Full width with padding for edge-to-edge layouts.',
                }),
              ],
            }),
          }),
        ],
      }),
  };
var Bn, $n, Wn;
We.parameters = {
  ...We.parameters,
  docs: {
    ...((Bn = We.parameters) == null ? void 0 : Bn.docs),
    source: {
      originalSource: `{
  render: () => <Container variant="wide">
      <div className="py-phi-3 text-center">
        <h1 className="heading-hero">Layout System</h1>
        <p className="text-body-large max-w-3xl mx-auto">
          Spatial relationships that create order without constraint. Our layout system establishes 
          foundations for content organization while preserving creative freedom and responsive adaptability.
        </p>
        
        <div className="mt-phi-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-phi-2 max-w-6xl mx-auto">
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Content First</h3>
            <p className="text-body">Grid serves content needs, not design convenience</p>
          </div>
          <div className="p-phi-2 border border-muted rounded-lg text-left">
            <h3 className="heading-component">Mathematical Harmony</h3>
            <p className="text-body">Golden ratio proportions create inherently pleasing relationships</p>
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
      ...((Wn = ($n = We.parameters) == null ? void 0 : $n.docs) == null ? void 0 : Wn.source),
    },
  },
};
var Hn, Vn, Un;
He.parameters = {
  ...He.parameters,
  docs: {
    ...((Hn = He.parameters) == null ? void 0 : Hn.docs),
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
      ...((Un = (Vn = He.parameters) == null ? void 0 : Vn.docs) == null ? void 0 : Un.source),
    },
  },
};
var Kn, zn, Gn;
Ve.parameters = {
  ...Ve.parameters,
  docs: {
    ...((Kn = Ve.parameters) == null ? void 0 : Kn.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-phi-3">
      <Container variant="reading">
        <ReadingLayout>
          <h2 className="heading-section">Reading Layout</h2>
          <div>
            <p className="text-body">Main content flows in scannable pattern optimized for text consumption...</p>
            <p className="text-body">Second paragraph continues reading flow with proper spacing...</p>
          </div>
          <aside className="text-body-small border-l-2 border-border pl-4">
            Sidebar content for metadata, navigation, or supplementary information
          </aside>
        </ReadingLayout>
      </Container>
      
      <Container variant="golden">
        <ActionLayout>
          <div className="brand font-semibold">Logo</div>
          <button type="button" className="bg-primary text-primary-foreground px-4 py-2 rounded">Action</button>
          <div className="hero text-center">
            <h1 className="heading-hero">Hero Content</h1>
            <p className="text-body-large">Conversion-focused layout for landing pages</p>
          </div>
          <button type="button" className="bg-secondary text-secondary-foreground px-6 py-3 rounded">Call to Action</button>
        </ActionLayout>
      </Container>
    </div>
}`,
      ...((Gn = (zn = Ve.parameters) == null ? void 0 : zn.docs) == null ? void 0 : Gn.source),
    },
  },
};
var Yn, Xn, qn;
Ue.parameters = {
  ...Ue.parameters,
  docs: {
    ...((Yn = Ue.parameters) == null ? void 0 : Yn.docs),
    source: {
      originalSource: `{
  render: () => <Container variant="golden">
      <div className="space-y-phi-2">
        <ContentSidebar>
          <main>
            <h2 className="heading-section">Content (61.8%)</h2>
            <p className="text-body">Primary content area gets the larger portion following golden ratio proportions.</p>
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
      ...((qn = (Xn = Ue.parameters) == null ? void 0 : Xn.docs) == null ? void 0 : qn.source),
    },
  },
};
var Zn, Qn, Jn;
Ke.parameters = {
  ...Ke.parameters,
  docs: {
    ...((Zn = Ke.parameters) == null ? void 0 : Zn.docs),
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
          <p className="text-body">Dashboard content, forms, data views, and application features.</p>
        </main>
      </AppLayout>
    </div>
}`,
      ...((Jn = (Qn = Ke.parameters) == null ? void 0 : Qn.docs) == null ? void 0 : Jn.source),
    },
  },
};
var eo, to, no;
ze.parameters = {
  ...ze.parameters,
  docs: {
    ...((eo = ze.parameters) == null ? void 0 : eo.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-phi-3">
      <Container variant="reading">
        <div className="bg-muted p-phi-1 rounded">
          <h3 className="heading-component">Reading Container</h3>
          <p className="text-body">Optimized for 45-75 characters per line, perfect for articles and documentation.</p>
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
      ...((no = (to = ze.parameters) == null ? void 0 : to.docs) == null ? void 0 : no.source),
    },
  },
};
const cl = [
    'Introduction',
    'GoldenRatioSpacing',
    'LayoutPatterns',
    'GoldenProportions',
    'ApplicationLayout',
    'ContainerVariants',
  ],
  xl = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        ApplicationLayout: Ke,
        ContainerVariants: ze,
        GoldenProportions: Ue,
        GoldenRatioSpacing: He,
        Introduction: We,
        LayoutPatterns: Ve,
        __namedExportsOrder: cl,
        default: al,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  );
export { Ke as A, ze as C, He as G, Ve as L, xl as S, Ue as a };
