import {
  g as E,
  f as b,
  c as h,
  S as l,
  a as m,
  d as s,
  b as u,
  e as v,
} from './Select-BQoa9TWO.js';
import { r as p } from './iframe-Cy2I62ob.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './index-Cox8WoOv.js';
import './index-DYn9WTcg.js';
import './index-BB5JR4LJ.js';
import './index-DuwuiYca.js';
import './index-DoQPmrLJ.js';
import './index-LIN26vHB.js';
import './utils-DuMXYCiK.js';
const J = {
  title: '03 Components/Forms/Select/Intelligence',
  component: l,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
const i = {
  render: () => {
    const [t, c] = p.useState('');
    const o = [
      'United States',
      'Canada',
      'United Kingdom',
      'Australia',
      'Germany',
      'France',
      'Japan',
      'Brazil',
      'India',
      'China',
      'Mexico',
      'Spain',
    ];
    return e.jsxs('div', {
      className: 'space-y-6 p-6 max-w-md',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Choice Architecture Optimization',
            }),
            e.jsx('p', {
              className: 'text-sm text-gray-600 mb-6',
              children: 'Cognitive load awareness through item counting and progressive disclosure',
            }),
          ],
        }),
        e.jsx('div', {
          className: 'space-y-4',
          children: e.jsxs('div', {
            children: [
              e.jsx('label', {
                htmlFor: 'country',
                className: 'block text-sm font-medium mb-2',
                children: 'Country',
              }),
              e.jsxs(l, {
                value: t,
                onValueChange: c,
                children: [
                  e.jsx(m, {
                    id: 'country',
                    showCount: !0,
                    itemCount: o.length,
                    className: 'w-full',
                    children: e.jsx(u, { placeholder: 'Select your country' }),
                  }),
                  e.jsx(h, {
                    searchable: o.length > 8,
                    children: o.map((r) => e.jsx(s, { value: r.toLowerCase(), children: r }, r)),
                  }),
                ],
              }),
              e.jsx('p', {
                className: 'text-xs text-gray-500 mt-1',
                children: 'Shows item count to set expectations and enables search for large lists',
              }),
            ],
          }),
        }),
      ],
    });
  },
};
const n = {
  render: () => {
    let g;
    let S;
    const [t, c] = p.useState('');
    const [o, r] = p.useState('');
    const x = {
      electronics: {
        label: 'Electronics',
        items: ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Camera', 'Smart Watch'],
      },
      clothing: {
        label: 'Clothing',
        items: ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes', 'Hat'],
      },
      books: {
        label: 'Books',
        items: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children'],
      },
    };
    return e.jsxs('div', {
      className: 'space-y-6 p-6 max-w-md',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Progressive Disclosure',
            }),
            e.jsx('p', {
              className: 'text-sm text-gray-600 mb-6',
              children: 'Search functionality for large option sets reduces cognitive overhead',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-4',
          children: [
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  htmlFor: 'category',
                  className: 'block text-sm font-medium mb-2',
                  children: 'Category',
                }),
                e.jsxs(l, {
                  value: t,
                  onValueChange: c,
                  children: [
                    e.jsx(m, {
                      id: 'category',
                      className: 'w-full',
                      children: e.jsx(u, { placeholder: 'Choose category' }),
                    }),
                    e.jsx(h, {
                      children: Object.entries(x).map(([a, V]) =>
                        e.jsx(s, { value: a, children: V.label }, a)
                      ),
                    }),
                  ],
                }),
              ],
            }),
            t &&
              e.jsxs('div', {
                children: [
                  e.jsx('label', {
                    htmlFor: 'product',
                    className: 'block text-sm font-medium mb-2',
                    children: 'Product',
                  }),
                  e.jsxs(l, {
                    value: o,
                    onValueChange: r,
                    children: [
                      e.jsx(m, {
                        id: 'product',
                        className: 'w-full',
                        showCount: !0,
                        itemCount: (g = x[t]) == null ? void 0 : g.items.length,
                        children: e.jsx(u, { placeholder: 'Choose product' }),
                      }),
                      e.jsx(h, {
                        searchable: !0,
                        searchPlaceholder: 'Search products...',
                        children:
                          (S = x[t]) == null
                            ? void 0
                            : S.items.map((a) =>
                                e.jsx(s, { value: a.toLowerCase(), children: a }, a)
                              ),
                      }),
                    ],
                  }),
                ],
              }),
          ],
        }),
      ],
    });
  },
};
const d = {
  render: () => {
    const [t, c] = p.useState('');
    return e.jsxs('div', {
      className: 'space-y-6 p-6 max-w-md',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Enhanced Item Context',
            }),
            e.jsx('p', {
              className: 'text-sm text-gray-600 mb-6',
              children: 'Descriptions and shortcuts provide additional context for complex choices',
            }),
          ],
        }),
        e.jsx('div', {
          className: 'space-y-4',
          children: e.jsxs('div', {
            children: [
              e.jsx('label', {
                htmlFor: 'action',
                className: 'block text-sm font-medium mb-2',
                children: 'Choose Action',
              }),
              e.jsxs(l, {
                value: t,
                onValueChange: c,
                children: [
                  e.jsx(m, {
                    id: 'action',
                    size: 'large',
                    className: 'w-full',
                    children: e.jsx(u, { placeholder: 'Select an action' }),
                  }),
                  e.jsxs(h, {
                    children: [
                      e.jsxs(v, {
                        children: [
                          e.jsx(b, { children: 'File Operations' }),
                          e.jsx(s, {
                            value: 'save',
                            description: 'Save current document to disk',
                            shortcut: '⌘S',
                            children: 'Save File',
                          }),
                          e.jsx(s, {
                            value: 'open',
                            description: 'Open existing document',
                            shortcut: '⌘O',
                            children: 'Open File',
                          }),
                          e.jsx(s, {
                            value: 'export',
                            description: 'Export in various formats',
                            shortcut: '⌘E',
                            children: 'Export',
                          }),
                        ],
                      }),
                      e.jsx(E, {}),
                      e.jsxs(v, {
                        children: [
                          e.jsx(b, { children: 'Edit Operations' }),
                          e.jsx(s, {
                            value: 'copy',
                            description: 'Copy selection to clipboard',
                            shortcut: '⌘C',
                            children: 'Copy',
                          }),
                          e.jsx(s, {
                            value: 'paste',
                            description: 'Paste from clipboard',
                            shortcut: '⌘V',
                            children: 'Paste',
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx('p', {
                className: 'text-xs text-gray-500 mt-1',
                children:
                  'Enhanced touch targets and contextual information for better decision making',
              }),
            ],
          }),
        }),
      ],
    });
  },
};
let y;
let C;
let j;
i.parameters = {
  ...i.parameters,
  docs: {
    ...((y = i.parameters) == null ? void 0 : y.docs),
    source: {
      originalSource: `{
  render: () => {
    const [value, setValue] = useState('');
    const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'India', 'China', 'Mexico', 'Spain'];
    return <div className="space-y-6 p-6 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Choice Architecture Optimization</h3>
          <p className="text-sm text-gray-600 mb-6">
            Cognitive load awareness through item counting and progressive disclosure
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              Country
            </label>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger id="country" showCount={true} itemCount={countries.length} className="w-full">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent searchable={countries.length > 8}>
                {countries.map(country => <SelectItem key={country} value={country.toLowerCase()}>
                    {country}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Shows item count to set expectations and enables search for large lists
            </p>
          </div>
        </div>
      </div>;
  }
}`,
      ...((j = (C = i.parameters) == null ? void 0 : C.docs) == null ? void 0 : j.source),
    },
  },
};
let f;
let N;
let w;
n.parameters = {
  ...n.parameters,
  docs: {
    ...((f = n.parameters) == null ? void 0 : f.docs),
    source: {
      originalSource: `{
  render: () => {
    const [category, setCategory] = useState('');
    const [product, setProduct] = useState('');
    const categories = {
      'electronics': {
        label: 'Electronics',
        items: ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Camera', 'Smart Watch']
      },
      'clothing': {
        label: 'Clothing',
        items: ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes', 'Hat']
      },
      'books': {
        label: 'Books',
        items: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Children']
      }
    };
    return <div className="space-y-6 p-6 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Progressive Disclosure</h3>
          <p className="text-sm text-gray-600 mb-6">
            Search functionality for large option sets reduces cognitive overhead
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categories).map(([key, cat]) => <SelectItem key={key} value={key}>
                    {cat.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {category && <div>
              <label htmlFor="product" className="block text-sm font-medium mb-2">
                Product
              </label>
              <Select value={product} onValueChange={setProduct}>
                <SelectTrigger id="product" className="w-full" showCount={true} itemCount={categories[category as keyof typeof categories]?.items.length}>
                  <SelectValue placeholder="Choose product" />
                </SelectTrigger>
                <SelectContent searchable={true} searchPlaceholder="Search products...">
                  {categories[category as keyof typeof categories]?.items.map(item => <SelectItem key={item} value={item.toLowerCase()}>
                      {item}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>}
        </div>
      </div>;
  }
}`,
      ...((w = (N = n.parameters) == null ? void 0 : N.docs) == null ? void 0 : w.source),
    },
  },
};
let I;
let k;
let F;
d.parameters = {
  ...d.parameters,
  docs: {
    ...((I = d.parameters) == null ? void 0 : I.docs),
    source: {
      originalSource: `{
  render: () => {
    const [action, setAction] = useState('');
    return <div className="space-y-6 p-6 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Enhanced Item Context</h3>
          <p className="text-sm text-gray-600 mb-6">
            Descriptions and shortcuts provide additional context for complex choices
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="action" className="block text-sm font-medium mb-2">
              Choose Action
            </label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="action" size="large" className="w-full">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>File Operations</SelectLabel>
                  <SelectItem value="save" description="Save current document to disk" shortcut="⌘S">
                    Save File
                  </SelectItem>
                  <SelectItem value="open" description="Open existing document" shortcut="⌘O">
                    Open File
                  </SelectItem>
                  <SelectItem value="export" description="Export in various formats" shortcut="⌘E">
                    Export
                  </SelectItem>
                </SelectGroup>
                
                <SelectSeparator />
                
                <SelectGroup>
                  <SelectLabel>Edit Operations</SelectLabel>
                  <SelectItem value="copy" description="Copy selection to clipboard" shortcut="⌘C">
                    Copy
                  </SelectItem>
                  <SelectItem value="paste" description="Paste from clipboard" shortcut="⌘V">
                    Paste
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Enhanced touch targets and contextual information for better decision making
            </p>
          </div>
        </div>
      </div>;
  }
}`,
      ...((F = (k = d.parameters) == null ? void 0 : k.docs) == null ? void 0 : F.source),
    },
  },
};
const U = ['ChoiceArchitecture', 'ProgressiveDisclosure', 'InteractionIntelligence'];
export {
  i as ChoiceArchitecture,
  d as InteractionIntelligence,
  n as ProgressiveDisclosure,
  U as __namedExportsOrder,
  J as default,
};
