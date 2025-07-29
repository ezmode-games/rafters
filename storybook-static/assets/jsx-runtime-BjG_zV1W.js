const o = { exports: {} };
const s = {}; /**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const E = Symbol.for('react.transitional.element');
const n = Symbol.for('react.fragment');
function l(v, r, t) {
  let e = null;
  if ((t !== void 0 && (e = `${t}`), r.key !== void 0 && (e = `${r.key}`), 'key' in r)) {
    t = {};
    for (const x in r) x !== 'key' && (t[x] = r[x]);
  } else t = r;
  return (r = t.ref), { $$typeof: E, type: v, key: e, ref: r !== void 0 ? r : null, props: t };
}
s.Fragment = n;
s.jsx = l;
s.jsxs = l;
o.exports = s;
const u = o.exports;
export { u as j };
