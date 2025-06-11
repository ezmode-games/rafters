import { r as y } from './iframe-Bh_nZMRn.js';
import { j as te } from './jsx-runtime-BjG_zV1W.js';
function be(e, o) {
  if (typeof e == 'function') return e(o);
  e != null && (e.current = o);
}
function ke(...e) {
  return (o) => {
    let t = !1;
    const r = e.map((n) => {
      const i = be(n, o);
      return !t && typeof i == 'function' && (t = !0), i;
    });
    if (t)
      return () => {
        for (let n = 0; n < r.length; n++) {
          const i = r[n];
          typeof i == 'function' ? i() : be(e[n], null);
        }
      };
  };
}
function Sr(...e) {
  return y.useCallback(ke(...e), e);
}
function Ve(e) {
  const o = Ne(e),
    t = y.forwardRef((r, n) => {
      const { children: i, ...l } = r,
        p = y.Children.toArray(i),
        m = p.find(Oe);
      if (m) {
        const f = m.props.children,
          h = p.map((v) =>
            v === m
              ? y.Children.count(f) > 1
                ? y.Children.only(null)
                : y.isValidElement(f)
                  ? f.props.children
                  : null
              : v
          );
        return te.jsx(o, {
          ...l,
          ref: n,
          children: y.isValidElement(f) ? y.cloneElement(f, void 0, h) : null,
        });
      }
      return te.jsx(o, { ...l, ref: n, children: i });
    });
  return (t.displayName = `${e}.Slot`), t;
}
var je = Ve('Slot');
function Ne(e) {
  const o = y.forwardRef((t, r) => {
    const { children: n, ...i } = t;
    if (y.isValidElement(n)) {
      const l = Be(n),
        p = _e(i, n.props);
      return n.type !== y.Fragment && (p.ref = r ? ke(r, l) : l), y.cloneElement(n, p);
    }
    return y.Children.count(n) > 1 ? y.Children.only(null) : null;
  });
  return (o.displayName = `${e}.SlotClone`), o;
}
var Le = Symbol('radix.slottable');
function Oe(e) {
  return (
    y.isValidElement(e) &&
    typeof e.type == 'function' &&
    '__radixId' in e.type &&
    e.type.__radixId === Le
  );
}
function _e(e, o) {
  const t = { ...o };
  for (const r in o) {
    const n = e[r],
      i = o[r];
    /^on[A-Z]/.test(r)
      ? n && i
        ? (t[r] = (...p) => {
            const m = i(...p);
            return n(...p), m;
          })
        : n && (t[r] = n)
      : r === 'style'
        ? (t[r] = { ...n, ...i })
        : r === 'className' && (t[r] = [n, i].filter(Boolean).join(' '));
  }
  return { ...e, ...t };
}
function Be(e) {
  var r, n;
  let o = (r = Object.getOwnPropertyDescriptor(e.props, 'ref')) == null ? void 0 : r.get,
    t = o && 'isReactWarning' in o && o.isReactWarning;
  return t
    ? e.ref
    : ((o = (n = Object.getOwnPropertyDescriptor(e, 'ref')) == null ? void 0 : n.get),
      (t = o && 'isReactWarning' in o && o.isReactWarning),
      t ? e.props.ref : e.props.ref || e.ref);
}
function ve(e) {
  var o,
    t,
    r = '';
  if (typeof e == 'string' || typeof e == 'number') r += e;
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var n = e.length;
      for (o = 0; o < n; o++) e[o] && (t = ve(e[o])) && (r && (r += ' '), (r += t));
    } else for (t in e) e[t] && (r && (r += ' '), (r += t));
  return r;
}
function Fe() {
  for (var e, o, t = 0, r = '', n = arguments.length; t < n; t++)
    (e = arguments[t]) && (o = ve(e)) && (r && (r += ' '), (r += o));
  return r;
}
const ie = '-',
  We = (e) => {
    const o = Ue(e),
      { conflictingClassGroups: t, conflictingClassGroupModifiers: r } = e;
    return {
      getClassGroupId: (l) => {
        const p = l.split(ie);
        return p[0] === '' && p.length !== 1 && p.shift(), ze(p, o) || $e(l);
      },
      getConflictingClassGroupIds: (l, p) => {
        const m = t[l] || [];
        return p && r[l] ? [...m, ...r[l]] : m;
      },
    };
  },
  ze = (e, o) => {
    var l;
    if (e.length === 0) return o.classGroupId;
    const t = e[0],
      r = o.nextPart.get(t),
      n = r ? ze(e.slice(1), r) : void 0;
    if (n) return n;
    if (o.validators.length === 0) return;
    const i = e.join(ie);
    return (l = o.validators.find(({ validator: p }) => p(i))) == null ? void 0 : l.classGroupId;
  },
  he = /^\[(.+)\]$/,
  $e = (e) => {
    if (he.test(e)) {
      const o = he.exec(e)[1],
        t = o == null ? void 0 : o.substring(0, o.indexOf(':'));
      if (t) return 'arbitrary..' + t;
    }
  },
  Ue = (e) => {
    const { theme: o, classGroups: t } = e,
      r = { nextPart: new Map(), validators: [] };
    for (const n in t) ne(t[n], r, n, o);
    return r;
  },
  ne = (e, o, t, r) => {
    e.forEach((n) => {
      if (typeof n == 'string') {
        const i = n === '' ? o : ye(o, n);
        i.classGroupId = t;
        return;
      }
      if (typeof n == 'function') {
        if (qe(n)) {
          ne(n(r), o, t, r);
          return;
        }
        o.validators.push({ validator: n, classGroupId: t });
        return;
      }
      Object.entries(n).forEach(([i, l]) => {
        ne(l, ye(o, i), t, r);
      });
    });
  },
  ye = (e, o) => {
    let t = e;
    return (
      o.split(ie).forEach((r) => {
        t.nextPart.has(r) || t.nextPart.set(r, { nextPart: new Map(), validators: [] }),
          (t = t.nextPart.get(r));
      }),
      t
    );
  },
  qe = (e) => e.isThemeGetter,
  De = (e) => {
    if (e < 1) return { get: () => {}, set: () => {} };
    let o = 0,
      t = new Map(),
      r = new Map();
    const n = (i, l) => {
      t.set(i, l), o++, o > e && ((o = 0), (r = t), (t = new Map()));
    };
    return {
      get(i) {
        let l = t.get(i);
        if (l !== void 0) return l;
        if ((l = r.get(i)) !== void 0) return n(i, l), l;
      },
      set(i, l) {
        t.has(i) ? t.set(i, l) : n(i, l);
      },
    };
  },
  se = '!',
  ae = ':',
  He = ae.length,
  Je = (e) => {
    const { prefix: o, experimentalParseClassName: t } = e;
    let r = (n) => {
      const i = [];
      let l = 0,
        p = 0,
        m = 0,
        f;
      for (let k = 0; k < n.length; k++) {
        const z = n[k];
        if (l === 0 && p === 0) {
          if (z === ae) {
            i.push(n.slice(m, k)), (m = k + He);
            continue;
          }
          if (z === '/') {
            f = k;
            continue;
          }
        }
        z === '[' ? l++ : z === ']' ? l-- : z === '(' ? p++ : z === ')' && p--;
      }
      const h = i.length === 0 ? n : n.substring(m),
        v = Xe(h),
        _ = v !== h,
        B = f && f > m ? f - m : void 0;
      return {
        modifiers: i,
        hasImportantModifier: _,
        baseClassName: v,
        maybePostfixModifierPosition: B,
      };
    };
    if (o) {
      const n = o + ae,
        i = r;
      r = (l) =>
        l.startsWith(n)
          ? i(l.substring(n.length))
          : {
              isExternal: !0,
              modifiers: [],
              hasImportantModifier: !1,
              baseClassName: l,
              maybePostfixModifierPosition: void 0,
            };
    }
    if (t) {
      const n = r;
      r = (i) => t({ className: i, parseClassName: n });
    }
    return r;
  },
  Xe = (e) =>
    e.endsWith(se) ? e.substring(0, e.length - 1) : e.startsWith(se) ? e.substring(1) : e,
  Ze = (e) => {
    const o = Object.fromEntries(e.orderSensitiveModifiers.map((r) => [r, !0]));
    return (r) => {
      if (r.length <= 1) return r;
      const n = [];
      let i = [];
      return (
        r.forEach((l) => {
          l[0] === '[' || o[l] ? (n.push(...i.sort(), l), (i = [])) : i.push(l);
        }),
        n.push(...i.sort()),
        n
      );
    };
  },
  Ke = (e) => ({ cache: De(e.cacheSize), parseClassName: Je(e), sortModifiers: Ze(e), ...We(e) }),
  Qe = /\s+/,
  Ye = (e, o) => {
    const {
        parseClassName: t,
        getClassGroupId: r,
        getConflictingClassGroupIds: n,
        sortModifiers: i,
      } = o,
      l = [],
      p = e.trim().split(Qe);
    let m = '';
    for (let f = p.length - 1; f >= 0; f -= 1) {
      const h = p[f],
        {
          isExternal: v,
          modifiers: _,
          hasImportantModifier: B,
          baseClassName: k,
          maybePostfixModifierPosition: z,
        } = t(h);
      if (v) {
        m = h + (m.length > 0 ? ' ' + m : m);
        continue;
      }
      let G = !!z,
        M = r(G ? k.substring(0, z) : k);
      if (!M) {
        if (!G) {
          m = h + (m.length > 0 ? ' ' + m : m);
          continue;
        }
        if (((M = r(k)), !M)) {
          m = h + (m.length > 0 ? ' ' + m : m);
          continue;
        }
        G = !1;
      }
      const U = i(_).join(':'),
        F = B ? U + se : U,
        T = F + M;
      if (l.includes(T)) continue;
      l.push(T);
      const V = n(M, G);
      for (let I = 0; I < V.length; ++I) {
        const W = V[I];
        l.push(F + W);
      }
      m = h + (m.length > 0 ? ' ' + m : m);
    }
    return m;
  };
function er() {
  let e = 0,
    o,
    t,
    r = '';
  while (e < arguments.length) (o = arguments[e++]) && (t = Ce(o)) && (r && (r += ' '), (r += t));
  return r;
}
const Ce = (e) => {
  if (typeof e == 'string') return e;
  let o,
    t = '';
  for (let r = 0; r < e.length; r++) e[r] && (o = Ce(e[r])) && (t && (t += ' '), (t += o));
  return t;
};
function rr(e, ...o) {
  let t,
    r,
    n,
    i = l;
  function l(m) {
    const f = o.reduce((h, v) => v(h), e());
    return (t = Ke(f)), (r = t.cache.get), (n = t.cache.set), (i = p), p(m);
  }
  function p(m) {
    const f = r(m);
    if (f) return f;
    const h = Ye(m, t);
    return n(m, h), h;
  }
  return () => i(er.apply(null, arguments));
}
const g = (e) => {
    const o = (t) => t[e] || [];
    return (o.isThemeGetter = !0), o;
  },
  Se = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  Ae = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  or = /^\d+\/\d+$/,
  tr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  nr =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  sr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,
  ar = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  ir =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  N = (e) => or.test(e),
  u = (e) => !!e && !Number.isNaN(Number(e)),
  R = (e) => !!e && Number.isInteger(Number(e)),
  re = (e) => e.endsWith('%') && u(e.slice(0, -1)),
  A = (e) => tr.test(e),
  lr = () => !0,
  cr = (e) => nr.test(e) && !sr.test(e),
  Re = () => !1,
  dr = (e) => ar.test(e),
  mr = (e) => ir.test(e),
  ur = (e) => !s(e) && !a(e),
  pr = (e) => L(e, Pe, Re),
  s = (e) => Se.test(e),
  E = (e) => L(e, Ee, cr),
  oe = (e) => L(e, yr, u),
  xe = (e) => L(e, Me, Re),
  fr = (e) => L(e, Ie, mr),
  Z = (e) => L(e, Ge, dr),
  a = (e) => Ae.test(e),
  $ = (e) => O(e, Ee),
  gr = (e) => O(e, xr),
  we = (e) => O(e, Me),
  br = (e) => O(e, Pe),
  hr = (e) => O(e, Ie),
  K = (e) => O(e, Ge, !0),
  L = (e, o, t) => {
    const r = Se.exec(e);
    return r ? (r[1] ? o(r[1]) : t(r[2])) : !1;
  },
  O = (e, o, t = !1) => {
    const r = Ae.exec(e);
    return r ? (r[1] ? o(r[1]) : t) : !1;
  },
  Me = (e) => e === 'position' || e === 'percentage',
  Ie = (e) => e === 'image' || e === 'url',
  Pe = (e) => e === 'length' || e === 'size' || e === 'bg-size',
  Ee = (e) => e === 'length',
  yr = (e) => e === 'number',
  xr = (e) => e === 'family-name',
  Ge = (e) => e === 'shadow',
  wr = () => {
    const e = g('color'),
      o = g('font'),
      t = g('text'),
      r = g('font-weight'),
      n = g('tracking'),
      i = g('leading'),
      l = g('breakpoint'),
      p = g('container'),
      m = g('spacing'),
      f = g('radius'),
      h = g('shadow'),
      v = g('inset-shadow'),
      _ = g('text-shadow'),
      B = g('drop-shadow'),
      k = g('blur'),
      z = g('perspective'),
      G = g('aspect'),
      M = g('ease'),
      U = g('animate'),
      F = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
      T = () => [
        'center',
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'left-top',
        'top-right',
        'right-top',
        'bottom-right',
        'right-bottom',
        'bottom-left',
        'left-bottom',
      ],
      V = () => [...T(), a, s],
      I = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
      W = () => ['auto', 'contain', 'none'],
      d = () => [a, s, m],
      C = () => [N, 'full', 'auto', ...d()],
      le = () => [R, 'none', 'subgrid', a, s],
      ce = () => ['auto', { span: ['full', R, a, s] }, R, a, s],
      q = () => [R, 'auto', a, s],
      de = () => ['auto', 'min', 'max', 'fr', a, s],
      Q = () => [
        'start',
        'end',
        'center',
        'between',
        'around',
        'evenly',
        'stretch',
        'baseline',
        'center-safe',
        'end-safe',
      ],
      j = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'],
      S = () => ['auto', ...d()],
      P = () => [
        N,
        'auto',
        'full',
        'dvw',
        'dvh',
        'lvw',
        'lvh',
        'svw',
        'svh',
        'min',
        'max',
        'fit',
        ...d(),
      ],
      c = () => [e, a, s],
      me = () => [...T(), we, xe, { position: [a, s] }],
      ue = () => ['no-repeat', { repeat: ['', 'x', 'y', 'space', 'round'] }],
      pe = () => ['auto', 'cover', 'contain', br, pr, { size: [a, s] }],
      Y = () => [re, $, E],
      x = () => ['', 'none', 'full', f, a, s],
      w = () => ['', u, $, E],
      D = () => ['solid', 'dashed', 'dotted', 'double'],
      fe = () => [
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
        'hard-light',
        'soft-light',
        'difference',
        'exclusion',
        'hue',
        'saturation',
        'color',
        'luminosity',
      ],
      b = () => [u, re, we, xe],
      ge = () => ['', 'none', k, a, s],
      H = () => ['none', u, a, s],
      J = () => ['none', u, a, s],
      ee = () => [u, a, s],
      X = () => [N, 'full', ...d()];
    return {
      cacheSize: 500,
      theme: {
        animate: ['spin', 'ping', 'pulse', 'bounce'],
        aspect: ['video'],
        blur: [A],
        breakpoint: [A],
        color: [lr],
        container: [A],
        'drop-shadow': [A],
        ease: ['in', 'out', 'in-out'],
        font: [ur],
        'font-weight': [
          'thin',
          'extralight',
          'light',
          'normal',
          'medium',
          'semibold',
          'bold',
          'extrabold',
          'black',
        ],
        'inset-shadow': [A],
        leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
        perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
        radius: [A],
        shadow: [A],
        spacing: ['px', u],
        text: [A],
        'text-shadow': [A],
        tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
      },
      classGroups: {
        aspect: [{ aspect: ['auto', 'square', N, s, a, G] }],
        container: ['container'],
        columns: [{ columns: [u, s, a, p] }],
        'break-after': [{ 'break-after': F() }],
        'break-before': [{ 'break-before': F() }],
        'break-inside': [{ 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] }],
        'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
        box: [{ box: ['border', 'content'] }],
        display: [
          'block',
          'inline-block',
          'inline',
          'flex',
          'inline-flex',
          'table',
          'inline-table',
          'table-caption',
          'table-cell',
          'table-column',
          'table-column-group',
          'table-footer-group',
          'table-header-group',
          'table-row-group',
          'table-row',
          'flow-root',
          'grid',
          'inline-grid',
          'contents',
          'list-item',
          'hidden',
        ],
        sr: ['sr-only', 'not-sr-only'],
        float: [{ float: ['right', 'left', 'none', 'start', 'end'] }],
        clear: [{ clear: ['left', 'right', 'both', 'none', 'start', 'end'] }],
        isolation: ['isolate', 'isolation-auto'],
        'object-fit': [{ object: ['contain', 'cover', 'fill', 'none', 'scale-down'] }],
        'object-position': [{ object: V() }],
        overflow: [{ overflow: I() }],
        'overflow-x': [{ 'overflow-x': I() }],
        'overflow-y': [{ 'overflow-y': I() }],
        overscroll: [{ overscroll: W() }],
        'overscroll-x': [{ 'overscroll-x': W() }],
        'overscroll-y': [{ 'overscroll-y': W() }],
        position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
        inset: [{ inset: C() }],
        'inset-x': [{ 'inset-x': C() }],
        'inset-y': [{ 'inset-y': C() }],
        start: [{ start: C() }],
        end: [{ end: C() }],
        top: [{ top: C() }],
        right: [{ right: C() }],
        bottom: [{ bottom: C() }],
        left: [{ left: C() }],
        visibility: ['visible', 'invisible', 'collapse'],
        z: [{ z: [R, 'auto', a, s] }],
        basis: [{ basis: [N, 'full', 'auto', p, ...d()] }],
        'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
        'flex-wrap': [{ flex: ['nowrap', 'wrap', 'wrap-reverse'] }],
        flex: [{ flex: [u, N, 'auto', 'initial', 'none', s] }],
        grow: [{ grow: ['', u, a, s] }],
        shrink: [{ shrink: ['', u, a, s] }],
        order: [{ order: [R, 'first', 'last', 'none', a, s] }],
        'grid-cols': [{ 'grid-cols': le() }],
        'col-start-end': [{ col: ce() }],
        'col-start': [{ 'col-start': q() }],
        'col-end': [{ 'col-end': q() }],
        'grid-rows': [{ 'grid-rows': le() }],
        'row-start-end': [{ row: ce() }],
        'row-start': [{ 'row-start': q() }],
        'row-end': [{ 'row-end': q() }],
        'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
        'auto-cols': [{ 'auto-cols': de() }],
        'auto-rows': [{ 'auto-rows': de() }],
        gap: [{ gap: d() }],
        'gap-x': [{ 'gap-x': d() }],
        'gap-y': [{ 'gap-y': d() }],
        'justify-content': [{ justify: [...Q(), 'normal'] }],
        'justify-items': [{ 'justify-items': [...j(), 'normal'] }],
        'justify-self': [{ 'justify-self': ['auto', ...j()] }],
        'align-content': [{ content: ['normal', ...Q()] }],
        'align-items': [{ items: [...j(), { baseline: ['', 'last'] }] }],
        'align-self': [{ self: ['auto', ...j(), { baseline: ['', 'last'] }] }],
        'place-content': [{ 'place-content': Q() }],
        'place-items': [{ 'place-items': [...j(), 'baseline'] }],
        'place-self': [{ 'place-self': ['auto', ...j()] }],
        p: [{ p: d() }],
        px: [{ px: d() }],
        py: [{ py: d() }],
        ps: [{ ps: d() }],
        pe: [{ pe: d() }],
        pt: [{ pt: d() }],
        pr: [{ pr: d() }],
        pb: [{ pb: d() }],
        pl: [{ pl: d() }],
        m: [{ m: S() }],
        mx: [{ mx: S() }],
        my: [{ my: S() }],
        ms: [{ ms: S() }],
        me: [{ me: S() }],
        mt: [{ mt: S() }],
        mr: [{ mr: S() }],
        mb: [{ mb: S() }],
        ml: [{ ml: S() }],
        'space-x': [{ 'space-x': d() }],
        'space-x-reverse': ['space-x-reverse'],
        'space-y': [{ 'space-y': d() }],
        'space-y-reverse': ['space-y-reverse'],
        size: [{ size: P() }],
        w: [{ w: [p, 'screen', ...P()] }],
        'min-w': [{ 'min-w': [p, 'screen', 'none', ...P()] }],
        'max-w': [{ 'max-w': [p, 'screen', 'none', 'prose', { screen: [l] }, ...P()] }],
        h: [{ h: ['screen', 'lh', ...P()] }],
        'min-h': [{ 'min-h': ['screen', 'lh', 'none', ...P()] }],
        'max-h': [{ 'max-h': ['screen', 'lh', ...P()] }],
        'font-size': [{ text: ['base', t, $, E] }],
        'font-smoothing': ['antialiased', 'subpixel-antialiased'],
        'font-style': ['italic', 'not-italic'],
        'font-weight': [{ font: [r, a, oe] }],
        'font-stretch': [
          {
            'font-stretch': [
              'ultra-condensed',
              'extra-condensed',
              'condensed',
              'semi-condensed',
              'normal',
              'semi-expanded',
              'expanded',
              'extra-expanded',
              'ultra-expanded',
              re,
              s,
            ],
          },
        ],
        'font-family': [{ font: [gr, s, o] }],
        'fvn-normal': ['normal-nums'],
        'fvn-ordinal': ['ordinal'],
        'fvn-slashed-zero': ['slashed-zero'],
        'fvn-figure': ['lining-nums', 'oldstyle-nums'],
        'fvn-spacing': ['proportional-nums', 'tabular-nums'],
        'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
        tracking: [{ tracking: [n, a, s] }],
        'line-clamp': [{ 'line-clamp': [u, 'none', a, oe] }],
        leading: [{ leading: [i, ...d()] }],
        'list-image': [{ 'list-image': ['none', a, s] }],
        'list-style-position': [{ list: ['inside', 'outside'] }],
        'list-style-type': [{ list: ['disc', 'decimal', 'none', a, s] }],
        'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
        'placeholder-color': [{ placeholder: c() }],
        'text-color': [{ text: c() }],
        'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
        'text-decoration-style': [{ decoration: [...D(), 'wavy'] }],
        'text-decoration-thickness': [{ decoration: [u, 'from-font', 'auto', a, E] }],
        'text-decoration-color': [{ decoration: c() }],
        'underline-offset': [{ 'underline-offset': [u, 'auto', a, s] }],
        'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
        'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
        'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
        indent: [{ indent: d() }],
        'vertical-align': [
          {
            align: [
              'baseline',
              'top',
              'middle',
              'bottom',
              'text-top',
              'text-bottom',
              'sub',
              'super',
              a,
              s,
            ],
          },
        ],
        whitespace: [
          { whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] },
        ],
        break: [{ break: ['normal', 'words', 'all', 'keep'] }],
        wrap: [{ wrap: ['break-word', 'anywhere', 'normal'] }],
        hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
        content: [{ content: ['none', a, s] }],
        'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
        'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
        'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
        'bg-position': [{ bg: me() }],
        'bg-repeat': [{ bg: ue() }],
        'bg-size': [{ bg: pe() }],
        'bg-image': [
          {
            bg: [
              'none',
              {
                linear: [{ to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] }, R, a, s],
                radial: ['', a, s],
                conic: [R, a, s],
              },
              hr,
              fr,
            ],
          },
        ],
        'bg-color': [{ bg: c() }],
        'gradient-from-pos': [{ from: Y() }],
        'gradient-via-pos': [{ via: Y() }],
        'gradient-to-pos': [{ to: Y() }],
        'gradient-from': [{ from: c() }],
        'gradient-via': [{ via: c() }],
        'gradient-to': [{ to: c() }],
        rounded: [{ rounded: x() }],
        'rounded-s': [{ 'rounded-s': x() }],
        'rounded-e': [{ 'rounded-e': x() }],
        'rounded-t': [{ 'rounded-t': x() }],
        'rounded-r': [{ 'rounded-r': x() }],
        'rounded-b': [{ 'rounded-b': x() }],
        'rounded-l': [{ 'rounded-l': x() }],
        'rounded-ss': [{ 'rounded-ss': x() }],
        'rounded-se': [{ 'rounded-se': x() }],
        'rounded-ee': [{ 'rounded-ee': x() }],
        'rounded-es': [{ 'rounded-es': x() }],
        'rounded-tl': [{ 'rounded-tl': x() }],
        'rounded-tr': [{ 'rounded-tr': x() }],
        'rounded-br': [{ 'rounded-br': x() }],
        'rounded-bl': [{ 'rounded-bl': x() }],
        'border-w': [{ border: w() }],
        'border-w-x': [{ 'border-x': w() }],
        'border-w-y': [{ 'border-y': w() }],
        'border-w-s': [{ 'border-s': w() }],
        'border-w-e': [{ 'border-e': w() }],
        'border-w-t': [{ 'border-t': w() }],
        'border-w-r': [{ 'border-r': w() }],
        'border-w-b': [{ 'border-b': w() }],
        'border-w-l': [{ 'border-l': w() }],
        'divide-x': [{ 'divide-x': w() }],
        'divide-x-reverse': ['divide-x-reverse'],
        'divide-y': [{ 'divide-y': w() }],
        'divide-y-reverse': ['divide-y-reverse'],
        'border-style': [{ border: [...D(), 'hidden', 'none'] }],
        'divide-style': [{ divide: [...D(), 'hidden', 'none'] }],
        'border-color': [{ border: c() }],
        'border-color-x': [{ 'border-x': c() }],
        'border-color-y': [{ 'border-y': c() }],
        'border-color-s': [{ 'border-s': c() }],
        'border-color-e': [{ 'border-e': c() }],
        'border-color-t': [{ 'border-t': c() }],
        'border-color-r': [{ 'border-r': c() }],
        'border-color-b': [{ 'border-b': c() }],
        'border-color-l': [{ 'border-l': c() }],
        'divide-color': [{ divide: c() }],
        'outline-style': [{ outline: [...D(), 'none', 'hidden'] }],
        'outline-offset': [{ 'outline-offset': [u, a, s] }],
        'outline-w': [{ outline: ['', u, $, E] }],
        'outline-color': [{ outline: c() }],
        shadow: [{ shadow: ['', 'none', h, K, Z] }],
        'shadow-color': [{ shadow: c() }],
        'inset-shadow': [{ 'inset-shadow': ['none', v, K, Z] }],
        'inset-shadow-color': [{ 'inset-shadow': c() }],
        'ring-w': [{ ring: w() }],
        'ring-w-inset': ['ring-inset'],
        'ring-color': [{ ring: c() }],
        'ring-offset-w': [{ 'ring-offset': [u, E] }],
        'ring-offset-color': [{ 'ring-offset': c() }],
        'inset-ring-w': [{ 'inset-ring': w() }],
        'inset-ring-color': [{ 'inset-ring': c() }],
        'text-shadow': [{ 'text-shadow': ['none', _, K, Z] }],
        'text-shadow-color': [{ 'text-shadow': c() }],
        opacity: [{ opacity: [u, a, s] }],
        'mix-blend': [{ 'mix-blend': [...fe(), 'plus-darker', 'plus-lighter'] }],
        'bg-blend': [{ 'bg-blend': fe() }],
        'mask-clip': [
          { 'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
          'mask-no-clip',
        ],
        'mask-composite': [{ mask: ['add', 'subtract', 'intersect', 'exclude'] }],
        'mask-image-linear-pos': [{ 'mask-linear': [u] }],
        'mask-image-linear-from-pos': [{ 'mask-linear-from': b() }],
        'mask-image-linear-to-pos': [{ 'mask-linear-to': b() }],
        'mask-image-linear-from-color': [{ 'mask-linear-from': c() }],
        'mask-image-linear-to-color': [{ 'mask-linear-to': c() }],
        'mask-image-t-from-pos': [{ 'mask-t-from': b() }],
        'mask-image-t-to-pos': [{ 'mask-t-to': b() }],
        'mask-image-t-from-color': [{ 'mask-t-from': c() }],
        'mask-image-t-to-color': [{ 'mask-t-to': c() }],
        'mask-image-r-from-pos': [{ 'mask-r-from': b() }],
        'mask-image-r-to-pos': [{ 'mask-r-to': b() }],
        'mask-image-r-from-color': [{ 'mask-r-from': c() }],
        'mask-image-r-to-color': [{ 'mask-r-to': c() }],
        'mask-image-b-from-pos': [{ 'mask-b-from': b() }],
        'mask-image-b-to-pos': [{ 'mask-b-to': b() }],
        'mask-image-b-from-color': [{ 'mask-b-from': c() }],
        'mask-image-b-to-color': [{ 'mask-b-to': c() }],
        'mask-image-l-from-pos': [{ 'mask-l-from': b() }],
        'mask-image-l-to-pos': [{ 'mask-l-to': b() }],
        'mask-image-l-from-color': [{ 'mask-l-from': c() }],
        'mask-image-l-to-color': [{ 'mask-l-to': c() }],
        'mask-image-x-from-pos': [{ 'mask-x-from': b() }],
        'mask-image-x-to-pos': [{ 'mask-x-to': b() }],
        'mask-image-x-from-color': [{ 'mask-x-from': c() }],
        'mask-image-x-to-color': [{ 'mask-x-to': c() }],
        'mask-image-y-from-pos': [{ 'mask-y-from': b() }],
        'mask-image-y-to-pos': [{ 'mask-y-to': b() }],
        'mask-image-y-from-color': [{ 'mask-y-from': c() }],
        'mask-image-y-to-color': [{ 'mask-y-to': c() }],
        'mask-image-radial': [{ 'mask-radial': [a, s] }],
        'mask-image-radial-from-pos': [{ 'mask-radial-from': b() }],
        'mask-image-radial-to-pos': [{ 'mask-radial-to': b() }],
        'mask-image-radial-from-color': [{ 'mask-radial-from': c() }],
        'mask-image-radial-to-color': [{ 'mask-radial-to': c() }],
        'mask-image-radial-shape': [{ 'mask-radial': ['circle', 'ellipse'] }],
        'mask-image-radial-size': [
          { 'mask-radial': [{ closest: ['side', 'corner'], farthest: ['side', 'corner'] }] },
        ],
        'mask-image-radial-pos': [{ 'mask-radial-at': T() }],
        'mask-image-conic-pos': [{ 'mask-conic': [u] }],
        'mask-image-conic-from-pos': [{ 'mask-conic-from': b() }],
        'mask-image-conic-to-pos': [{ 'mask-conic-to': b() }],
        'mask-image-conic-from-color': [{ 'mask-conic-from': c() }],
        'mask-image-conic-to-color': [{ 'mask-conic-to': c() }],
        'mask-mode': [{ mask: ['alpha', 'luminance', 'match'] }],
        'mask-origin': [
          { 'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
        ],
        'mask-position': [{ mask: me() }],
        'mask-repeat': [{ mask: ue() }],
        'mask-size': [{ mask: pe() }],
        'mask-type': [{ 'mask-type': ['alpha', 'luminance'] }],
        'mask-image': [{ mask: ['none', a, s] }],
        filter: [{ filter: ['', 'none', a, s] }],
        blur: [{ blur: ge() }],
        brightness: [{ brightness: [u, a, s] }],
        contrast: [{ contrast: [u, a, s] }],
        'drop-shadow': [{ 'drop-shadow': ['', 'none', B, K, Z] }],
        'drop-shadow-color': [{ 'drop-shadow': c() }],
        grayscale: [{ grayscale: ['', u, a, s] }],
        'hue-rotate': [{ 'hue-rotate': [u, a, s] }],
        invert: [{ invert: ['', u, a, s] }],
        saturate: [{ saturate: [u, a, s] }],
        sepia: [{ sepia: ['', u, a, s] }],
        'backdrop-filter': [{ 'backdrop-filter': ['', 'none', a, s] }],
        'backdrop-blur': [{ 'backdrop-blur': ge() }],
        'backdrop-brightness': [{ 'backdrop-brightness': [u, a, s] }],
        'backdrop-contrast': [{ 'backdrop-contrast': [u, a, s] }],
        'backdrop-grayscale': [{ 'backdrop-grayscale': ['', u, a, s] }],
        'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [u, a, s] }],
        'backdrop-invert': [{ 'backdrop-invert': ['', u, a, s] }],
        'backdrop-opacity': [{ 'backdrop-opacity': [u, a, s] }],
        'backdrop-saturate': [{ 'backdrop-saturate': [u, a, s] }],
        'backdrop-sepia': [{ 'backdrop-sepia': ['', u, a, s] }],
        'border-collapse': [{ border: ['collapse', 'separate'] }],
        'border-spacing': [{ 'border-spacing': d() }],
        'border-spacing-x': [{ 'border-spacing-x': d() }],
        'border-spacing-y': [{ 'border-spacing-y': d() }],
        'table-layout': [{ table: ['auto', 'fixed'] }],
        caption: [{ caption: ['top', 'bottom'] }],
        transition: [
          { transition: ['', 'all', 'colors', 'opacity', 'shadow', 'transform', 'none', a, s] },
        ],
        'transition-behavior': [{ transition: ['normal', 'discrete'] }],
        duration: [{ duration: [u, 'initial', a, s] }],
        ease: [{ ease: ['linear', 'initial', M, a, s] }],
        delay: [{ delay: [u, a, s] }],
        animate: [{ animate: ['none', U, a, s] }],
        backface: [{ backface: ['hidden', 'visible'] }],
        perspective: [{ perspective: [z, a, s] }],
        'perspective-origin': [{ 'perspective-origin': V() }],
        rotate: [{ rotate: H() }],
        'rotate-x': [{ 'rotate-x': H() }],
        'rotate-y': [{ 'rotate-y': H() }],
        'rotate-z': [{ 'rotate-z': H() }],
        scale: [{ scale: J() }],
        'scale-x': [{ 'scale-x': J() }],
        'scale-y': [{ 'scale-y': J() }],
        'scale-z': [{ 'scale-z': J() }],
        'scale-3d': ['scale-3d'],
        skew: [{ skew: ee() }],
        'skew-x': [{ 'skew-x': ee() }],
        'skew-y': [{ 'skew-y': ee() }],
        transform: [{ transform: [a, s, '', 'none', 'gpu', 'cpu'] }],
        'transform-origin': [{ origin: V() }],
        'transform-style': [{ transform: ['3d', 'flat'] }],
        translate: [{ translate: X() }],
        'translate-x': [{ 'translate-x': X() }],
        'translate-y': [{ 'translate-y': X() }],
        'translate-z': [{ 'translate-z': X() }],
        'translate-none': ['translate-none'],
        accent: [{ accent: c() }],
        appearance: [{ appearance: ['none', 'auto'] }],
        'caret-color': [{ caret: c() }],
        'color-scheme': [
          { scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light'] },
        ],
        cursor: [
          {
            cursor: [
              'auto',
              'default',
              'pointer',
              'wait',
              'text',
              'move',
              'help',
              'not-allowed',
              'none',
              'context-menu',
              'progress',
              'cell',
              'crosshair',
              'vertical-text',
              'alias',
              'copy',
              'no-drop',
              'grab',
              'grabbing',
              'all-scroll',
              'col-resize',
              'row-resize',
              'n-resize',
              'e-resize',
              's-resize',
              'w-resize',
              'ne-resize',
              'nw-resize',
              'se-resize',
              'sw-resize',
              'ew-resize',
              'ns-resize',
              'nesw-resize',
              'nwse-resize',
              'zoom-in',
              'zoom-out',
              a,
              s,
            ],
          },
        ],
        'field-sizing': [{ 'field-sizing': ['fixed', 'content'] }],
        'pointer-events': [{ 'pointer-events': ['auto', 'none'] }],
        resize: [{ resize: ['none', '', 'y', 'x'] }],
        'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
        'scroll-m': [{ 'scroll-m': d() }],
        'scroll-mx': [{ 'scroll-mx': d() }],
        'scroll-my': [{ 'scroll-my': d() }],
        'scroll-ms': [{ 'scroll-ms': d() }],
        'scroll-me': [{ 'scroll-me': d() }],
        'scroll-mt': [{ 'scroll-mt': d() }],
        'scroll-mr': [{ 'scroll-mr': d() }],
        'scroll-mb': [{ 'scroll-mb': d() }],
        'scroll-ml': [{ 'scroll-ml': d() }],
        'scroll-p': [{ 'scroll-p': d() }],
        'scroll-px': [{ 'scroll-px': d() }],
        'scroll-py': [{ 'scroll-py': d() }],
        'scroll-ps': [{ 'scroll-ps': d() }],
        'scroll-pe': [{ 'scroll-pe': d() }],
        'scroll-pt': [{ 'scroll-pt': d() }],
        'scroll-pr': [{ 'scroll-pr': d() }],
        'scroll-pb': [{ 'scroll-pb': d() }],
        'scroll-pl': [{ 'scroll-pl': d() }],
        'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
        'snap-stop': [{ snap: ['normal', 'always'] }],
        'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
        'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
        touch: [{ touch: ['auto', 'none', 'manipulation'] }],
        'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
        'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
        'touch-pz': ['touch-pinch-zoom'],
        select: [{ select: ['none', 'text', 'all', 'auto'] }],
        'will-change': [{ 'will-change': ['auto', 'scroll', 'contents', 'transform', a, s] }],
        fill: [{ fill: ['none', ...c()] }],
        'stroke-w': [{ stroke: [u, $, E, oe] }],
        stroke: [{ stroke: ['none', ...c()] }],
        'forced-color-adjust': [{ 'forced-color-adjust': ['auto', 'none'] }],
      },
      conflictingClassGroups: {
        overflow: ['overflow-x', 'overflow-y'],
        overscroll: ['overscroll-x', 'overscroll-y'],
        inset: ['inset-x', 'inset-y', 'start', 'end', 'top', 'right', 'bottom', 'left'],
        'inset-x': ['right', 'left'],
        'inset-y': ['top', 'bottom'],
        flex: ['basis', 'grow', 'shrink'],
        gap: ['gap-x', 'gap-y'],
        p: ['px', 'py', 'ps', 'pe', 'pt', 'pr', 'pb', 'pl'],
        px: ['pr', 'pl'],
        py: ['pt', 'pb'],
        m: ['mx', 'my', 'ms', 'me', 'mt', 'mr', 'mb', 'ml'],
        mx: ['mr', 'ml'],
        my: ['mt', 'mb'],
        size: ['w', 'h'],
        'font-size': ['leading'],
        'fvn-normal': [
          'fvn-ordinal',
          'fvn-slashed-zero',
          'fvn-figure',
          'fvn-spacing',
          'fvn-fraction',
        ],
        'fvn-ordinal': ['fvn-normal'],
        'fvn-slashed-zero': ['fvn-normal'],
        'fvn-figure': ['fvn-normal'],
        'fvn-spacing': ['fvn-normal'],
        'fvn-fraction': ['fvn-normal'],
        'line-clamp': ['display', 'overflow'],
        rounded: [
          'rounded-s',
          'rounded-e',
          'rounded-t',
          'rounded-r',
          'rounded-b',
          'rounded-l',
          'rounded-ss',
          'rounded-se',
          'rounded-ee',
          'rounded-es',
          'rounded-tl',
          'rounded-tr',
          'rounded-br',
          'rounded-bl',
        ],
        'rounded-s': ['rounded-ss', 'rounded-es'],
        'rounded-e': ['rounded-se', 'rounded-ee'],
        'rounded-t': ['rounded-tl', 'rounded-tr'],
        'rounded-r': ['rounded-tr', 'rounded-br'],
        'rounded-b': ['rounded-br', 'rounded-bl'],
        'rounded-l': ['rounded-tl', 'rounded-bl'],
        'border-spacing': ['border-spacing-x', 'border-spacing-y'],
        'border-w': [
          'border-w-x',
          'border-w-y',
          'border-w-s',
          'border-w-e',
          'border-w-t',
          'border-w-r',
          'border-w-b',
          'border-w-l',
        ],
        'border-w-x': ['border-w-r', 'border-w-l'],
        'border-w-y': ['border-w-t', 'border-w-b'],
        'border-color': [
          'border-color-x',
          'border-color-y',
          'border-color-s',
          'border-color-e',
          'border-color-t',
          'border-color-r',
          'border-color-b',
          'border-color-l',
        ],
        'border-color-x': ['border-color-r', 'border-color-l'],
        'border-color-y': ['border-color-t', 'border-color-b'],
        translate: ['translate-x', 'translate-y', 'translate-none'],
        'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
        'scroll-m': [
          'scroll-mx',
          'scroll-my',
          'scroll-ms',
          'scroll-me',
          'scroll-mt',
          'scroll-mr',
          'scroll-mb',
          'scroll-ml',
        ],
        'scroll-mx': ['scroll-mr', 'scroll-ml'],
        'scroll-my': ['scroll-mt', 'scroll-mb'],
        'scroll-p': [
          'scroll-px',
          'scroll-py',
          'scroll-ps',
          'scroll-pe',
          'scroll-pt',
          'scroll-pr',
          'scroll-pb',
          'scroll-pl',
        ],
        'scroll-px': ['scroll-pr', 'scroll-pl'],
        'scroll-py': ['scroll-pt', 'scroll-pb'],
        touch: ['touch-x', 'touch-y', 'touch-pz'],
        'touch-x': ['touch'],
        'touch-y': ['touch'],
        'touch-pz': ['touch'],
      },
      conflictingClassGroupModifiers: { 'font-size': ['leading'] },
      orderSensitiveModifiers: [
        '*',
        '**',
        'after',
        'backdrop',
        'before',
        'details-content',
        'file',
        'first-letter',
        'first-line',
        'marker',
        'placeholder',
        'selection',
      ],
    };
  },
  kr = rr(wr);
function vr(...e) {
  return kr(Fe(e));
}
const Te = y.forwardRef(
  (
    { variant: e = 'primary', size: o = 'md', asChild: t = !1, className: r, disabled: n, ...i },
    l
  ) => {
    const p = t ? je : 'button';
    return te.jsx(p, {
      ref: l,
      className: vr(
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-disabled',
        'transition-all duration-200',
        'hover:opacity-hover active:scale-active',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': e === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': e === 'secondary',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': e === 'destructive',
          'bg-success text-success-foreground hover:bg-success/90': e === 'success',
          'bg-warning text-warning-foreground hover:bg-warning/90': e === 'warning',
          'bg-info text-info-foreground hover:bg-info/90': e === 'info',
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
            e === 'outline',
          'hover:bg-accent hover:text-accent-foreground': e === 'ghost',
        },
        {
          'h-8 px-3 text-xs': o === 'sm',
          'h-10 px-4': o === 'md',
          'h-12 px-6 text-base': o === 'lg',
        },
        r
      ),
      disabled: n,
      ...i,
    });
  }
);
Te.displayName = 'Button';
Te.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'Button',
  props: {
    variant: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline' | 'ghost'",
        elements: [
          { name: 'literal', value: "'primary'" },
          { name: 'literal', value: "'secondary'" },
          { name: 'literal', value: "'destructive'" },
          { name: 'literal', value: "'success'" },
          { name: 'literal', value: "'warning'" },
          { name: 'literal', value: "'info'" },
          { name: 'literal', value: "'outline'" },
          { name: 'literal', value: "'ghost'" },
        ],
      },
      description: '',
      defaultValue: { value: "'primary'", computed: !1 },
    },
    size: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'sm' | 'md' | 'lg'",
        elements: [
          { name: 'literal', value: "'sm'" },
          { name: 'literal', value: "'md'" },
          { name: 'literal', value: "'lg'" },
        ],
      },
      description: '',
      defaultValue: { value: "'md'", computed: !1 },
    },
    asChild: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
  },
};
export { Te as B, vr as a, Ve as c, Sr as u };
