import { B as s } from './Button-B50RvQza.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './index-DuwuiYca.js';
import './iframe-Cy2I62ob.js';
import './utils-DuMXYCiK.js';
const { fn: o } = __STORYBOOK_MODULE_TEST__,
  u = {
    title: '03 Components/Action/Button',
    component: s,
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component:
            'The foundational interactive element. Every button communicates intent through carefully chosen visual hierarchy and semantic meaning.',
        },
      },
    },
    argTypes: {
      variant: {
        control: 'select',
        options: [
          'primary',
          'secondary',
          'destructive',
          'success',
          'warning',
          'info',
          'outline',
          'ghost',
        ],
        description: 'Visual style variant using semantic tokens',
      },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg'],
        description: 'Size variant affecting height and padding',
      },
      disabled: { control: 'boolean', description: 'Disabled state with opacity modifier' },
      asChild: { control: 'boolean', description: 'Use Radix Slot for composition' },
      'aria-label': {
        control: 'text',
        description: 'Accessible label when button text is not descriptive enough',
      },
      'aria-describedby': {
        control: 'text',
        description: 'ID of element that describes the button',
      },
      'aria-pressed': {
        control: 'boolean',
        description: 'For toggle buttons, indicates pressed state',
      },
    },
    args: { onClick: o() },
  },
  t = {
    render: () =>
      e.jsxs('div', {
        className: 'space-y-12 p-6 max-w-5xl',
        children: [
          e.jsxs('div', {
            className: 'space-y-8',
            children: [
              e.jsxs('div', {
                className: 'space-y-4',
                children: [
                  e.jsx('h1', { className: 'text-3xl font-bold', children: 'Button' }),
                  e.jsx('p', {
                    className: 'text-lg text-muted-foreground max-w-4xl leading-relaxed',
                    children:
                      "Buttons are used to show the user's choice of options for actions and assign these to a clear hierarchy. A button helps the user to find the most important actions of a page or within a viewport and enables them to perform these actions. The label is used to clearly indicate to the user what action will be triggered. Buttons allow users to commit a change, complete steps in a task, or make choices.",
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-6',
                children: [
                  e.jsx('h2', { className: 'text-2xl font-bold', children: 'Usage Guidelines' }),
                  e.jsx('p', {
                    className: 'text-muted-foreground max-w-3xl',
                    children:
                      'The primary button is used for the most important action on a page or in a view. The transparent secondary button with a thin frame is used for subordinate actions. The text button is applied as a subtle call to action.',
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-8',
            children: [
              e.jsxs('div', {
                className: 'space-y-4',
                children: [
                  e.jsx('h3', { className: 'text-xl font-semibold', children: 'Do' }),
                  e.jsxs('div', {
                    className: 'space-y-3',
                    children: [
                      e.jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          e.jsx('h4', {
                            className: 'text-base font-medium',
                            children: 'Button labels',
                          }),
                          e.jsxs('ul', {
                            className: 'space-y-2 text-sm text-muted-foreground ml-4',
                            children: [
                              e.jsx('li', {
                                children: '• Must describe the action the button performs',
                              }),
                              e.jsx('li', { children: '• Should include a verb' }),
                              e.jsx('li', {
                                children: '• Concise, specific, self-explanatory labels',
                              }),
                              e.jsx('li', {
                                children:
                                  '• Always include a noun if there is any room for interpretation about what the verb operates on',
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          e.jsx('h4', {
                            className: 'text-base font-medium',
                            children: 'Placement and hierarchy',
                          }),
                          e.jsxs('ul', {
                            className: 'space-y-2 text-sm text-muted-foreground ml-4',
                            children: [
                              e.jsx('li', {
                                children:
                                  '• Place buttons in consistent locations in the user interface for best user experience',
                              }),
                              e.jsx('li', {
                                children:
                                  '• Use the button group component when there is a need to combine or lay out multiple buttons',
                              }),
                              e.jsx('li', {
                                children:
                                  '• Express different emphasis levels (e.g. one primary button and one secondary button)',
                              }),
                              e.jsx('li', {
                                children: '• Consider hierarchy of different button variations',
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          e.jsx('h4', {
                            className: 'text-base font-medium',
                            children: 'Accessibility',
                          }),
                          e.jsx('ul', {
                            className: 'space-y-2 text-sm text-muted-foreground ml-4',
                            children: e.jsx('li', {
                              children:
                                '• Use aria status / alert elements when applying the loading state',
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-4',
                children: [
                  e.jsx('h3', { className: 'text-xl font-semibold', children: "Don't" }),
                  e.jsxs('div', {
                    className: 'space-y-3',
                    children: [
                      e.jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          e.jsx('h4', {
                            className: 'text-base font-medium',
                            children: 'Button labels',
                          }),
                          e.jsx('ul', {
                            className: 'space-y-2 text-sm text-muted-foreground ml-4',
                            children: e.jsx('li', {
                              children:
                                '• No use of generic labels like "Ok" especially in the case of an error; errors are never "Ok"',
                            }),
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'space-y-2',
                        children: [
                          e.jsx('h4', {
                            className: 'text-base font-medium',
                            children: 'Usage patterns',
                          }),
                          e.jsxs('ul', {
                            className: 'space-y-2 text-sm text-muted-foreground ml-4',
                            children: [
                              e.jsx('li', {
                                children:
                                  '• Do not use a button for a text link or navigation item',
                              }),
                              e.jsx('li', {
                                children: '• Do not use two primary buttons in a button group',
                              }),
                              e.jsx('li', {
                                children:
                                  '• Do not use a primary button with a text button in a button group',
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'space-y-6',
            children: [
              e.jsx('h3', { className: 'text-xl font-semibold', children: 'Common Patterns' }),
              e.jsxs('div', {
                className: 'space-y-8',
                children: [
                  e.jsxs('div', {
                    className: 'space-y-3',
                    children: [
                      e.jsx('h4', { className: 'text-lg font-medium', children: 'Form Actions' }),
                      e.jsx('div', {
                        className: 'p-6 bg-muted/30 rounded border',
                        children: e.jsxs('div', {
                          className: 'flex gap-3 justify-end',
                          children: [
                            e.jsx(s, { variant: 'ghost', children: 'Cancel' }),
                            e.jsx(s, { variant: 'secondary', children: 'Save Draft' }),
                            e.jsx(s, { variant: 'primary', children: 'Publish' }),
                          ],
                        }),
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'space-y-3',
                    children: [
                      e.jsx('h4', {
                        className: 'text-lg font-medium',
                        children: 'Confirmation Dialogs',
                      }),
                      e.jsx('div', {
                        className: 'p-6 bg-muted/30 rounded border',
                        children: e.jsxs('div', {
                          className: 'flex gap-3 justify-end',
                          children: [
                            e.jsx(s, { variant: 'outline', children: 'Keep Editing' }),
                            e.jsx(s, { variant: 'destructive', children: 'Delete Forever' }),
                          ],
                        }),
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'space-y-3',
                    children: [
                      e.jsx('h4', { className: 'text-lg font-medium', children: 'Loading States' }),
                      e.jsx('div', {
                        className: 'p-6 bg-muted/30 rounded border',
                        children: e.jsx(s, { disabled: !0, children: 'Processing...' }),
                      }),
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
            'Comprehensive usage guidelines with practical examples and common patterns for implementing buttons effectively.',
        },
      },
      layout: 'fullscreen',
    },
  };
var a, i, n;
t.parameters = {
  ...t.parameters,
  docs: {
    ...((a = t.parameters) == null ? void 0 : a.docs),
    source: {
      originalSource: `{
  render: () => {
    return <div className="space-y-12 p-6 max-w-5xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Button</h1>
            <p className="text-lg text-muted-foreground max-w-4xl leading-relaxed">
              Buttons are used to show the user's choice of options for actions and assign these to
              a clear hierarchy. A button helps the user to find the most important actions of a
              page or within a viewport and enables them to perform these actions. The label is used
              to clearly indicate to the user what action will be triggered. Buttons allow users to
              commit a change, complete steps in a task, or make choices.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Usage Guidelines</h2>
            <p className="text-muted-foreground max-w-3xl">
              The primary button is used for the most important action on a page or in a view. The
              transparent secondary button with a thin frame is used for subordinate actions. The
              text button is applied as a subtle call to action.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Do</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-base font-medium">Button labels</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• Must describe the action the button performs</li>
                  <li>• Should include a verb</li>
                  <li>• Concise, specific, self-explanatory labels</li>
                  <li>
                    • Always include a noun if there is any room for interpretation about what the
                    verb operates on
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">Placement and hierarchy</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>
                    • Place buttons in consistent locations in the user interface for best user
                    experience
                  </li>
                  <li>
                    • Use the button group component when there is a need to combine or lay out
                    multiple buttons
                  </li>
                  <li>
                    • Express different emphasis levels (e.g. one primary button and one secondary
                    button)
                  </li>
                  <li>• Consider hierarchy of different button variations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">Accessibility</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• Use aria status / alert elements when applying the loading state</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Don't</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-base font-medium">Button labels</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>
                    • No use of generic labels like "Ok" especially in the case of an error; errors
                    are never "Ok"
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-medium">Usage patterns</h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                  <li>• Do not use a button for a text link or navigation item</li>
                  <li>• Do not use two primary buttons in a button group</li>
                  <li>• Do not use a primary button with a text button in a button group</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Common Patterns</h3>

          <div className="space-y-8">
            <div className="space-y-3">
              <h4 className="text-lg font-medium">Form Actions</h4>
              <div className="p-6 bg-muted/30 rounded border">
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="secondary">Save Draft</Button>
                  <Button variant="primary">Publish</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-medium">Confirmation Dialogs</h4>
              <div className="p-6 bg-muted/30 rounded border">
                <div className="flex gap-3 justify-end">
                  <Button variant="outline">Keep Editing</Button>
                  <Button variant="destructive">Delete Forever</Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-medium">Loading States</h4>
              <div className="p-6 bg-muted/30 rounded border">
                <Button disabled>Processing...</Button>
              </div>
            </div>
          </div>
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Comprehensive usage guidelines with practical examples and common patterns for implementing buttons effectively.'
      }
    },
    layout: 'fullscreen'
  }
}`,
      ...((n = (i = t.parameters) == null ? void 0 : i.docs) == null ? void 0 : n.source),
    },
  },
};
const h = ['UsageGuidelines'];
export { t as UsageGuidelines, h as __namedExportsOrder, u as default };
