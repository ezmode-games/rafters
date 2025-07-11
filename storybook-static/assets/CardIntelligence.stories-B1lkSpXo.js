import { B as c } from './Button-B50RvQza.js';
import { a, e as d, d as i, c as n, b as s, C as t } from './Card-IR7pq_R3.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Cy2I62ob.js';
import './utils-DuMXYCiK.js';
import './index-DuwuiYca.js';
const S = {
    title: '03 Components/Layout/Card/Intelligence',
    component: t,
    parameters: { layout: 'centered' },
    tags: ['autodocs'],
  },
  o = {
    render: () =>
      e.jsxs('div', {
        className: 'space-y-6 p-6 max-w-2xl',
        children: [
          e.jsxs('div', {
            children: [
              e.jsx('h3', {
                className: 'text-lg font-semibold mb-4',
                children: 'Information Hierarchy Optimization',
              }),
              e.jsx('p', {
                className: 'text-sm text-gray-600 mb-6',
                children:
                  'Semantic heading levels and visual weight create clear content hierarchy',
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
            children: [
              e.jsxs(t, {
                prominence: 'elevated',
                children: [
                  e.jsxs(a, {
                    density: 'comfortable',
                    children: [
                      e.jsx(s, { level: 2, weight: 'semibold', children: 'Primary Feature' }),
                      e.jsx(n, {
                        prominence: 'default',
                        children:
                          'Most important content gets highest visual weight and semantic priority',
                      }),
                    ],
                  }),
                  e.jsx(i, {
                    density: 'comfortable',
                    children: e.jsx('p', {
                      className: 'text-sm',
                      children:
                        'This card uses h2 heading with semibold weight and elevated prominence to signal primary importance in the content hierarchy.',
                    }),
                  }),
                  e.jsx(d, {
                    justify: 'end',
                    children: e.jsx(c, { variant: 'primary', size: 'sm', children: 'Learn More' }),
                  }),
                ],
              }),
              e.jsxs(t, {
                prominence: 'default',
                children: [
                  e.jsxs(a, {
                    density: 'comfortable',
                    children: [
                      e.jsx(s, { level: 3, weight: 'medium', children: 'Secondary Feature' }),
                      e.jsx(n, {
                        prominence: 'default',
                        children: 'Supporting content with appropriate visual weight',
                      }),
                    ],
                  }),
                  e.jsx(i, {
                    density: 'comfortable',
                    children: e.jsx('p', {
                      className: 'text-sm',
                      children:
                        "This card uses h3 heading with medium weight to show it's supporting the primary content.",
                    }),
                  }),
                  e.jsx(d, {
                    justify: 'end',
                    children: e.jsx(c, { variant: 'outline', size: 'sm', children: 'Details' }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
  },
  l = {
    render: () =>
      e.jsxs('div', {
        className: 'space-y-6 p-6 max-w-4xl',
        children: [
          e.jsxs('div', {
            children: [
              e.jsx('h3', {
                className: 'text-lg font-semibold mb-4',
                children: 'Adaptive Information Density',
              }),
              e.jsx('p', {
                className: 'text-sm text-gray-600 mb-6',
                children:
                  'Different density settings optimize cognitive load for various content types',
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'grid grid-cols-1 md:grid-cols-3 gap-6',
            children: [
              e.jsxs(t, {
                children: [
                  e.jsxs(a, {
                    density: 'compact',
                    children: [
                      e.jsx(s, { level: 4, weight: 'medium', children: 'Compact Density' }),
                      e.jsx(n, {
                        prominence: 'default',
                        truncate: !0,
                        children:
                          'High information density for dashboard widgets and summary views where space is limited',
                      }),
                    ],
                  }),
                  e.jsx(i, {
                    density: 'compact',
                    layout: 'list',
                    children: e.jsxs('div', {
                      className: 'text-xs space-y-1',
                      children: [
                        e.jsx('div', { children: 'Status: Active' }),
                        e.jsx('div', { children: 'Users: 1,234' }),
                        e.jsx('div', { children: 'Revenue: $45,678' }),
                      ],
                    }),
                  }),
                  e.jsx(d, {
                    density: 'compact',
                    justify: 'center',
                    children: e.jsx(c, { variant: 'ghost', size: 'sm', children: 'View' }),
                  }),
                ],
              }),
              e.jsxs(t, {
                children: [
                  e.jsxs(a, {
                    density: 'comfortable',
                    children: [
                      e.jsx(s, { level: 4, weight: 'medium', children: 'Comfortable Density' }),
                      e.jsx(n, {
                        prominence: 'default',
                        children: 'Balanced spacing for regular content cards and articles',
                      }),
                    ],
                  }),
                  e.jsx(i, {
                    density: 'comfortable',
                    children: e.jsx('p', {
                      className: 'text-sm',
                      children:
                        'This is the default density setting that provides good balance between information density and readability.',
                    }),
                  }),
                  e.jsxs(d, {
                    density: 'comfortable',
                    justify: 'between',
                    children: [
                      e.jsx('span', {
                        className: 'text-xs text-muted-foreground',
                        children: 'Updated 2h ago',
                      }),
                      e.jsx(c, { variant: 'outline', size: 'sm', children: 'Edit' }),
                    ],
                  }),
                ],
              }),
              e.jsxs(t, {
                children: [
                  e.jsxs(a, {
                    density: 'spacious',
                    children: [
                      e.jsx(s, { level: 4, weight: 'medium', children: 'Spacious Density' }),
                      e.jsx(n, {
                        prominence: 'default',
                        children: 'Generous spacing for focus and detailed content',
                      }),
                    ],
                  }),
                  e.jsx(i, {
                    density: 'spacious',
                    children: e.jsx('p', {
                      className: 'text-sm leading-relaxed',
                      children:
                        'Spacious density is ideal for important announcements, featured content, or when you want to create a sense of calm and focus.',
                    }),
                  }),
                  e.jsx(d, {
                    density: 'spacious',
                    justify: 'end',
                    children: e.jsx(c, { variant: 'primary', size: 'md', children: 'Get Started' }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
  },
  m = {
    render: () => {
      const p = (r) => {
        alert(`Clicked ${r} card`);
      };
      return e.jsxs('div', {
        className: 'space-y-6 p-6 max-w-3xl',
        children: [
          e.jsxs('div', {
            children: [
              e.jsx('h3', {
                className: 'text-lg font-semibold mb-4',
                children: 'Interactive Affordances',
              }),
              e.jsx('p', {
                className: 'text-sm text-gray-600 mb-6',
                children: 'Clear visual and behavioral cues indicate interactive vs static content',
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
            children: [
              e.jsxs(t, {
                prominence: 'default',
                children: [
                  e.jsxs(a, {
                    children: [
                      e.jsx(s, { level: 4, children: 'Static Information Card' }),
                      e.jsx(n, { children: 'This card displays information without interaction' }),
                    ],
                  }),
                  e.jsx(i, {
                    children: e.jsxs('div', {
                      className: 'space-y-2 text-sm',
                      children: [
                        e.jsxs('div', {
                          className: 'flex justify-between',
                          children: [
                            e.jsx('span', { children: 'Temperature:' }),
                            e.jsx('span', { children: '72°F' }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'flex justify-between',
                          children: [
                            e.jsx('span', { children: 'Humidity:' }),
                            e.jsx('span', { children: '45%' }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'flex justify-between',
                          children: [
                            e.jsx('span', { children: 'Status:' }),
                            e.jsx('span', { className: 'text-green-600', children: 'Normal' }),
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              e.jsxs(t, {
                interactive: !0,
                prominence: 'elevated',
                onClick: () => p('Dashboard'),
                children: [
                  e.jsxs(a, {
                    children: [
                      e.jsx(s, { level: 4, children: 'Interactive Dashboard Card' }),
                      e.jsx(n, { children: 'Click anywhere on this card to interact' }),
                    ],
                  }),
                  e.jsx(i, {
                    children: e.jsxs('div', {
                      className: 'space-y-2 text-sm',
                      children: [
                        e.jsxs('div', {
                          className: 'flex justify-between',
                          children: [
                            e.jsx('span', { children: 'Active Users:' }),
                            e.jsx('span', { className: 'font-medium', children: '2,547' }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'flex justify-between',
                          children: [
                            e.jsx('span', { children: 'Revenue:' }),
                            e.jsx('span', {
                              className: 'font-medium text-green-600',
                              children: '+12.3%',
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'flex justify-between',
                          children: [
                            e.jsx('span', { children: 'Conversion:' }),
                            e.jsx('span', { className: 'font-medium', children: '3.4%' }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  e.jsx(d, {
                    justify: 'end',
                    children: e.jsx('span', {
                      className: 'text-xs text-muted-foreground',
                      children: 'Click to view details →',
                    }),
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'mt-8',
            children: [
              e.jsx('h4', {
                className: 'text-md font-medium mb-3',
                children: 'Interactive Card Collection',
              }),
              e.jsx('div', {
                className: 'grid grid-cols-1 sm:grid-cols-3 gap-4',
                children: ['Analytics', 'Settings', 'Reports'].map((r) =>
                  e.jsxs(
                    t,
                    {
                      interactive: !0,
                      prominence: 'default',
                      onClick: () => p(r),
                      children: [
                        e.jsx(a, {
                          density: 'compact',
                          children: e.jsx(s, { level: 5, weight: 'medium', children: r }),
                        }),
                        e.jsx(i, {
                          density: 'compact',
                          children: e.jsxs('p', {
                            className: 'text-xs text-muted-foreground',
                            children: ['Access ', r.toLowerCase(), ' dashboard'],
                          }),
                        }),
                      ],
                    },
                    r
                  )
                ),
              }),
            ],
          }),
        ],
      });
    },
  };
var h, x, u;
o.parameters = {
  ...o.parameters,
  docs: {
    ...((h = o.parameters) == null ? void 0 : h.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-6 p-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Information Hierarchy Optimization</h3>
        <p className="text-sm text-gray-600 mb-6">
          Semantic heading levels and visual weight create clear content hierarchy
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card prominence="elevated">
          <CardHeader density="comfortable">
            <CardTitle level={2} weight="semibold">
              Primary Feature
            </CardTitle>
            <CardDescription prominence="default">
              Most important content gets highest visual weight and semantic priority
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm">
              This card uses h2 heading with semibold weight and elevated prominence
              to signal primary importance in the content hierarchy.
            </p>
          </CardContent>
          <CardFooter justify="end">
            <Button variant="primary" size="sm">Learn More</Button>
          </CardFooter>
        </Card>

        <Card prominence="default">
          <CardHeader density="comfortable">
            <CardTitle level={3} weight="medium">
              Secondary Feature
            </CardTitle>
            <CardDescription prominence="default">
              Supporting content with appropriate visual weight
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm">
              This card uses h3 heading with medium weight to show it's
              supporting the primary content.
            </p>
          </CardContent>
          <CardFooter justify="end">
            <Button variant="outline" size="sm">Details</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
}`,
      ...((u = (x = o.parameters) == null ? void 0 : x.docs) == null ? void 0 : u.source),
    },
  },
};
var C, v, y;
l.parameters = {
  ...l.parameters,
  docs: {
    ...((C = l.parameters) == null ? void 0 : C.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-6 p-6 max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold mb-4">Adaptive Information Density</h3>
        <p className="text-sm text-gray-600 mb-6">
          Different density settings optimize cognitive load for various content types
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader density="compact">
            <CardTitle level={4} weight="medium">Compact Density</CardTitle>
            <CardDescription prominence="default" truncate>
              High information density for dashboard widgets and summary views where space is limited
            </CardDescription>
          </CardHeader>
          <CardContent density="compact" layout="list">
            <div className="text-xs space-y-1">
              <div>Status: Active</div>
              <div>Users: 1,234</div>
              <div>Revenue: $45,678</div>
            </div>
          </CardContent>
          <CardFooter density="compact" justify="center">
            <Button variant="ghost" size="sm">View</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader density="comfortable">
            <CardTitle level={4} weight="medium">Comfortable Density</CardTitle>
            <CardDescription prominence="default">
              Balanced spacing for regular content cards and articles
            </CardDescription>
          </CardHeader>
          <CardContent density="comfortable">
            <p className="text-sm">
              This is the default density setting that provides good balance
              between information density and readability.
            </p>
          </CardContent>
          <CardFooter density="comfortable" justify="between">
            <span className="text-xs text-muted-foreground">Updated 2h ago</span>
            <Button variant="outline" size="sm">Edit</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader density="spacious">
            <CardTitle level={4} weight="medium">Spacious Density</CardTitle>
            <CardDescription prominence="default">
              Generous spacing for focus and detailed content
            </CardDescription>
          </CardHeader>
          <CardContent density="spacious">
            <p className="text-sm leading-relaxed">
              Spacious density is ideal for important announcements,
              featured content, or when you want to create a sense
              of calm and focus.
            </p>
          </CardContent>
          <CardFooter density="spacious" justify="end">
            <Button variant="primary" size="md">Get Started</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
}`,
      ...((y = (v = l.parameters) == null ? void 0 : v.docs) == null ? void 0 : y.source),
    },
  },
};
var f, g, j;
m.parameters = {
  ...m.parameters,
  docs: {
    ...((f = m.parameters) == null ? void 0 : f.docs),
    source: {
      originalSource: `{
  render: () => {
    const handleCardClick = (cardName: string) => {
      alert(\`Clicked \${cardName} card\`);
    };
    return <div className="space-y-6 p-6 max-w-3xl">
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive Affordances</h3>
          <p className="text-sm text-gray-600 mb-6">
            Clear visual and behavioral cues indicate interactive vs static content
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card prominence="default">
            <CardHeader>
              <CardTitle level={4}>Static Information Card</CardTitle>
              <CardDescription>
                This card displays information without interaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temperature:</span>
                  <span>72°F</span>
                </div>
                <div className="flex justify-between">
                  <span>Humidity:</span>
                  <span>45%</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600">Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card interactive prominence="elevated" onClick={() => handleCardClick('Dashboard')}>
            <CardHeader>
              <CardTitle level={4}>Interactive Dashboard Card</CardTitle>
              <CardDescription>
                Click anywhere on this card to interact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Users:</span>
                  <span className="font-medium">2,547</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-medium text-green-600">+12.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion:</span>
                  <span className="font-medium">3.4%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter justify="end">
              <span className="text-xs text-muted-foreground">Click to view details →</span>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <h4 className="text-md font-medium mb-3">Interactive Card Collection</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Analytics', 'Settings', 'Reports'].map(item => <Card key={item} interactive prominence="default" onClick={() => handleCardClick(item)}>
                <CardHeader density="compact">
                  <CardTitle level={5} weight="medium">{item}</CardTitle>
                </CardHeader>
                <CardContent density="compact">
                  <p className="text-xs text-muted-foreground">
                    Access {item.toLowerCase()} dashboard
                  </p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>;
  }
}`,
      ...((j = (g = m.parameters) == null ? void 0 : g.docs) == null ? void 0 : j.source),
    },
  },
};
const F = ['InformationHierarchy', 'CognitiveLoadDensity', 'InteractionIntelligence'];
export {
  l as CognitiveLoadDensity,
  o as InformationHierarchy,
  m as InteractionIntelligence,
  F as __namedExportsOrder,
  S as default,
};
