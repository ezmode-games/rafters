import { S as a, c, b as l, a as r, d as t } from './Select-BQoa9TWO.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Cy2I62ob.js';
import './index-Cox8WoOv.js';
import './index-DYn9WTcg.js';
import './index-BB5JR4LJ.js';
import './index-DuwuiYca.js';
import './index-DoQPmrLJ.js';
import './index-LIN26vHB.js';
import './utils-DuMXYCiK.js';
const { fn: A } = __STORYBOOK_MODULE_TEST__,
  Y = {
    title: '03 Components/Form/Select/Visual Variants',
    component: a,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
    args: { onValueChange: A() },
  },
  s = {
    render: () =>
      e.jsx('div', {
        className: 'w-64',
        children: e.jsxs(a, {
          children: [
            e.jsx(r, { children: e.jsx(l, { placeholder: 'Choose an option' }) }),
            e.jsxs(c, {
              children: [
                e.jsx(t, { value: 'option1', children: 'Standard Option 1' }),
                e.jsx(t, { value: 'option2', children: 'Standard Option 2' }),
                e.jsx(t, { value: 'option3', children: 'Standard Option 3' }),
              ],
            }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: {
          story:
            'The default select variant provides clean, balanced presentation suitable for most form contexts and interface layouts.',
        },
      },
    },
  },
  i = {
    render: () =>
      e.jsx('div', {
        className: 'w-64',
        children: e.jsxs(a, {
          children: [
            e.jsx(r, { size: 'large', children: e.jsx(l, { placeholder: 'Enhanced for touch' }) }),
            e.jsxs(c, {
              children: [
                e.jsx(t, { value: 'large1', children: 'Large Interface Option 1' }),
                e.jsx(t, { value: 'large2', children: 'Large Interface Option 2' }),
                e.jsx(t, { value: 'large3', children: 'Large Interface Option 3' }),
              ],
            }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: {
          story:
            'Large variant with enhanced touch targets (44px minimum) for improved motor accessibility and mobile interface usability.',
        },
      },
    },
  },
  n = {
    render: () =>
      e.jsx('div', {
        className: 'w-64',
        children: e.jsxs(a, {
          children: [
            e.jsx(r, {
              showCount: !0,
              itemCount: 8,
              children: e.jsx(l, { placeholder: 'Options with count' }),
            }),
            e.jsxs(c, {
              children: [
                e.jsx(t, { value: 'count1', children: 'Counted Option 1' }),
                e.jsx(t, { value: 'count2', children: 'Counted Option 2' }),
                e.jsx(t, { value: 'count3', children: 'Counted Option 3' }),
                e.jsx(t, { value: 'count4', children: 'Counted Option 4' }),
                e.jsx(t, { value: 'count5', children: 'Counted Option 5' }),
                e.jsx(t, { value: 'count6', children: 'Counted Option 6' }),
                e.jsx(t, { value: 'count7', children: 'Counted Option 7' }),
                e.jsx(t, { value: 'count8', children: 'Counted Option 8' }),
              ],
            }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: {
          story:
            'Choice architecture variant showing item count to reduce cognitive load by setting clear expectations about available options.',
        },
      },
    },
  },
  o = {
    render: () =>
      e.jsx('div', {
        className: 'w-64',
        children: e.jsxs(a, {
          children: [
            e.jsx(r, {
              showCount: !0,
              itemCount: 12,
              children: e.jsx(l, { placeholder: 'Search through options' }),
            }),
            e.jsxs(c, {
              searchable: !0,
              searchPlaceholder: 'Filter options...',
              children: [
                e.jsx(t, { value: 'search1', children: 'Searchable Option Alpha' }),
                e.jsx(t, { value: 'search2', children: 'Searchable Option Beta' }),
                e.jsx(t, { value: 'search3', children: 'Searchable Option Gamma' }),
                e.jsx(t, { value: 'search4', children: 'Searchable Option Delta' }),
                e.jsx(t, { value: 'search5', children: 'Searchable Option Epsilon' }),
                e.jsx(t, { value: 'search6', children: 'Searchable Option Zeta' }),
                e.jsx(t, { value: 'search7', children: 'Searchable Option Eta' }),
                e.jsx(t, { value: 'search8', children: 'Searchable Option Theta' }),
                e.jsx(t, { value: 'search9', children: 'Searchable Option Iota' }),
                e.jsx(t, { value: 'search10', children: 'Searchable Option Kappa' }),
                e.jsx(t, { value: 'search11', children: 'Searchable Option Lambda' }),
                e.jsx(t, { value: 'search12', children: 'Searchable Option Mu' }),
              ],
            }),
          ],
        }),
      }),
    parameters: {
      docs: {
        description: {
          story:
            'Searchable variant with progressive disclosure for large option sets, reducing cognitive load through filtering capabilities.',
        },
      },
    },
  },
  d = {
    render: () =>
      e.jsxs('div', {
        className: 'space-y-6 p-4',
        children: [
          e.jsxs('div', {
            className: 'space-y-4',
            children: [
              e.jsx('h3', { className: 'text-lg font-medium', children: 'Validation States' }),
              e.jsx('p', {
                className: 'text-sm text-muted-foreground',
                children:
                  'Different visual states communicate validation status and guide user interaction.',
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'grid gap-6 max-w-sm',
            children: [
              e.jsxs('div', {
                className: 'space-y-2',
                children: [
                  e.jsx('label', {
                    className: 'text-sm font-medium text-muted-foreground',
                    children: 'Default State',
                  }),
                  e.jsxs(a, {
                    children: [
                      e.jsx(r, { children: e.jsx(l, { placeholder: 'Default appearance' }) }),
                      e.jsxs(c, {
                        children: [
                          e.jsx(t, { value: 'default1', children: 'Default Option 1' }),
                          e.jsx(t, { value: 'default2', children: 'Default Option 2' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-2',
                children: [
                  e.jsx('label', {
                    className: 'text-sm font-medium text-destructive',
                    children: 'Error State',
                  }),
                  e.jsxs(a, {
                    children: [
                      e.jsx(r, {
                        className: 'border-destructive focus:ring-destructive',
                        'aria-invalid': 'true',
                        children: e.jsx(l, { placeholder: 'Error appearance' }),
                      }),
                      e.jsxs(c, {
                        children: [
                          e.jsx(t, { value: 'error1', children: 'Error Option 1' }),
                          e.jsx(t, { value: 'error2', children: 'Error Option 2' }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx('p', {
                    className: 'text-xs text-destructive',
                    children: 'Please select a valid option',
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-2',
                children: [
                  e.jsx('label', {
                    className: 'text-sm font-medium opacity-disabled',
                    children: 'Disabled State',
                  }),
                  e.jsxs(a, {
                    disabled: !0,
                    children: [
                      e.jsx(r, { children: e.jsx(l, { placeholder: 'Disabled appearance' }) }),
                      e.jsxs(c, {
                        children: [
                          e.jsx(t, { value: 'disabled1', children: 'Disabled Option 1' }),
                          e.jsx(t, { value: 'disabled2', children: 'Disabled Option 2' }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx('p', {
                    className: 'text-xs text-muted-foreground',
                    children: 'This selection is currently unavailable',
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
            'Visual variants showing different validation states including default, error, and disabled appearances with appropriate semantic styling.',
        },
      },
    },
  };
var u, p, m, h, S;
s.parameters = {
  ...s.parameters,
  docs: {
    ...((u = s.parameters) == null ? void 0 : u.docs),
    source: {
      originalSource: `{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Standard Option 1</SelectItem>
          <SelectItem value="option2">Standard Option 2</SelectItem>
          <SelectItem value="option3">Standard Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'The default select variant provides clean, balanced presentation suitable for most form contexts and interface layouts.'
      }
    }
  }
}`,
      ...((m = (p = s.parameters) == null ? void 0 : p.docs) == null ? void 0 : m.source),
    },
    description: {
      story: `Standard Selection

The default select provides balanced visual weight for most interface contexts.
Clean presentation focuses attention on available choices.`,
      ...((S = (h = s.parameters) == null ? void 0 : h.docs) == null ? void 0 : S.description),
    },
  },
};
var v, x, g, b, f;
i.parameters = {
  ...i.parameters,
  docs: {
    ...((v = i.parameters) == null ? void 0 : v.docs),
    source: {
      originalSource: `{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger size="large">
          <SelectValue placeholder="Enhanced for touch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="large1">Large Interface Option 1</SelectItem>
          <SelectItem value="large2">Large Interface Option 2</SelectItem>
          <SelectItem value="large3">Large Interface Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Large variant with enhanced touch targets (44px minimum) for improved motor accessibility and mobile interface usability.'
      }
    }
  }
}`,
      ...((g = (x = i.parameters) == null ? void 0 : x.docs) == null ? void 0 : g.source),
    },
    description: {
      story: `Enhanced Touch Interface

Large variant improves motor accessibility with enhanced touch targets.
Better usability for mobile interfaces and users with motor difficulties.`,
      ...((f = (b = i.parameters) == null ? void 0 : b.docs) == null ? void 0 : f.description),
    },
  },
};
var j, I, O, C, y;
n.parameters = {
  ...n.parameters,
  docs: {
    ...((j = n.parameters) == null ? void 0 : j.docs),
    source: {
      originalSource: `{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger showCount itemCount={8}>
          <SelectValue placeholder="Options with count" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="count1">Counted Option 1</SelectItem>
          <SelectItem value="count2">Counted Option 2</SelectItem>
          <SelectItem value="count3">Counted Option 3</SelectItem>
          <SelectItem value="count4">Counted Option 4</SelectItem>
          <SelectItem value="count5">Counted Option 5</SelectItem>
          <SelectItem value="count6">Counted Option 6</SelectItem>
          <SelectItem value="count7">Counted Option 7</SelectItem>
          <SelectItem value="count8">Counted Option 8</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Choice architecture variant showing item count to reduce cognitive load by setting clear expectations about available options.'
      }
    }
  }
}`,
      ...((O = (I = n.parameters) == null ? void 0 : I.docs) == null ? void 0 : O.source),
    },
    description: {
      story: `Choice Architecture

Item count display helps users understand the scope of available options.
Cognitive load reduction through clear expectation setting.`,
      ...((y = (C = n.parameters) == null ? void 0 : C.docs) == null ? void 0 : y.description),
    },
  },
};
var N, w, T, D, E;
o.parameters = {
  ...o.parameters,
  docs: {
    ...((N = o.parameters) == null ? void 0 : N.docs),
    source: {
      originalSource: `{
  render: () => <div className="w-64">
      <Select>
        <SelectTrigger showCount itemCount={12}>
          <SelectValue placeholder="Search through options" />
        </SelectTrigger>
        <SelectContent searchable searchPlaceholder="Filter options...">
          <SelectItem value="search1">Searchable Option Alpha</SelectItem>
          <SelectItem value="search2">Searchable Option Beta</SelectItem>
          <SelectItem value="search3">Searchable Option Gamma</SelectItem>
          <SelectItem value="search4">Searchable Option Delta</SelectItem>
          <SelectItem value="search5">Searchable Option Epsilon</SelectItem>
          <SelectItem value="search6">Searchable Option Zeta</SelectItem>
          <SelectItem value="search7">Searchable Option Eta</SelectItem>
          <SelectItem value="search8">Searchable Option Theta</SelectItem>
          <SelectItem value="search9">Searchable Option Iota</SelectItem>
          <SelectItem value="search10">Searchable Option Kappa</SelectItem>
          <SelectItem value="search11">Searchable Option Lambda</SelectItem>
          <SelectItem value="search12">Searchable Option Mu</SelectItem>
        </SelectContent>
      </Select>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Searchable variant with progressive disclosure for large option sets, reducing cognitive load through filtering capabilities.'
      }
    }
  }
}`,
      ...((T = (w = o.parameters) == null ? void 0 : w.docs) == null ? void 0 : T.source),
    },
    description: {
      story: `Progressive Disclosure

Search capability for managing large option sets effectively.
Reduces cognitive burden when dealing with numerous choices.`,
      ...((E = (D = o.parameters) == null ? void 0 : D.docs) == null ? void 0 : E.description),
    },
  },
};
var V, L, _, P, B;
d.parameters = {
  ...d.parameters,
  docs: {
    ...((V = d.parameters) == null ? void 0 : V.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Validation States</h3>
        <p className="text-sm text-muted-foreground">
          Different visual states communicate validation status and guide user interaction.
        </p>
      </div>

      <div className="grid gap-6 max-w-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Default State</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Default appearance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default1">Default Option 1</SelectItem>
              <SelectItem value="default2">Default Option 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-destructive">Error State</label>
          <Select>
            <SelectTrigger className="border-destructive focus:ring-destructive" aria-invalid="true">
              <SelectValue placeholder="Error appearance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="error1">Error Option 1</SelectItem>
              <SelectItem value="error2">Error Option 2</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-destructive">Please select a valid option</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium opacity-disabled">Disabled State</label>
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="Disabled appearance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disabled1">Disabled Option 1</SelectItem>
              <SelectItem value="disabled2">Disabled Option 2</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">This selection is currently unavailable</p>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Visual variants showing different validation states including default, error, and disabled appearances with appropriate semantic styling.'
      }
    }
  }
}`,
      ...((_ = (L = d.parameters) == null ? void 0 : L.docs) == null ? void 0 : _.source),
    },
    description: {
      story: `Validation States

Visual feedback for different validation states and user input scenarios.
Clear communication through semantic styling.`,
      ...((B = (P = d.parameters) == null ? void 0 : P.docs) == null ? void 0 : B.description),
    },
  },
};
const q = ['Default', 'Large', 'WithCount', 'Searchable', 'ValidationStates'];
export {
  s as Default,
  i as Large,
  o as Searchable,
  d as ValidationStates,
  n as WithCount,
  q as __namedExportsOrder,
  Y as default,
};
