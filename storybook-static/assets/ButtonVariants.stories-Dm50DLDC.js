import { B as e } from './Button-DdyNQfwD.js';
import { j as t } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Bh_nZMRn.js';
const { fn: R } = __STORYBOOK_MODULE_TEST__,
  I = {
    title: '03 Components/Action/Button/Visual Variants',
    component: e,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: { onClick: R() },
  },
  r = {
    args: { variant: 'primary', children: 'Create Account' },
    parameters: {
      docs: {
        description: {
          story:
            'The primary action button uses the strongest visual weight to guide users to the most important action. Reserve for single, critical actions like "Save", "Submit", or "Create".',
        },
      },
    },
  },
  i = {
    args: { variant: 'secondary', children: 'View Details' },
    parameters: {
      docs: {
        description: {
          story:
            'Secondary buttons support primary actions with clear visual hierarchy. Use for important but not critical actions like "View", "Edit", or "Learn More".',
        },
      },
    },
  },
  a = {
    args: { variant: 'destructive', children: 'Delete Project' },
    parameters: {
      docs: {
        description: {
          story:
            'Destructive buttons create deliberate friction for dangerous actions. Use for actions that permanently remove data, cancel important processes, or have significant consequences.',
        },
      },
    },
  },
  n = {
    args: { variant: 'outline', children: 'Add to Cart' },
    parameters: {
      docs: {
        description: {
          story:
            'Outline buttons provide clear boundaries and action areas with minimal visual weight. Ideal for secondary actions that need definition without dominance.',
        },
      },
    },
  },
  o = {
    args: { variant: 'ghost', children: 'Skip for Now' },
    parameters: {
      docs: {
        description: {
          story:
            'Ghost buttons provide the subtlest interaction with minimal visual impact. Perfect for optional actions, navigation, or when you need functionality without visual prominence.',
        },
      },
    },
  },
  s = {
    render: () =>
      t.jsxs('div', {
        className: 'flex flex-wrap gap-4 p-4',
        children: [
          t.jsx(e, { variant: 'primary', children: 'Primary Action' }),
          t.jsx(e, { variant: 'secondary', children: 'Secondary Action' }),
          t.jsx(e, { variant: 'destructive', children: 'Destructive Action' }),
          t.jsx(e, { variant: 'outline', children: 'Outline Action' }),
          t.jsx(e, { variant: 'ghost', children: 'Ghost Action' }),
        ],
      }),
    parameters: {
      docs: {
        description: {
          story:
            'A side-by-side comparison of all button variants showing their visual hierarchy and relative emphasis levels.',
        },
      },
    },
  };
var c, d, p, u, l;
r.parameters = {
  ...r.parameters,
  docs: {
    ...((c = r.parameters) == null ? void 0 : c.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'primary',
    children: 'Create Account'
  },
  parameters: {
    docs: {
      description: {
        story: 'The primary action button uses the strongest visual weight to guide users to the most important action. Reserve for single, critical actions like "Save", "Submit", or "Create".'
      }
    }
  }
}`,
      ...((p = (d = r.parameters) == null ? void 0 : d.docs) == null ? void 0 : p.source),
    },
    description: {
      story: `The Primary Action

The primary button commands attention and guides users toward the most important action.
Use sparingly—only one primary action should be visible per context.`,
      ...((l = (u = r.parameters) == null ? void 0 : u.docs) == null ? void 0 : l.description),
    },
  },
};
var m, h, v, y, g;
i.parameters = {
  ...i.parameters,
  docs: {
    ...((m = i.parameters) == null ? void 0 : m.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'secondary',
    children: 'View Details'
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary buttons support primary actions with clear visual hierarchy. Use for important but not critical actions like "View", "Edit", or "Learn More".'
      }
    }
  }
}`,
      ...((v = (h = i.parameters) == null ? void 0 : h.docs) == null ? void 0 : v.source),
    },
    description: {
      story: `Supporting Actions

Secondary buttons provide clear alternatives without competing with primary actions.
They maintain importance while respecting visual hierarchy.`,
      ...((g = (y = i.parameters) == null ? void 0 : y.docs) == null ? void 0 : g.description),
    },
  },
};
var f, b, w, S, A;
a.parameters = {
  ...a.parameters,
  docs: {
    ...((f = a.parameters) == null ? void 0 : f.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'destructive',
    children: 'Delete Project'
  },
  parameters: {
    docs: {
      description: {
        story: 'Destructive buttons create deliberate friction for dangerous actions. Use for actions that permanently remove data, cancel important processes, or have significant consequences.'
      }
    }
  }
}`,
      ...((w = (b = a.parameters) == null ? void 0 : b.docs) == null ? void 0 : w.source),
    },
    description: {
      story: `Deliberate Friction

Destructive actions require intentional consideration.
The visual treatment creates pause before irreversible actions.`,
      ...((A = (S = a.parameters) == null ? void 0 : S.docs) == null ? void 0 : A.description),
    },
  },
};
var x, B, D, O, C;
n.parameters = {
  ...n.parameters,
  docs: {
    ...((x = n.parameters) == null ? void 0 : x.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'outline',
    children: 'Add to Cart'
  },
  parameters: {
    docs: {
      description: {
        story: 'Outline buttons provide clear boundaries and action areas with minimal visual weight. Ideal for secondary actions that need definition without dominance.'
      }
    }
  }
}`,
      ...((D = (B = n.parameters) == null ? void 0 : B.docs) == null ? void 0 : D.source),
    },
    description: {
      story: `Defined Boundaries

Outline buttons establish clear action areas while maintaining visual lightness.
They provide structure without overwhelming the interface.`,
      ...((C = (O = n.parameters) == null ? void 0 : O.docs) == null ? void 0 : C.description),
    },
  },
};
var T, j, P, V, _;
o.parameters = {
  ...o.parameters,
  docs: {
    ...((T = o.parameters) == null ? void 0 : T.docs),
    source: {
      originalSource: `{
  args: {
    variant: 'ghost',
    children: 'Skip for Now'
  },
  parameters: {
    docs: {
      description: {
        story: 'Ghost buttons provide the subtlest interaction with minimal visual impact. Perfect for optional actions, navigation, or when you need functionality without visual prominence.'
      }
    }
  }
}`,
      ...((P = (j = o.parameters) == null ? void 0 : j.docs) == null ? void 0 : P.source),
    },
    description: {
      story: `Subtle Presence

Ghost buttons blend naturally while remaining discoverable.
They provide functionality without disrupting visual flow.`,
      ...((_ = (V = o.parameters) == null ? void 0 : V.docs) == null ? void 0 : _.description),
    },
  },
};
var k, G, U, E, N;
s.parameters = {
  ...s.parameters,
  docs: {
    ...((k = s.parameters) == null ? void 0 : k.docs),
    source: {
      originalSource: `{
  render: () => <div className="flex flex-wrap gap-4 p-4">
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="destructive">Destructive Action</Button>
      <Button variant="outline">Outline Action</Button>
      <Button variant="ghost">Ghost Action</Button>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'A side-by-side comparison of all button variants showing their visual hierarchy and relative emphasis levels.'
      }
    }
  }
}`,
      ...((U = (G = s.parameters) == null ? void 0 : G.docs) == null ? void 0 : U.source),
    },
    description: {
      story: `Variant Comparison

Understanding the hierarchy and relationship between variants helps create
interfaces that guide users naturally toward their goals.`,
      ...((N = (E = s.parameters) == null ? void 0 : E.docs) == null ? void 0 : N.description),
    },
  },
};
const F = ['Primary', 'Secondary', 'Destructive', 'Outline', 'Ghost', 'VariantComparison'];
export {
  a as Destructive,
  o as Ghost,
  n as Outline,
  r as Primary,
  i as Secondary,
  s as VariantComparison,
  F as __namedExportsOrder,
  I as default,
};
