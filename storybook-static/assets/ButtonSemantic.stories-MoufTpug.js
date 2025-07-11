import { B as t } from './Button-B50RvQza.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './index-DuwuiYca.js';
import './iframe-Cy2I62ob.js';
import './utils-DuMXYCiK.js';
const { fn: V } = __STORYBOOK_MODULE_TEST__,
  M = {
    title: '03 Components/Action/Button/Semantic Variants',
    component: t,
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component:
            'Semantic button variants that communicate specific meaning and context through carefully chosen colors and styling.',
        },
      },
    },
    tags: ['autodocs'],
    args: { onClick: V() },
  },
  n = {
    args: { variant: 'success', children: 'Save Changes' },
    parameters: {
      docs: {
        description: {
          story:
            'Success buttons communicate positive outcomes and completion. Use for actions that result in successful states like saving, completing, or approving.',
        },
      },
    },
  },
  s = {
    args: { variant: 'warning', children: 'Proceed Anyway' },
    parameters: {
      docs: {
        description: {
          story:
            'Warning buttons signal actions that require attention or caution. Use for actions that might have unexpected consequences but are still permissible.',
        },
      },
    },
  },
  a = {
    args: { variant: 'info', children: 'Learn More' },
    parameters: {
      docs: {
        description: {
          story:
            'Info buttons provide neutral, helpful information or optional actions. Use for educational content, help resources, or supplementary features.',
        },
      },
    },
  },
  r = {
    args: { variant: 'destructive', children: 'Delete Account' },
    parameters: {
      docs: {
        description: {
          story:
            'Destructive buttons in semantic contexts emphasize the permanent nature of critical actions. Use for data deletion, account removal, or other irreversible operations.',
        },
      },
    },
  },
  i = {
    render: () =>
      e.jsxs('div', {
        className: 'space-y-8 p-4',
        children: [
          e.jsxs('div', {
            className: 'space-y-4',
            children: [
              e.jsx('h3', {
                className: 'text-lg font-medium',
                children: 'Form Validation Context',
              }),
              e.jsxs('div', {
                className: 'p-4 bg-muted/30 rounded border space-y-3',
                children: [
                  e.jsx('div', {
                    className: 'text-sm text-muted-foreground',
                    children: 'Form validation with semantic feedback buttons',
                  }),
                  e.jsxs('div', {
                    className: 'flex gap-3',
                    children: [
                      e.jsx(t, { variant: 'success', children: 'Validation Passed' }),
                      e.jsx(t, { variant: 'warning', children: 'Review Required' }),
                      e.jsx(t, { variant: 'info', children: '? Get Help' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-4',
            children: [
              e.jsx('h3', { className: 'text-lg font-medium', children: 'System Status Context' }),
              e.jsxs('div', {
                className: 'p-4 bg-muted/30 rounded border space-y-3',
                children: [
                  e.jsx('div', {
                    className: 'text-sm text-muted-foreground',
                    children: 'System status actions with appropriate semantic meaning',
                  }),
                  e.jsxs('div', {
                    className: 'flex gap-3',
                    children: [
                      e.jsx(t, { variant: 'success', children: 'Deploy Now' }),
                      e.jsx(t, { variant: 'warning', children: 'Deploy with Warnings' }),
                      e.jsx(t, { variant: 'destructive', children: 'Emergency Stop' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-4',
            children: [
              e.jsx('h3', { className: 'text-lg font-medium', children: 'User Action Context' }),
              e.jsxs('div', {
                className: 'p-4 bg-muted/30 rounded border space-y-3',
                children: [
                  e.jsx('div', {
                    className: 'text-sm text-muted-foreground',
                    children: 'User-initiated actions with semantic clarity',
                  }),
                  e.jsxs('div', {
                    className: 'flex gap-3',
                    children: [
                      e.jsx(t, { variant: 'info', children: 'View Tutorial' }),
                      e.jsx(t, { variant: 'warning', children: 'Skip Backup' }),
                      e.jsx(t, { variant: 'destructive', children: 'Delete Data' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    parameters: {
      docs: {
        description: {
          story:
            'Real-world examples showing how semantic button variants work together to create clear, meaningful interfaces across different contexts.',
        },
      },
      layout: 'fullscreen',
    },
  },
  o = {
    render: () =>
      e.jsxs('div', {
        className: 'flex flex-wrap gap-4 p-4',
        children: [
          e.jsx(t, { variant: 'success', children: 'Success Action' }),
          e.jsx(t, { variant: 'warning', children: 'Warning Action' }),
          e.jsx(t, { variant: 'info', children: 'Info Action' }),
          e.jsx(t, { variant: 'destructive', children: 'Destructive Action' }),
        ],
      }),
    parameters: {
      docs: {
        description: {
          story:
            'A side-by-side comparison of all semantic button variants showing their visual hierarchy and contextual meaning.',
        },
      },
    },
  };
var c, d, m, u, l;
n.parameters = {
  ...n.parameters,
  docs: {
    ...((c = n.parameters) == null ? void 0 : c.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'success',
    children: 'Save Changes'
  },
  parameters: {
    docs: {
      description: {
        story: 'Success buttons communicate positive outcomes and completion. Use for actions that result in successful states like saving, completing, or approving.'
      }
    }
  }
}`,
      ...((m = (d = n.parameters) == null ? void 0 : d.docs) == null ? void 0 : m.source),
    },
    description: {
      story: `Positive Outcomes

Success buttons celebrate completion and positive actions.
They confirm when things go well and encourage desired behaviors.`,
      ...((l = (u = n.parameters) == null ? void 0 : u.docs) == null ? void 0 : l.description),
    },
  },
};
var p, v, h, g, f;
s.parameters = {
  ...s.parameters,
  docs: {
    ...((p = s.parameters) == null ? void 0 : p.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'warning',
    children: 'Proceed Anyway'
  },
  parameters: {
    docs: {
      description: {
        story: 'Warning buttons signal actions that require attention or caution. Use for actions that might have unexpected consequences but are still permissible.'
      }
    }
  }
}`,
      ...((h = (v = s.parameters) == null ? void 0 : v.docs) == null ? void 0 : h.source),
    },
    description: {
      story: `Important Cautions

Warning buttons signal actions that require careful consideration.
They create awareness without blocking progress.`,
      ...((f = (g = s.parameters) == null ? void 0 : g.docs) == null ? void 0 : f.description),
    },
  },
};
var x, y, b, w, S;
a.parameters = {
  ...a.parameters,
  docs: {
    ...((x = a.parameters) == null ? void 0 : x.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'info',
    children: 'Learn More'
  },
  parameters: {
    docs: {
      description: {
        story: 'Info buttons provide neutral, helpful information or optional actions. Use for educational content, help resources, or supplementary features.'
      }
    }
  }
}`,
      ...((b = (y = a.parameters) == null ? void 0 : y.docs) == null ? void 0 : b.source),
    },
    description: {
      story: `Neutral Information

Info buttons provide helpful context without urgency.
They guide users toward additional information or optional actions.`,
      ...((S = (w = a.parameters) == null ? void 0 : w.docs) == null ? void 0 : S.description),
    },
  },
};
var N, j, B, A, C;
r.parameters = {
  ...r.parameters,
  docs: {
    ...((N = r.parameters) == null ? void 0 : N.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'destructive',
    children: 'Delete Account'
  },
  parameters: {
    docs: {
      description: {
        story: 'Destructive buttons in semantic contexts emphasize the permanent nature of critical actions. Use for data deletion, account removal, or other irreversible operations.'
      }
    }
  }
}`,
      ...((B = (j = r.parameters) == null ? void 0 : j.docs) == null ? void 0 : B.source),
    },
    description: {
      story: `Critical Actions

Destructive semantic buttons emphasize permanent consequences.
They create deliberate friction for actions that cannot be undone.`,
      ...((C = (A = r.parameters) == null ? void 0 : A.docs) == null ? void 0 : C.description),
    },
  },
};
var D, U, k, I, T;
i.parameters = {
  ...i.parameters,
  docs: {
    ...((D = i.parameters) == null ? void 0 : D.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-8 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Form Validation Context</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            Form validation with semantic feedback buttons
          </div>
          <div className="flex gap-3">
            <Button variant="success">Validation Passed</Button>
            <Button variant="warning">Review Required</Button>
            <Button variant="info">? Get Help</Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">System Status Context</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            System status actions with appropriate semantic meaning
          </div>
          <div className="flex gap-3">
            <Button variant="success">Deploy Now</Button>
            <Button variant="warning">Deploy with Warnings</Button>
            <Button variant="destructive">Emergency Stop</Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">User Action Context</h3>
        <div className="p-4 bg-muted/30 rounded border space-y-3">
          <div className="text-sm text-muted-foreground">
            User-initiated actions with semantic clarity
          </div>
          <div className="flex gap-3">
            <Button variant="info">View Tutorial</Button>
            <Button variant="warning">Skip Backup</Button>
            <Button variant="destructive">Delete Data</Button>
          </div>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples showing how semantic button variants work together to create clear, meaningful interfaces across different contexts.'
      }
    },
    layout: 'fullscreen'
  }
}`,
      ...((k = (U = i.parameters) == null ? void 0 : U.docs) == null ? void 0 : k.source),
    },
    description: {
      story: `Semantic Context Examples

Understanding how semantic variants work together helps create
interfaces that communicate meaning clearly and consistently.`,
      ...((T = (I = i.parameters) == null ? void 0 : I.docs) == null ? void 0 : T.description),
    },
  },
};
var W, q, R, _, E;
o.parameters = {
  ...o.parameters,
  docs: {
    ...((W = o.parameters) == null ? void 0 : W.docs),
    source: {
      originalSource: `{
  render: () => <div className="flex flex-wrap gap-4 p-4">
      <Button variant="success">Success Action</Button>
      <Button variant="warning">Warning Action</Button>
      <Button variant="info">Info Action</Button>
      <Button variant="destructive">Destructive Action</Button>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'A side-by-side comparison of all semantic button variants showing their visual hierarchy and contextual meaning.'
      }
    }
  }
}`,
      ...((R = (q = o.parameters) == null ? void 0 : q.docs) == null ? void 0 : R.source),
    },
    description: {
      story: `Semantic Comparison

Side-by-side comparison helps understand the semantic hierarchy
and appropriate usage patterns for each variant.`,
      ...((E = (_ = o.parameters) == null ? void 0 : _.docs) == null ? void 0 : E.description),
    },
  },
};
const G = [
  'Success',
  'Warning',
  'Info',
  'DestructiveSemantic',
  'SemanticContexts',
  'SemanticComparison',
];
export {
  r as DestructiveSemantic,
  a as Info,
  o as SemanticComparison,
  i as SemanticContexts,
  n as Success,
  s as Warning,
  G as __namedExportsOrder,
  M as default,
};
