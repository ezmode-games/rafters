import { B as a } from './Button-B50RvQza.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './index-DuwuiYca.js';
import './iframe-Cy2I62ob.js';
import './utils-DuMXYCiK.js';
const B = {
  title: '03 Components/Action/Button/Intelligence',
  component: a,
  parameters: { layout: 'centered' },
};
const r = { args: { loading: !0, children: 'Processing...' } };
const t = { args: { variant: 'destructive', destructiveConfirm: !0, children: 'Delete Item' } };
const n = {
  render: () =>
    e.jsxs('div', {
      className: 'flex items-center gap-4',
      children: [
        e.jsx(a, { size: 'sm', variant: 'ghost', children: 'Cancel' }),
        e.jsx(a, { size: 'md', variant: 'secondary', children: 'Save Draft' }),
        e.jsx(a, { size: 'lg', variant: 'primary', children: 'Publish Now' }),
      ],
    }),
};
let s;
let o;
let i;
r.parameters = {
  ...r.parameters,
  docs: {
    ...((s = r.parameters) == null ? void 0 : s.docs),
    source: {
      originalSource: `{
  args: {
    loading: true,
    children: 'Processing...'
  }
}`,
      ...((i = (o = r.parameters) == null ? void 0 : o.docs) == null ? void 0 : i.source),
    },
  },
};
let c;
let m;
let d;
t.parameters = {
  ...t.parameters,
  docs: {
    ...((c = t.parameters) == null ? void 0 : c.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'destructive',
    destructiveConfirm: true,
    children: 'Delete Item'
  }
}`,
      ...((d = (m = t.parameters) == null ? void 0 : m.docs) == null ? void 0 : d.source),
    },
  },
};
let u;
let l;
let p;
n.parameters = {
  ...n.parameters,
  docs: {
    ...((u = n.parameters) == null ? void 0 : u.docs),
    source: {
      originalSource: `{
  render: () => <div className="flex items-center gap-4">
      <Button size="sm" variant="ghost">Cancel</Button>
      <Button size="md" variant="secondary">Save Draft</Button>
      <Button size="lg" variant="primary">Publish Now</Button>
    </div>
}`,
      ...((p = (l = n.parameters) == null ? void 0 : l.docs) == null ? void 0 : p.source),
    },
  },
};
const y = ['LoadingState', 'DestructiveConfirm', 'AttentionHierarchy'];
export {
  n as AttentionHierarchy,
  t as DestructiveConfirm,
  r as LoadingState,
  y as __namedExportsOrder,
  B as default,
};
