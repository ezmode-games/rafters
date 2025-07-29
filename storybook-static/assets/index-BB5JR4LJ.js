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
    const t = l.createContext(n);
    const C = c.length;
    c = [...c, n];
    const p = (i) => {
      let x;
      const { scope: f, children: v, ...I } = i;
      const a = ((x = f == null ? void 0 : f[e]) == null ? void 0 : x[C]) || t;
      const d = l.useMemo(() => I, Object.values(I));
      return h.jsx(a.Provider, { value: d, children: v });
    };
    p.displayName = `${r}Provider`;
    function u(i, f) {
      let a;
      const v = ((a = f == null ? void 0 : f[e]) == null ? void 0 : a[C]) || t;
      const I = l.useContext(v);
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
  const o = `${e}CollectionProvider`;
  const [c, m] = A(o);
  const [s, r] = c(o, { collectionRef: { current: null }, itemMap: new Map() });
  const n = (a) => {
    const { scope: d, children: x } = a;
    const S = P.useRef(null);
    const R = P.useRef(new Map()).current;
    return h.jsx(s, { scope: d, itemMap: R, collectionRef: S, children: x });
  };
  n.displayName = o;
  const t = `${e}CollectionSlot`;
  const C = b(t);
  const p = P.forwardRef((a, d) => {
    const { scope: x, children: S } = a;
    const R = r(t, x);
    const M = E(d, R.collectionRef);
    return h.jsx(C, { ref: M, children: S });
  });
  p.displayName = t;
  const u = `${e}CollectionItemSlot`;
  const i = 'data-radix-collection-item';
  const f = b(u);
  const v = P.forwardRef((a, d) => {
    const { scope: x, children: S, ...R } = a;
    const M = P.useRef(null);
    const w = E(d, M);
    const _ = r(u, x);
    return (
      P.useEffect(() => (_.itemMap.set(M, { ref: M, ...R }), () => void _.itemMap.delete(M))),
      h.jsx(f, { [i]: '', ref: w, children: S })
    );
  });
  v.displayName = u;
  function I(a) {
    const d = r(`${e}CollectionConsumer`, a);
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
const $ = l.createContext(void 0);
function B(e) {
  const o = l.useContext($);
  return e || o || 'ltr';
}
const O = globalThis?.document ? l.useLayoutEffect : () => {};
const j = N[' useInsertionEffect '.trim().toString()] || O;
function F({ prop: e, defaultProp: o, onChange: c = () => {}, caller: m }) {
  const [s, r, n] = D({ defaultProp: o, onChange: c });
  const t = e !== void 0;
  const C = t ? e : s;
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
      let i;
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
  const [c, m] = l.useState(e);
  const s = l.useRef(c);
  const r = l.useRef(o);
  return (
    j(() => {
      r.current = o;
    }, [o]),
    l.useEffect(() => {
      let n;
      s.current !== c && ((n = r.current) == null || n.call(r, c), (s.current = c));
    }, [c, s]),
    [c, m, r]
  );
}
function L(e) {
  return typeof e === 'function';
}
export { q as a, U as b, A as c, B as d, O as e, F as u };
