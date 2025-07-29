import { r as n } from './iframe-Cy2I62ob.js';
import { r as c } from './index-Cox8WoOv.js';
import { c as f } from './index-DuwuiYca.js';
import { j as u } from './jsx-runtime-BjG_zV1W.js';
const l = [
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
];
const E = l.reduce((t, r) => {
  const o = f(`Primitive.${r}`);
  const i = n.forwardRef((s, e) => {
    const { asChild: a, ...m } = s;
    const p = a ? o : r;
    return typeof window < 'u' && (window[Symbol.for('radix-ui')] = !0), u.jsx(p, { ...m, ref: e });
  });
  return (i.displayName = `Primitive.${r}`), { ...t, [r]: i };
}, {});
function w(t, r) {
  t && c.flushSync(() => t.dispatchEvent(r));
}
export { E as P, w as d };
