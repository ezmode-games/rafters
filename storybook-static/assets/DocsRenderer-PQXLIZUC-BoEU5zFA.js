const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f || (m.f = ['./index-BNJdjGkk.js', './iframe-Bh_nZMRn.js', './iframe-Bbfr82Jm.css'])
) => i.map((i) => d[i]);
import { A as E, a as d, H as h, D as x } from './blocks-CZp0A3dp.js';
import { _ as c, r as p, e as t } from './iframe-Bh_nZMRn.js';
import { renderElement as l, unmountElement as u } from './react-18-y9SQTerH.js';
import './index-BOc3uOBL.js';
import './jsx-runtime-BjG_zV1W.js';
var D = { code: d, a: E, ...h },
  _ = class extends p.Component {
    constructor() {
      super(...arguments), (this.state = { hasError: !1 });
    }
    static getDerivedStateFromError() {
      return { hasError: !0 };
    }
    componentDidCatch(r) {
      const { showException: e } = this.props;
      e(r);
    }
    render() {
      const { hasError: r } = this.state,
        { children: e } = this.props;
      return r ? null : t.createElement(t.Fragment, null, e);
    }
  },
  C = class {
    constructor() {
      (this.render = async (r, e, n) => {
        const s = { ...D, ...(e == null ? void 0 : e.components) },
          a = x;
        return new Promise((i, m) => {
          c(
            async () => {
              const { MDXProvider: o } = await import('./index-BNJdjGkk.js');
              return { MDXProvider: o };
            },
            __vite__mapDeps([0, 1, 2]),
            import.meta.url
          )
            .then(({ MDXProvider: o }) =>
              l(
                t.createElement(
                  _,
                  { showException: m, key: Math.random() },
                  t.createElement(
                    o,
                    { components: s },
                    t.createElement(a, { context: r, docsParameter: e })
                  )
                ),
                n
              )
            )
            .then(() => i());
        });
      }),
        (this.unmount = (r) => {
          u(r);
        });
    }
  };
export { C as DocsRenderer, D as defaultComponents };
