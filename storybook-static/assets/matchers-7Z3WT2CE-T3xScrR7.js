const _e =
  (e = 0) =>
  (r) =>
    `\x1B[${r + e}m`;
const Ee =
  (e = 0) =>
  (r) =>
    `\x1B[${38 + e};5;${r}m`;
const he =
  (e = 0) =>
  (r, n, i) =>
    `\x1B[${38 + e};2;${r};${n};${i}m`;
const P = {
  modifier: {
    reset: [0, 0],
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29],
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    blackBright: [90, 39],
    gray: [90, 39],
    grey: [90, 39],
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39],
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    bgGrey: [100, 49],
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49],
  },
};
Object.keys(P.modifier);
const Ie = Object.keys(P.color);
const we = Object.keys(P.bgColor);
[...Ie, ...we];
function je() {
  const e = new Map();
  for (const [r, n] of Object.entries(P)) {
    for (const [i, c] of Object.entries(n))
      (P[i] = { open: `\x1B[${c[0]}m`, close: `\x1B[${c[1]}m` }), (n[i] = P[i]), e.set(c[0], c[1]);
    Object.defineProperty(P, r, { value: n, enumerable: !1 });
  }
  return (
    Object.defineProperty(P, 'codes', { value: e, enumerable: !1 }),
    (P.color.close = '\x1B[39m'),
    (P.bgColor.close = '\x1B[49m'),
    (P.color.ansi = _e()),
    (P.color.ansi256 = Ee()),
    (P.color.ansi16m = he()),
    (P.bgColor.ansi = _e(10)),
    (P.bgColor.ansi256 = Ee(10)),
    (P.bgColor.ansi16m = he(10)),
    Object.defineProperties(P, {
      rgbToAnsi256: {
        value(r, n, i) {
          return r === n && n === i
            ? r < 8
              ? 16
              : r > 248
                ? 231
                : Math.round(((r - 8) / 247) * 24) + 232
            : 16 +
                36 * Math.round((r / 255) * 5) +
                6 * Math.round((n / 255) * 5) +
                Math.round((i / 255) * 5);
        },
        enumerable: !1,
      },
      hexToRgb: {
        value(r) {
          const n = /[a-f\d]{6}|[a-f\d]{3}/i.exec(r.toString(16));
          if (!n) return [0, 0, 0];
          let [i] = n;
          i.length === 3 && (i = [...i].map((_) => _ + _).join(''));
          const c = Number.parseInt(i, 16);
          return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
        },
        enumerable: !1,
      },
      hexToAnsi256: { value: (r) => P.rgbToAnsi256(...P.hexToRgb(r)), enumerable: !1 },
      ansi256ToAnsi: {
        value(r) {
          if (r < 8) return 30 + r;
          if (r < 16) return 90 + (r - 8);
          let n;
          let i;
          let c;
          if (r >= 232) (n = ((r - 232) * 10 + 8) / 255), (i = n), (c = n);
          else {
            r -= 16;
            const o = r % 36;
            (n = Math.floor(r / 36) / 5), (i = Math.floor(o / 6) / 5), (c = (o % 6) / 5);
          }
          const _ = Math.max(n, i, c) * 2;
          if (_ === 0) return 30;
          let p = 30 + ((Math.round(c) << 2) | (Math.round(i) << 1) | Math.round(n));
          return _ === 2 && (p += 60), p;
        },
        enumerable: !1,
      },
      rgbToAnsi: { value: (r, n, i) => P.ansi256ToAnsi(P.rgbToAnsi256(r, n, i)), enumerable: !1 },
      hexToAnsi: { value: (r) => P.ansi256ToAnsi(P.hexToAnsi256(r)), enumerable: !1 },
    }),
    P
  );
}
const Be = je();
const x = Be;
const Oe = (() => {
  if (!('navigator' in globalThis)) return 0;
  if (globalThis.navigator.userAgentData) {
    const e = navigator.userAgentData.brands.find(({ brand: r }) => r === 'Chromium');
    if (e && e.version > 93) return 3;
  }
  return /\b(Chrome|Chromium)\//.test(globalThis.navigator.userAgent) ? 1 : 0;
})();
const Te = Oe !== 0 && { level: Oe };
const Le = { stdout: Te, stderr: Te };
const De = Le;
function Fe(e, r, n) {
  let i = e.indexOf(r);
  if (i === -1) return e;
  const c = r.length;
  let _ = 0;
  let p = '';
  do (p += e.slice(_, i) + r + n), (_ = i + c), (i = e.indexOf(r, _));
  while (i !== -1);
  return (p += e.slice(_)), p;
}
function ke(e, r, n, i) {
  let c = 0;
  let _ = '';
  do {
    const p = e[i - 1] === '\r';
    (_ +=
      e.slice(c, p ? i - 1 : i) +
      r +
      (p
        ? `\r
`
        : `
`) +
      n),
      (c = i + 1),
      (i = e.indexOf(
        `
`,
        c
      ));
  } while (i !== -1);
  return (_ += e.slice(c)), _;
}
const { stdout: Se, stderr: Me } = De;
const de = Symbol('GENERATOR');
const V = Symbol('STYLER');
const J = Symbol('IS_EMPTY');
const Ae = ['ansi', 'ansi', 'ansi256', 'ansi16m'];
const H = Object.create(null);
const Ye = (e, r = {}) => {
  if (r.level && !(Number.isInteger(r.level) && r.level >= 0 && r.level <= 3))
    throw new Error('The `level` option should be an integer from 0 to 3');
  const n = Se ? Se.level : 0;
  e.level = r.level === void 0 ? n : r.level;
};
const ze = (e) => {
  const r = (...n) => n.join(' ');
  return Ye(r, e), Object.setPrototypeOf(r, X.prototype), r;
};
function X(e) {
  return ze(e);
}
Object.setPrototypeOf(X.prototype, Function.prototype);
for (const [e, r] of Object.entries(x))
  H[e] = {
    get() {
      const n = ie(this, pe(r.open, r.close, this[V]), this[J]);
      return Object.defineProperty(this, e, { value: n }), n;
    },
  };
H.visible = {
  get() {
    const e = ie(this, this[V], !0);
    return Object.defineProperty(this, 'visible', { value: e }), e;
  },
};
const fe = (e, r, n, ...i) =>
  e === 'rgb'
    ? r === 'ansi16m'
      ? x[n].ansi16m(...i)
      : r === 'ansi256'
        ? x[n].ansi256(x.rgbToAnsi256(...i))
        : x[n].ansi(x.rgbToAnsi(...i))
    : e === 'hex'
      ? fe('rgb', r, n, ...x.hexToRgb(...i))
      : x[n][e](...i);
const Ue = ['rgb', 'hex', 'ansi256'];
for (const e of Ue) {
  H[e] = {
    get() {
      const { level: n } = this;
      return function (...i) {
        const c = pe(fe(e, Ae[n], 'color', ...i), x.color.close, this[V]);
        return ie(this, c, this[J]);
      };
    },
  };
  const r = `bg${e[0].toUpperCase()}${e.slice(1)}`;
  H[r] = {
    get() {
      const { level: n } = this;
      return function (...i) {
        const c = pe(fe(e, Ae[n], 'bgColor', ...i), x.bgColor.close, this[V]);
        return ie(this, c, this[J]);
      };
    },
  };
}
const xe = Object.defineProperties(() => {}, {
  ...H,
  level: {
    enumerable: !0,
    get() {
      return this[de].level;
    },
    set(e) {
      this[de].level = e;
    },
  },
});
const pe = (e, r, n) => {
  let i;
  let c;
  return (
    n === void 0 ? ((i = e), (c = r)) : ((i = n.openAll + e), (c = r + n.closeAll)),
    { open: e, close: r, openAll: i, closeAll: c, parent: n }
  );
};
const ie = (e, r, n) => {
  const i = (...c) => Ge(i, c.length === 1 ? `${c[0]}` : c.join(' '));
  return Object.setPrototypeOf(i, xe), (i[de] = e), (i[V] = r), (i[J] = n), i;
};
const Ge = (e, r) => {
  if (e.level <= 0 || !r) return e[J] ? '' : r;
  let n = e[V];
  if (n === void 0) return r;
  const { openAll: i, closeAll: c } = n;
  if (r.includes('\x1B')) while (n !== void 0) (r = Fe(r, n.close, n.open)), (n = n.parent);
  const _ = r.indexOf(`
`);
  return _ !== -1 && (r = ke(r, c, i, _)), i + r + c;
};
Object.defineProperties(X.prototype, H);
const qe = X();
X({ level: Me ? Me.level : 0 });
const W = qe;
const We = Object.create;
const Pe = Object.defineProperty;
const Ve = Object.getOwnPropertyDescriptor;
const Re = Object.getOwnPropertyNames;
const He = Object.getPrototypeOf;
const Ke = Object.prototype.hasOwnProperty;
const F = (e, r) => () => (r || (0, e[Re(e)[0]])((r = { exports: {} }).exports, r), r.exports);
const Je = (e, r, n, i) => {
  if ((r && typeof r === 'object') || typeof r === 'function')
    for (const c of Re(r))
      !Ke.call(e, c) &&
        c !== n &&
        Pe(e, c, { get: () => r[c], enumerable: !(i = Ve(r, c)) || i.enumerable });
  return e;
};
const Xe = (e, r, n) => (
  (n = e != null ? We(He(e)) : {}), Je(Pe(n, 'default', { value: e, enumerable: !0 }), e)
);
const Ne = F({
  'node_modules/pretty-format/node_modules/ansi-styles/index.js'(e, r) {
    const n = 10;
    const i =
      (p = 0) =>
      (o) =>
        `\x1B[${38 + p};5;${o}m`;
    const c =
      (p = 0) =>
      (o, y, u) =>
        `\x1B[${38 + p};2;${o};${y};${u}m`;
    function _() {
      const p = new Map();
      const o = {
        modifier: {
          reset: [0, 0],
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          overline: [53, 55],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29],
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39],
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49],
        },
      };
      (o.color.gray = o.color.blackBright),
        (o.bgColor.bgGray = o.bgColor.bgBlackBright),
        (o.color.grey = o.color.blackBright),
        (o.bgColor.bgGrey = o.bgColor.bgBlackBright);
      for (const [y, u] of Object.entries(o)) {
        for (const [m, s] of Object.entries(u))
          (o[m] = { open: `\x1B[${s[0]}m`, close: `\x1B[${s[1]}m` }),
            (u[m] = o[m]),
            p.set(s[0], s[1]);
        Object.defineProperty(o, y, { value: u, enumerable: !1 });
      }
      return (
        Object.defineProperty(o, 'codes', { value: p, enumerable: !1 }),
        (o.color.close = '\x1B[39m'),
        (o.bgColor.close = '\x1B[49m'),
        (o.color.ansi256 = i()),
        (o.color.ansi16m = c()),
        (o.bgColor.ansi256 = i(n)),
        (o.bgColor.ansi16m = c(n)),
        Object.defineProperties(o, {
          rgbToAnsi256: {
            value: (y, u, m) =>
              y === u && u === m
                ? y < 8
                  ? 16
                  : y > 248
                    ? 231
                    : Math.round(((y - 8) / 247) * 24) + 232
                : 16 +
                  36 * Math.round((y / 255) * 5) +
                  6 * Math.round((u / 255) * 5) +
                  Math.round((m / 255) * 5),
            enumerable: !1,
          },
          hexToRgb: {
            value: (y) => {
              const u = /(?<colorString>[a-f\d]{6}|[a-f\d]{3})/i.exec(y.toString(16));
              if (!u) return [0, 0, 0];
              let { colorString: m } = u.groups;
              m.length === 3 &&
                (m = m
                  .split('')
                  .map((l) => l + l)
                  .join(''));
              const s = Number.parseInt(m, 16);
              return [(s >> 16) & 255, (s >> 8) & 255, s & 255];
            },
            enumerable: !1,
          },
          hexToAnsi256: { value: (y) => o.rgbToAnsi256(...o.hexToRgb(y)), enumerable: !1 },
        }),
        o
      );
    }
    Object.defineProperty(r, 'exports', { enumerable: !0, get: _ });
  },
});
const ue = F({
  'node_modules/pretty-format/build/collections.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.printIteratorEntries = n),
      (e.printIteratorValues = i),
      (e.printListItems = c),
      (e.printObjectProperties = _);
    const r = (p, o) => {
      const y = Object.keys(p).sort(o);
      return (
        Object.getOwnPropertySymbols?.(p).forEach((u) => {
          Object.getOwnPropertyDescriptor(p, u).enumerable && y.push(u);
        }),
        y
      );
    };
    function n(p, o, y, u, m, s, l = ': ') {
      let a = '';
      let d = 0;
      let g = p.next();
      if (!g.done) {
        a += o.spacingOuter;
        const E = y + o.indent;
        while (!g.done) {
          if (((a += E), d++ === o.maxWidth)) {
            a += '…';
            break;
          }
          const O = s(g.value[0], o, E, u, m);
          const A = s(g.value[1], o, E, u, m);
          (a += O + l + A),
            (g = p.next()),
            g.done ? o.min || (a += ',') : (a += `,${o.spacingInner}`);
        }
        a += o.spacingOuter + y;
      }
      return a;
    }
    function i(p, o, y, u, m, s) {
      let l = '';
      let a = 0;
      let d = p.next();
      if (!d.done) {
        l += o.spacingOuter;
        const g = y + o.indent;
        while (!d.done) {
          if (((l += g), a++ === o.maxWidth)) {
            l += '…';
            break;
          }
          (l += s(d.value, o, g, u, m)),
            (d = p.next()),
            d.done ? o.min || (l += ',') : (l += `,${o.spacingInner}`);
        }
        l += o.spacingOuter + y;
      }
      return l;
    }
    function c(p, o, y, u, m, s) {
      let l = '';
      if (p.length) {
        l += o.spacingOuter;
        const a = y + o.indent;
        for (let d = 0; d < p.length; d++) {
          if (((l += a), d === o.maxWidth)) {
            l += '…';
            break;
          }
          d in p && (l += s(p[d], o, a, u, m)),
            d < p.length - 1 ? (l += `,${o.spacingInner}`) : o.min || (l += ',');
        }
        l += o.spacingOuter + y;
      }
      return l;
    }
    function _(p, o, y, u, m, s) {
      let l = '';
      const a = r(p, o.compareKeys);
      if (a.length) {
        l += o.spacingOuter;
        const d = y + o.indent;
        for (let g = 0; g < a.length; g++) {
          const E = a[g];
          const O = s(E, o, d, u, m);
          const A = s(p[E], o, d, u, m);
          (l += `${d + O}: ${A}`),
            g < a.length - 1 ? (l += `,${o.spacingInner}`) : o.min || (l += ',');
        }
        l += o.spacingOuter + y;
      }
      return l;
    }
  },
});
const Ze = F({
  'node_modules/pretty-format/build/plugins/AsymmetricMatcher.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.test = e.serialize = e.default = void 0);
    const r = ue();
    const n = globalThis['jest-symbol-do-not-touch'] || globalThis.Symbol;
    const i = typeof n === 'function' && n.for ? n.for('jest.asymmetricMatcher') : 1267621;
    const c = ' ';
    const _ = (u, m, s, l, a, d) => {
      const g = u.toString();
      if (g === 'ArrayContaining' || g === 'ArrayNotContaining')
        return ++l > m.maxDepth
          ? `[${g}]`
          : `${g + c}[${(0, r.printListItems)(u.sample, m, s, l, a, d)}]`;
      if (g === 'ObjectContaining' || g === 'ObjectNotContaining')
        return ++l > m.maxDepth
          ? `[${g}]`
          : `${g + c}{${(0, r.printObjectProperties)(u.sample, m, s, l, a, d)}}`;
      if (
        g === 'StringMatching' ||
        g === 'StringNotMatching' ||
        g === 'StringContaining' ||
        g === 'StringNotContaining'
      )
        return g + c + d(u.sample, m, s, l, a);
      if (typeof u.toAsymmetricMatcher !== 'function')
        throw new Error(
          `Asymmetric matcher ${u.constructor.name} does not implement toAsymmetricMatcher()`
        );
      return u.toAsymmetricMatcher();
    };
    e.serialize = _;
    const p = (u) => u && u.$$typeof === i;
    e.test = p;
    const o = { serialize: _, test: p };
    const y = o;
    e.default = y;
  },
});
const Qe = F({
  'node_modules/ansi-regex/index.js'(e, r) {
    r.exports = ({ onlyFirst: n = !1 } = {}) => {
      const i = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
      ].join('|');
      return new RegExp(i, n ? void 0 : 'g');
    };
  },
});
const et = F({
  'node_modules/pretty-format/build/plugins/ConvertAnsi.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.test = e.serialize = e.default = void 0);
    const r = i(Qe());
    const n = i(Ne());
    function i(u) {
      return u?.__esModule ? u : { default: u };
    }
    const c = (u) =>
      u.replace((0, r.default)(), (m) => {
        switch (m) {
          case n.default.red.close:
          case n.default.green.close:
          case n.default.cyan.close:
          case n.default.gray.close:
          case n.default.white.close:
          case n.default.yellow.close:
          case n.default.bgRed.close:
          case n.default.bgGreen.close:
          case n.default.bgYellow.close:
          case n.default.inverse.close:
          case n.default.dim.close:
          case n.default.bold.close:
          case n.default.reset.open:
          case n.default.reset.close:
            return '</>';
          case n.default.red.open:
            return '<red>';
          case n.default.green.open:
            return '<green>';
          case n.default.cyan.open:
            return '<cyan>';
          case n.default.gray.open:
            return '<gray>';
          case n.default.white.open:
            return '<white>';
          case n.default.yellow.open:
            return '<yellow>';
          case n.default.bgRed.open:
            return '<bgRed>';
          case n.default.bgGreen.open:
            return '<bgGreen>';
          case n.default.bgYellow.open:
            return '<bgYellow>';
          case n.default.inverse.open:
            return '<inverse>';
          case n.default.dim.open:
            return '<dim>';
          case n.default.bold.open:
            return '<bold>';
          default:
            return '';
        }
      });
    const _ = (u) => typeof u === 'string' && !!u.match((0, r.default)());
    e.test = _;
    const p = (u, m, s, l, a, d) => d(c(u), m, s, l, a);
    e.serialize = p;
    const o = { serialize: p, test: _ };
    const y = o;
    e.default = y;
  },
});
const tt = F({
  'node_modules/pretty-format/build/plugins/DOMCollection.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.test = e.serialize = e.default = void 0);
    const r = ue();
    const n = ' ';
    const i = ['DOMStringMap', 'NamedNodeMap'];
    const c = /^(HTML\w*Collection|NodeList)$/;
    const _ = (s) => i.indexOf(s) !== -1 || c.test(s);
    const p = (s) => s?.constructor && !!s.constructor.name && _(s.constructor.name);
    e.test = p;
    const o = (s) => s.constructor.name === 'NamedNodeMap';
    const y = (s, l, a, d, g, E) => {
      const O = s.constructor.name;
      return ++d > l.maxDepth
        ? `[${O}]`
        : (l.min ? '' : O + n) +
            (i.indexOf(O) !== -1
              ? `{${(0, r.printObjectProperties)(o(s) ? Array.from(s).reduce((A, I) => ((A[I.name] = I.value), A), {}) : { ...s }, l, a, d, g, E)}}`
              : `[${(0, r.printListItems)(Array.from(s), l, a, d, g, E)}]`);
    };
    e.serialize = y;
    const u = { serialize: y, test: p };
    const m = u;
    e.default = m;
  },
});
const rt = F({
  'node_modules/pretty-format/build/plugins/lib/escapeHTML.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }), (e.default = r);
    function r(n) {
      return n.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  },
});
const ge = F({
  'node_modules/pretty-format/build/plugins/lib/markup.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.printText =
        e.printProps =
        e.printElementAsLeaf =
        e.printElement =
        e.printComment =
        e.printChildren =
          void 0);
    const r = n(rt());
    function n(u) {
      return u?.__esModule ? u : { default: u };
    }
    const i = (u, m, s, l, a, d, g) => {
      const E = l + s.indent;
      const O = s.colors;
      return u
        .map((A) => {
          const I = m[A];
          let j = g(I, s, E, a, d);
          return (
            typeof I !== 'string' &&
              (j.indexOf(`
`) !== -1 && (j = s.spacingOuter + E + j + s.spacingOuter + l),
              (j = `{${j}}`)),
            `${s.spacingInner + l + O.prop.open + A + O.prop.close}=${O.value.open}${j}${O.value.close}`
          );
        })
        .join('');
    };
    e.printProps = i;
    const c = (u, m, s, l, a, d) =>
      u
        .map((g) => m.spacingOuter + s + (typeof g === 'string' ? _(g, m) : d(g, m, s, l, a)))
        .join('');
    e.printChildren = c;
    const _ = (u, m) => {
      const s = m.colors.content;
      return s.open + (0, r.default)(u) + s.close;
    };
    e.printText = _;
    const p = (u, m) => {
      const s = m.colors.comment;
      return `${s.open}<!--${(0, r.default)(u)}-->${s.close}`;
    };
    e.printComment = p;
    const o = (u, m, s, l, a) => {
      const d = l.colors.tag;
      return `${d.open}<${u}${m && d.close + m + l.spacingOuter + a + d.open}${s ? `>${d.close}${s}${l.spacingOuter}${a}${d.open}</${u}` : `${m && !l.min ? '' : ' '}/`}>${d.close}`;
    };
    e.printElement = o;
    const y = (u, m) => {
      const s = m.colors.tag;
      return `${s.open}<${u}${s.close} …${s.open} />${s.close}`;
    };
    e.printElementAsLeaf = y;
  },
});
const nt = F({
  'node_modules/pretty-format/build/plugins/DOMElement.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.test = e.serialize = e.default = void 0);
    const r = ge();
    const n = 1;
    const i = 3;
    const c = 8;
    const _ = 11;
    const p = /^((HTML|SVG)\w*)?Element$/;
    const o = (E) => {
      try {
        return typeof E.hasAttribute === 'function' && E.hasAttribute('is');
      } catch {
        return !1;
      }
    };
    const y = (E) => {
      const O = E.constructor.name;
      const { nodeType: A, tagName: I } = E;
      const j = (typeof I === 'string' && I.includes('-')) || o(E);
      return (
        (A === n && (p.test(O) || j)) ||
        (A === i && O === 'Text') ||
        (A === c && O === 'Comment') ||
        (A === _ && O === 'DocumentFragment')
      );
    };
    const u = (E) => {
      let O;
      return (E == null || (O = E.constructor) === null || O === void 0 ? void 0 : O.name) && y(E);
    };
    e.test = u;
    function m(E) {
      return E.nodeType === i;
    }
    function s(E) {
      return E.nodeType === c;
    }
    function l(E) {
      return E.nodeType === _;
    }
    const a = (E, O, A, I, j, G) => {
      if (m(E)) return (0, r.printText)(E.data, O);
      if (s(E)) return (0, r.printComment)(E.data, O);
      const B = l(E) ? 'DocumentFragment' : E.tagName.toLowerCase();
      return ++I > O.maxDepth
        ? (0, r.printElementAsLeaf)(B, O)
        : (0, r.printElement)(
            B,
            (0, r.printProps)(
              l(E)
                ? []
                : Array.from(E.attributes)
                    .map((Y) => Y.name)
                    .sort(),
              l(E) ? {} : Array.from(E.attributes).reduce((Y, h) => ((Y[h.name] = h.value), Y), {}),
              O,
              A + O.indent,
              I,
              j,
              G
            ),
            (0, r.printChildren)(
              Array.prototype.slice.call(E.childNodes || E.children),
              O,
              A + O.indent,
              I,
              j,
              G
            ),
            O,
            A
          );
    };
    e.serialize = a;
    const d = { serialize: a, test: u };
    const g = d;
    e.default = g;
  },
});
const lt = F({
  'node_modules/pretty-format/build/plugins/Immutable.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.test = e.serialize = e.default = void 0);
    const r = ue();
    const n = '@@__IMMUTABLE_ITERABLE__@@';
    const i = '@@__IMMUTABLE_LIST__@@';
    const c = '@@__IMMUTABLE_KEYED__@@';
    const _ = '@@__IMMUTABLE_MAP__@@';
    const p = '@@__IMMUTABLE_ORDERED__@@';
    const o = '@@__IMMUTABLE_RECORD__@@';
    const y = '@@__IMMUTABLE_SEQ__@@';
    const u = '@@__IMMUTABLE_SET__@@';
    const m = '@@__IMMUTABLE_STACK__@@';
    const s = (h) => `Immutable.${h}`;
    const l = (h) => `[${h}]`;
    const a = ' ';
    const d = '…';
    const g = (h, $, R, C, L, w, D) =>
      ++C > $.maxDepth
        ? l(s(D))
        : `${s(D) + a}{${(0, r.printIteratorEntries)(h.entries(), $, R, C, L, w)}}`;
    function E(h) {
      let $ = 0;
      return {
        next() {
          if ($ < h._keys.length) {
            const R = h._keys[$++];
            return { done: !1, value: [R, h.get(R)] };
          }
          return { done: !0, value: void 0 };
        },
      };
    }
    const O = (h, $, R, C, L, w) => {
      const D = s(h._name || 'Record');
      return ++C > $.maxDepth
        ? l(D)
        : `${D + a}{${(0, r.printIteratorEntries)(E(h), $, R, C, L, w)}}`;
    };
    const A = (h, $, R, C, L, w) => {
      const D = s('Seq');
      return ++C > $.maxDepth
        ? l(D)
        : h[c]
          ? `${D + a}{${h._iter || h._object ? ((0, r.printIteratorEntries))(h.entries(), $, R, C, L, w) : d}}`
          : `${D + a}[${h._iter || h._array || h._collection || h._iterable ? ((0, r.printIteratorValues))(h.values(), $, R, C, L, w) : d}]`;
    };
    const I = (h, $, R, C, L, w, D) =>
      ++C > $.maxDepth
        ? l(s(D))
        : `${s(D) + a}[${(0, r.printIteratorValues)(h.values(), $, R, C, L, w)}]`;
    const j = (h, $, R, C, L, w) =>
      h[_]
        ? g(h, $, R, C, L, w, h[p] ? 'OrderedMap' : 'Map')
        : h[i]
          ? I(h, $, R, C, L, w, 'List')
          : h[u]
            ? I(h, $, R, C, L, w, h[p] ? 'OrderedSet' : 'Set')
            : h[m]
              ? I(h, $, R, C, L, w, 'Stack')
              : h[y]
                ? A(h, $, R, C, L, w)
                : O(h, $, R, C, L, w);
    e.serialize = j;
    const G = (h) => h && (h[n] === !0 || h[o] === !0);
    e.test = G;
    const B = { serialize: j, test: G };
    const Y = B;
    e.default = Y;
  },
});
const at = F({
  'node_modules/react-is/cjs/react-is.development.js'(e) {
    (() => {
      const r = Symbol.for('react.element');
      const n = Symbol.for('react.portal');
      const i = Symbol.for('react.fragment');
      const c = Symbol.for('react.strict_mode');
      const _ = Symbol.for('react.profiler');
      const p = Symbol.for('react.provider');
      const o = Symbol.for('react.context');
      const y = Symbol.for('react.server_context');
      const u = Symbol.for('react.forward_ref');
      const m = Symbol.for('react.suspense');
      const s = Symbol.for('react.suspense_list');
      const l = Symbol.for('react.memo');
      const a = Symbol.for('react.lazy');
      const d = Symbol.for('react.offscreen');
      const g = !1;
      const E = !1;
      const O = !1;
      const A = !1;
      const I = !1;
      let j;
      j = Symbol.for('react.module.reference');
      function G(f) {
        return !!(
          typeof f === 'string' ||
          typeof f === 'function' ||
          f === i ||
          f === _ ||
          I ||
          f === c ||
          f === m ||
          f === s ||
          A ||
          f === d ||
          g ||
          E ||
          O ||
          (typeof f === 'object' &&
            f !== null &&
            (f.$$typeof === a ||
              f.$$typeof === l ||
              f.$$typeof === p ||
              f.$$typeof === o ||
              f.$$typeof === u ||
              f.$$typeof === j ||
              f.getModuleId !== void 0))
        );
      }
      function B(f) {
        if (typeof f === 'object' && f !== null) {
          const N = f.$$typeof;
          switch (N) {
            case r: {
              const v = f.type;
              switch (v) {
                case i:
                case _:
                case c:
                case m:
                case s:
                  return v;
                default: {
                  const U = v?.$$typeof;
                  switch (U) {
                    case y:
                    case o:
                    case u:
                    case a:
                    case l:
                    case p:
                      return U;
                    default:
                      return N;
                  }
                }
              }
            }
            case n:
              return N;
          }
        }
      }
      const Y = o;
      const h = p;
      const $ = r;
      const R = u;
      const C = i;
      const L = a;
      const w = l;
      const D = n;
      const z = _;
      const K = c;
      const Z = m;
      const k = s;
      let Q = !1;
      let ee = !1;
      function oe(f) {
        return (
          Q ||
            ((Q = !0),
            console.warn(
              'The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 18+.'
            )),
          !1
        );
      }
      function te(f) {
        return (
          ee ||
            ((ee = !0),
            console.warn(
              'The ReactIs.isConcurrentMode() alias has been deprecated, and will be removed in React 18+.'
            )),
          !1
        );
      }
      function re(f) {
        return B(f) === o;
      }
      function ne(f) {
        return B(f) === p;
      }
      function le(f) {
        return typeof f === 'object' && f !== null && f.$$typeof === r;
      }
      function se(f) {
        return B(f) === u;
      }
      function ae(f) {
        return B(f) === i;
      }
      function ce(f) {
        return B(f) === a;
      }
      function me(f) {
        return B(f) === l;
      }
      function t(f) {
        return B(f) === n;
      }
      function b(f) {
        return B(f) === _;
      }
      function T(f) {
        return B(f) === c;
      }
      function M(f) {
        return B(f) === m;
      }
      function S(f) {
        return B(f) === s;
      }
      (e.ContextConsumer = Y),
        (e.ContextProvider = h),
        (e.Element = $),
        (e.ForwardRef = R),
        (e.Fragment = C),
        (e.Lazy = L),
        (e.Memo = w),
        (e.Portal = D),
        (e.Profiler = z),
        (e.StrictMode = K),
        (e.Suspense = Z),
        (e.SuspenseList = k),
        (e.isAsyncMode = oe),
        (e.isConcurrentMode = te),
        (e.isContextConsumer = re),
        (e.isContextProvider = ne),
        (e.isElement = le),
        (e.isForwardRef = se),
        (e.isFragment = ae),
        (e.isLazy = ce),
        (e.isMemo = me),
        (e.isPortal = t),
        (e.isProfiler = b),
        (e.isStrictMode = T),
        (e.isSuspense = M),
        (e.isSuspenseList = S),
        (e.isValidElementType = G),
        (e.typeOf = B);
    })();
  },
});
const it = F({
  'node_modules/react-is/index.js'(e, r) {
    r.exports = at();
  },
});
const ut = F({
  'node_modules/pretty-format/build/plugins/ReactElement.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.test = e.serialize = e.default = void 0);
    const r = c(it());
    const n = ge();
    function i(l) {
      if (typeof WeakMap !== 'function') return null;
      const a = new WeakMap();
      const d = new WeakMap();
      return (i = (g) => (g ? d : a))(l);
    }
    function c(l, a) {
      if (l?.__esModule) return l;
      if (l === null || (typeof l !== 'object' && typeof l !== 'function')) return { default: l };
      const d = i(a);
      if (d?.has(l)) return d.get(l);
      const g = {};
      const E = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (const O in l)
        if (O !== 'default' && Object.prototype.hasOwnProperty.call(l, O)) {
          const A = E ? Object.getOwnPropertyDescriptor(l, O) : null;
          A && (A.get || A.set) ? Object.defineProperty(g, O, A) : (g[O] = l[O]);
        }
      return (g.default = l), d?.set(l, g), g;
    }
    const _ = (l, a = []) => (
      Array.isArray(l)
        ? l.forEach((d) => {
            _(d, a);
          })
        : l != null && l !== !1 && a.push(l),
      a
    );
    const p = (l) => {
      const a = l.type;
      if (typeof a === 'string') return a;
      if (typeof a === 'function') return a.displayName || a.name || 'Unknown';
      if (r.isFragment(l)) return 'React.Fragment';
      if (r.isSuspense(l)) return 'React.Suspense';
      if (typeof a === 'object' && a !== null) {
        if (r.isContextProvider(l)) return 'Context.Provider';
        if (r.isContextConsumer(l)) return 'Context.Consumer';
        if (r.isForwardRef(l)) {
          if (a.displayName) return a.displayName;
          const d = a.render.displayName || a.render.name || '';
          return d !== '' ? `ForwardRef(${d})` : 'ForwardRef';
        }
        if (r.isMemo(l)) {
          const d = a.displayName || a.type.displayName || a.type.name || '';
          return d !== '' ? `Memo(${d})` : 'Memo';
        }
      }
      return 'UNDEFINED';
    };
    const o = (l) => {
      const { props: a } = l;
      return Object.keys(a)
        .filter((d) => d !== 'children' && a[d] !== void 0)
        .sort();
    };
    const y = (l, a, d, g, E, O) =>
      ++g > a.maxDepth
        ? (0, n.printElementAsLeaf)(p(l), a)
        : (0, n.printElement)(
            p(l),
            (0, n.printProps)(o(l), l.props, a, d + a.indent, g, E, O),
            (0, n.printChildren)(_(l.props.children), a, d + a.indent, g, E, O),
            a,
            d
          );
    e.serialize = y;
    const u = (l) => l != null && r.isElement(l);
    e.test = u;
    const m = { serialize: y, test: u };
    const s = m;
    e.default = s;
  },
});
const ot = F({
  'node_modules/pretty-format/build/plugins/ReactTestComponent.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.test = e.serialize = e.default = void 0);
    const r = ge();
    const n = globalThis['jest-symbol-do-not-touch'] || globalThis.Symbol;
    const i = typeof n === 'function' && n.for ? n.for('react.test.json') : 245830487;
    const c = (u) => {
      const { props: m } = u;
      return m
        ? Object.keys(m)
            .filter((s) => m[s] !== void 0)
            .sort()
        : [];
    };
    const _ = (u, m, s, l, a, d) =>
      ++l > m.maxDepth
        ? (0, r.printElementAsLeaf)(u.type, m)
        : (0, r.printElement)(
            u.type,
            u.props ? (0, r.printProps)(c(u), u.props, m, s + m.indent, l, a, d) : '',
            u.children ? (0, r.printChildren)(u.children, m, s + m.indent, l, a, d) : '',
            m,
            s
          );
    e.serialize = _;
    const p = (u) => u && u.$$typeof === i;
    e.test = p;
    const o = { serialize: _, test: p };
    const y = o;
    e.default = y;
  },
});
const st = F({
  'node_modules/pretty-format/build/index.js'(e) {
    Object.defineProperty(e, '__esModule', { value: !0 }),
      (e.default = e.DEFAULT_OPTIONS = void 0),
      (e.format = ae),
      (e.plugins = void 0);
    const r = m(Ne());
    const n = ue();
    const i = m(Ze());
    const c = m(et());
    const _ = m(tt());
    const p = m(nt());
    const o = m(lt());
    const y = m(ut());
    const u = m(ot());
    function m(t) {
      return t?.__esModule ? t : { default: t };
    }
    const s = Object.prototype.toString;
    const l = Date.prototype.toISOString;
    const a = Error.prototype.toString;
    const d = RegExp.prototype.toString;
    const g = (t) => (typeof t.constructor === 'function' && t.constructor.name) || 'Object';
    const E = (t) => typeof window < 'u' && t === window;
    const O = /^Symbol\((.*)\)(.*)$/;
    const A = /\n/gi;
    const I = class extends Error {
      constructor(t, b) {
        super(t), (this.stack = b), (this.name = this.constructor.name);
      }
    };
    function j(t) {
      return (
        t === '[object Array]' ||
        t === '[object ArrayBuffer]' ||
        t === '[object DataView]' ||
        t === '[object Float32Array]' ||
        t === '[object Float64Array]' ||
        t === '[object Int8Array]' ||
        t === '[object Int16Array]' ||
        t === '[object Int32Array]' ||
        t === '[object Uint8Array]' ||
        t === '[object Uint8ClampedArray]' ||
        t === '[object Uint16Array]' ||
        t === '[object Uint32Array]'
      );
    }
    function G(t) {
      return Object.is(t, -0) ? '-0' : String(t);
    }
    function B(t) {
      return `${t}n`;
    }
    function Y(t, b) {
      return b ? `[Function ${t.name || 'anonymous'}]` : '[Function]';
    }
    function h(t) {
      return String(t).replace(O, 'Symbol($1)');
    }
    function $(t) {
      return `[${a.call(t)}]`;
    }
    function R(t, b, T, M) {
      if (t === !0 || t === !1) return `${t}`;
      if (t === void 0) return 'undefined';
      if (t === null) return 'null';
      const S = typeof t;
      if (S === 'number') return G(t);
      if (S === 'bigint') return B(t);
      if (S === 'string') return M ? `"${t.replace(/"|\\/g, '\\$&')}"` : `"${t}"`;
      if (S === 'function') return Y(t, b);
      if (S === 'symbol') return h(t);
      const f = s.call(t);
      return f === '[object WeakMap]'
        ? 'WeakMap {}'
        : f === '[object WeakSet]'
          ? 'WeakSet {}'
          : f === '[object Function]' || f === '[object GeneratorFunction]'
            ? Y(t, b)
            : f === '[object Symbol]'
              ? h(t)
              : f === '[object Date]'
                ? Number.isNaN(+t)
                  ? 'Date { NaN }'
                  : l.call(t)
                : f === '[object Error]'
                  ? $(t)
                  : f === '[object RegExp]'
                    ? T
                      ? d.call(t).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')
                      : d.call(t)
                    : t instanceof Error
                      ? $(t)
                      : null;
    }
    function C(t, b, T, M, S, f) {
      if (S.indexOf(t) !== -1) return '[Circular]';
      (S = S.slice()), S.push(t);
      const N = ++M > b.maxDepth;
      const v = b.min;
      if (b.callToJSON && !N && t.toJSON && typeof t.toJSON === 'function' && !f)
        return z(t.toJSON(), b, T, M, S, !0);
      const U = s.call(t);
      return U === '[object Arguments]'
        ? N
          ? '[Arguments]'
          : `${v ? '' : 'Arguments '}[${(0, n.printListItems)(t, b, T, M, S, z)}]`
        : j(U)
          ? N
            ? `[${t.constructor.name}]`
            : `${v || (!b.printBasicPrototype && t.constructor.name === 'Array') ? '' : `${t.constructor.name} `}[${(0, n.printListItems)(t, b, T, M, S, z)}]`
          : U === '[object Map]'
            ? N
              ? '[Map]'
              : `Map {${(0, n.printIteratorEntries)(t.entries(), b, T, M, S, z, ' => ')}}`
            : U === '[object Set]'
              ? N
                ? '[Set]'
                : `Set {${(0, n.printIteratorValues)(t.values(), b, T, M, S, z)}}`
              : N || E(t)
                ? `[${g(t)}]`
                : `${v || (!b.printBasicPrototype && g(t) === 'Object') ? '' : `${g(t)} `}{${(0, n.printObjectProperties)(t, b, T, M, S, z)}}`;
    }
    function L(t) {
      return t.serialize != null;
    }
    function w(t, b, T, M, S, f) {
      let N;
      try {
        N = L(t)
          ? t.serialize(b, T, M, S, f, z)
          : t.print(
              b,
              (v) => z(v, T, M, S, f),
              (v) => {
                const U = M + T.indent;
                return (
                  U +
                  v.replace(
                    A,
                    `
${U}`
                  )
                );
              },
              { edgeSpacing: T.spacingOuter, min: T.min, spacing: T.spacingInner },
              T.colors
            );
      } catch (v) {
        throw new I(v.message, v.stack);
      }
      if (typeof N !== 'string')
        throw new Error(
          `pretty-format: Plugin must return type "string" but instead returned "${typeof N}".`
        );
      return N;
    }
    function D(t, b) {
      for (let T = 0; T < t.length; T++)
        try {
          if (t[T].test(b)) return t[T];
        } catch (M) {
          throw new I(M.message, M.stack);
        }
      return null;
    }
    function z(t, b, T, M, S, f) {
      const N = D(b.plugins, t);
      if (N !== null) return w(N, t, b, T, M, S);
      const v = R(t, b.printFunctionName, b.escapeRegex, b.escapeString);
      return v !== null ? v : C(t, b, T, M, S, f);
    }
    const K = { comment: 'gray', content: 'reset', prop: 'yellow', tag: 'cyan', value: 'green' };
    const Z = Object.keys(K);
    const k = {
      callToJSON: !0,
      compareKeys: void 0,
      escapeRegex: !1,
      escapeString: !0,
      highlight: !1,
      indent: 2,
      maxDepth: 1 / 0,
      maxWidth: 1 / 0,
      min: !1,
      plugins: [],
      printBasicPrototype: !0,
      printFunctionName: !0,
      theme: K,
    };
    e.DEFAULT_OPTIONS = k;
    function Q(t) {
      if (
        (Object.keys(t).forEach((b) => {
          if (!Object.prototype.hasOwnProperty.call(k, b))
            throw new Error(`pretty-format: Unknown option "${b}".`);
        }),
        t.min && t.indent !== void 0 && t.indent !== 0)
      )
        throw new Error('pretty-format: Options "min" and "indent" cannot be used together.');
      if (t.theme !== void 0) {
        if (t.theme === null) throw new Error('pretty-format: Option "theme" must not be null.');
        if (typeof t.theme !== 'object')
          throw new Error(
            `pretty-format: Option "theme" must be of type "object" but instead received "${typeof t.theme}".`
          );
      }
    }
    const ee = (t) =>
      Z.reduce((b, T) => {
        const M = t.theme && t.theme[T] !== void 0 ? t.theme[T] : K[T];
        const S = M && r.default[M];
        if (S && typeof S.close === 'string' && typeof S.open === 'string') b[T] = S;
        else
          throw new Error(
            `pretty-format: Option "theme" has a key "${T}" whose value "${M}" is undefined in ansi-styles.`
          );
        return b;
      }, Object.create(null));
    const oe = () => Z.reduce((t, b) => ((t[b] = { close: '', open: '' }), t), Object.create(null));
    const te = (t) => {
      let b;
      return (b = t == null ? void 0 : t.printFunctionName) !== null && b !== void 0
        ? b
        : k.printFunctionName;
    };
    const re = (t) => {
      let b;
      return (b = t == null ? void 0 : t.escapeRegex) !== null && b !== void 0 ? b : k.escapeRegex;
    };
    const ne = (t) => {
      let b;
      return (b = t == null ? void 0 : t.escapeString) !== null && b !== void 0
        ? b
        : k.escapeString;
    };
    const le = (t) => {
      let b;
      let T;
      let M;
      let S;
      let f;
      let N;
      let v;
      return {
        callToJSON:
          (b = t == null ? void 0 : t.callToJSON) !== null && b !== void 0 ? b : k.callToJSON,
        colors: t?.highlight ? ee(t) : oe(),
        compareKeys:
          typeof (t == null ? void 0 : t.compareKeys) === 'function'
            ? t.compareKeys
            : k.compareKeys,
        escapeRegex: re(t),
        escapeString: ne(t),
        indent: t?.min
          ? ''
          : se((T = t == null ? void 0 : t.indent) !== null && T !== void 0 ? T : k.indent),
        maxDepth: (M = t == null ? void 0 : t.maxDepth) !== null && M !== void 0 ? M : k.maxDepth,
        maxWidth: (S = t == null ? void 0 : t.maxWidth) !== null && S !== void 0 ? S : k.maxWidth,
        min: (f = t == null ? void 0 : t.min) !== null && f !== void 0 ? f : k.min,
        plugins: (N = t == null ? void 0 : t.plugins) !== null && N !== void 0 ? N : k.plugins,
        printBasicPrototype:
          (v = t == null ? void 0 : t.printBasicPrototype) !== null && v !== void 0 ? v : !0,
        printFunctionName: te(t),
        spacingInner: t?.min
          ? ' '
          : `
`,
        spacingOuter: t?.min
          ? ''
          : `
`,
      };
    };
    function se(t) {
      return new Array(t + 1).join(' ');
    }
    function ae(t, b) {
      if (b && (Q(b), b.plugins)) {
        const M = D(b.plugins, t);
        if (M !== null) return w(M, t, le(b), '', 0, []);
      }
      const T = R(t, te(b), re(b), ne(b));
      return T !== null ? T : C(t, le(b), '', 0, []);
    }
    const ce = {
      AsymmetricMatcher: i.default,
      ConvertAnsi: c.default,
      DOMCollection: _.default,
      DOMElement: p.default,
      Immutable: o.default,
      ReactElement: y.default,
      ReactTestComponent: u.default,
    };
    e.plugins = ce;
    const me = ae;
    e.default = me;
  },
});
const be = Xe(st());
const {
  AsymmetricMatcher: ct,
  DOMCollection: mt,
  DOMElement: dt,
  Immutable: ft,
  ReactElement: pt,
  ReactTestComponent: bt,
} = be.plugins;
const $e = [bt, pt, dt, mt, ft, ct];
const q = W.dim;
const Ce = W.green;
const ve = W.red;
const yt = '·';
function ye(e, r = 10, n = 10) {
  const i = 1e4;
  let c;
  try {
    c = (0, be.format)(e, { maxDepth: r, maxWidth: n, min: !0, plugins: $e });
  } catch {
    c = (0, be.format)(e, { callToJSON: !1, maxDepth: r, maxWidth: n, min: !0, plugins: $e });
  }
  return c.length >= i && r > 1
    ? ye(e, Math.floor(r / 2), n)
    : c.length >= i && n > 1
      ? ye(e, r, Math.floor(n / 2))
      : c;
}
function gt(e) {
  return e.replace(/\s+$/gm, (r) => yt.repeat(r.length));
}
function _t(e) {
  return ve(gt(ye(e)));
}
function Et(e, r = 'received', n = 'expected', i = {}) {
  const {
    comment: c = '',
    expectedColor: _ = Ce,
    isDirectExpectCall: p = !1,
    isNot: o = !1,
    promise: y = '',
    receivedColor: u = ve,
    secondArgument: m = '',
    secondArgumentColor: s = Ce,
  } = i;
  let l = '';
  let a = 'expect';
  return (
    !p && r !== '' && ((l += q(`${a}(`) + u(r)), (a = ')')),
    y !== '' && ((l += q(`${a}.`) + y), (a = '')),
    o && ((l += `${q(`${a}.`)}not`), (a = '')),
    e.includes('.') ? (a += e) : ((l += q(`${a}.`) + e), (a = '')),
    n === '' ? (a += '()') : ((l += q(`${a}(`) + _(n)), m && (l += q(', ') + s(m)), (a = ')')),
    c !== '' && (a += ` // ${c}`),
    a !== '' && (l += q(a)),
    l
  );
}
function Ot(e) {
  if (typeof e.violations > 'u') throw new Error('No violations found in aXe results object');
  const r = ht(e.violations, e.toolOptions ? e.toolOptions.impactLevels : []);
  function n(p) {
    if (p.length === 0) return [];
    const o = `

`;
    return p
      .map((y) =>
        y.nodes
          .map(
            (u) =>
              `Expected the HTML found at $('${u.target.join(', ')}') to have no violations:${o}${W.grey(u.html)}${o}Received:${o}${_t(`${y.help} (${y.id})`)}${o}${W.yellow(u.failureSummary)}${o}${
                y.helpUrl
                  ? `You can find more information on this issue here: 
${W.blue(y.helpUrl)}`
                  : ''
              }`
          )
          .join(o)
      )
      .join(`${o}────────${o}`);
  }
  const i = n(r);
  const c = i.length === 0;
  function _() {
    if (!c)
      return `${Et('.toHaveNoViolations')}

${i}`;
  }
  return { actual: r, message: _, pass: c };
}
function ht(e, r) {
  return r && r.length > 0 ? e.filter((n) => r.includes(n.impact)) : e;
}
export { Ot as toHaveNoViolations };
