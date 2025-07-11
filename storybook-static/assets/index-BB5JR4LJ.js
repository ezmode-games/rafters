import { V as N, e as P, r as l } from './iframe-Cy2I62ob.js';
import { u as E, c as b } from './index-DuwuiYca.js';
import { j as h } from './jsx-runtime-BjG_zV1W.js';
function U(e, o, { checkForDefaultPrevented: c = !0 } = {}) {
  return (s) => {
    if ((e == null || e(s), c === !1 || !s.defaultPrevented)) return o == null ? void 0 : o(s);
  };
}
function A(e, o = []) {
  let c = [];
  function m(r, n) {
    const t = l.createContext(n),
      C = c.length;
    c = [...c, n];
    const p = (i) => {
      var x;
      const { scope: f, children: v, ...I } = i,
        a = ((x = f == null ? void 0 : f[e]) == null ? void 0 : x[C]) || t,
        d = l.useMemo(() => I, Object.values(I));
      return h.jsx(a.Provider, { value: d, children: v });
    };
    p.displayName = r + 'Provider';
    function u(i, f) {
      var a;
      const v = ((a = f == null ? void 0 : f[e]) == null ? void 0 : a[C]) || t,
        I = l.useContext(v);
      if (I) return I;
      if (n !== void 0) return n;
      throw new Error(`\`${i}\` must be used within \`${r}\``);
    }
    return [p, u];
  }
  const s = () => {
    const r = c.map((n) => l.createContext(n));
    return (t) => {
      const C = (t == null ? void 0 : t[e]) || r;
      return l.useMemo(() => ({ [`__scope${e}`]: { ...t, [e]: C } }), [t, C]);
    };
  };
  return (s.scopeName = e), [m, T(s, ...o)];
}
function T(...e) {
  const o = e[0];
  if (e.length === 1) return o;
  const c = () => {
    const m = e.map((s) => ({ useScope: s(), scopeName: s.scopeName }));
    return (r) => {
      const n = m.reduce((t, { useScope: C, scopeName: p }) => {
        const i = C(r)[`__scope${p}`];
        return { ...t, ...i };
      }, {});
      return l.useMemo(() => ({ [`__scope${o.scopeName}`]: n }), [n]);
    };
  };
  return (c.scopeName = o.scopeName), c;
}
function q(e) {
  const o = e + 'CollectionProvider',
    [c, m] = A(o),
    [s, r] = c(o, { collectionRef: { current: null }, itemMap: new Map() }),
    n = (a) => {
      const { scope: d, children: x } = a,
        S = P.useRef(null),
        R = P.useRef(new Map()).current;
      return h.jsx(s, { scope: d, itemMap: R, collectionRef: S, children: x });
    };
  n.displayName = o;
  const t = e + 'CollectionSlot',
    C = b(t),
    p = P.forwardRef((a, d) => {
      const { scope: x, children: S } = a,
        R = r(t, x),
        M = E(d, R.collectionRef);
      return h.jsx(C, { ref: M, children: S });
    });
  p.displayName = t;
  const u = e + 'CollectionItemSlot',
    i = 'data-radix-collection-item',
    f = b(u),
    v = P.forwardRef((a, d) => {
      const { scope: x, children: S, ...R } = a,
        M = P.useRef(null),
        w = E(d, M),
        _ = r(u, x);
      return (
        P.useEffect(() => (_.itemMap.set(M, { ref: M, ...R }), () => void _.itemMap.delete(M))),
        h.jsx(f, { [i]: '', ref: w, children: S })
      );
    });
  v.displayName = u;
  function I(a) {
    const d = r(e + 'CollectionConsumer', a);
    return P.useCallback(() => {
      const S = d.collectionRef.current;
      if (!S) return [];
      const R = Array.from(S.querySelectorAll(`[${i}]`));
      return Array.from(d.itemMap.values()).sort(
        (_, y) => R.indexOf(_.ref.current) - R.indexOf(y.ref.current)
      );
    }, [d.collectionRef, d.itemMap]);
  }
  return [{ Provider: n, Slot: p, ItemSlot: v }, I, m];
}
var $ = l.createContext(void 0);
function B(e) {
  const o = l.useContext($);
  return e || o || 'ltr';
}
var O = globalThis != null && globalThis.document ? l.useLayoutEffect : () => {},
  j = N[' useInsertionEffect '.trim().toString()] || O;
function F({ prop: e, defaultProp: o, onChange: c = () => {}, caller: m }) {
  const [s, r, n] = D({ defaultProp: o, onChange: c }),
    t = e !== void 0,
    C = t ? e : s;
  {
    const u = l.useRef(e !== void 0);
    l.useEffect(() => {
      const i = u.current;
      i !== t &&
        console.warn(
          `${m} is changing from ${i ? 'controlled' : 'uncontrolled'} to ${t ? 'controlled' : 'uncontrolled'}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        ),
        (u.current = t);
    }, [t, m]);
  }
  const p = l.useCallback(
    (u) => {
      var i;
      if (t) {
        const f = L(u) ? u(e) : u;
        f !== e && ((i = n.current) == null || i.call(n, f));
      } else r(u);
    },
    [t, e, r, n]
  );
  return [C, p];
}
function D({ defaultProp: e, onChange: o }) {
  const [c, m] = l.useState(e),
    s = l.useRef(c),
    r = l.useRef(o);
  return (
    j(() => {
      r.current = o;
    }, [o]),
    l.useEffect(() => {
      var n;
      s.current !== c && ((n = r.current) == null || n.call(r, c), (s.current = c));
    }, [c, s]),
    [c, m, r]
  );
}
function L(e) {
  return typeof e == 'function';
}
export { q as a, U as b, A as c, B as d, O as e, F as u };
