import { I as r } from './Input-CVXQ6vxa.js';
import { L as i } from './Label-J2ZPzYJO.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Cy2I62ob.js';
import './index-DoQPmrLJ.js';
import './index-Cox8WoOv.js';
import './index-DuwuiYca.js';
import './utils-DuMXYCiK.js';
const D = {
    title: '03 Components/Form/Label/Intelligence',
    component: i,
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component:
            'Semantic-first label intelligence that guides users through forms with clarity and accessibility. Labels communicate importance, provide context, and reduce cognitive load through intelligent hierarchy.',
        },
      },
    },
    tags: ['autodocs'],
  },
  a = {
    render: () =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx('h3', { children: 'Importance-Based Visual Hierarchy' }),
          e.jsxs('div', {
            className: 'space-y-4 w-80',
            children: [
              e.jsxs('div', {
                children: [
                  e.jsx(i, {
                    importance: 'critical',
                    required: !0,
                    children: 'Critical Information',
                  }),
                  e.jsx(r, { placeholder: 'Required for account security' }),
                ],
              }),
              e.jsxs('div', {
                children: [
                  e.jsx(i, { importance: 'standard', required: !0, children: 'Standard Field' }),
                  e.jsx(r, { placeholder: 'Standard required field' }),
                ],
              }),
              e.jsxs('div', {
                children: [
                  e.jsx(i, { importance: 'optional', children: 'Optional Enhancement' }),
                  e.jsx(r, { placeholder: 'Nice to have information' }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            children:
              'Visual weight matches functional importance, guiding user attention naturally',
          }),
        ],
      }),
  },
  t = {
    render: () =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx('h3', { children: 'Contextual Guidance Patterns' }),
          e.jsxs('div', {
            className: 'space-y-4 w-80',
            children: [
              e.jsxs('div', {
                children: [
                  e.jsx(i, {
                    importance: 'critical',
                    required: !0,
                    helpText: 'We use this to verify your identity and protect your account',
                    children: 'Email Address',
                  }),
                  e.jsx(r, { type: 'email', placeholder: 'your@email.com' }),
                ],
              }),
              e.jsxs('div', {
                children: [
                  e.jsx(i, {
                    validationState: 'warning',
                    helpText: 'Password strength could be improved',
                    children: 'Password',
                  }),
                  e.jsx(r, { type: 'password', placeholder: 'Enter password' }),
                ],
              }),
              e.jsxs('div', {
                children: [
                  e.jsx(i, {
                    validationState: 'success',
                    helpText: 'Perfect! This username is available',
                    children: 'Username',
                  }),
                  e.jsx(r, { placeholder: 'Choose a unique username' }),
                ],
              }),
              e.jsxs('div', {
                children: [
                  e.jsx(i, {
                    validationState: 'error',
                    helpText: 'This field is required to continue',
                    required: !0,
                    children: 'Confirmation',
                  }),
                  e.jsx(r, { placeholder: 'Please confirm your choice' }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            children:
              'Guidance text adapts to validation states, providing helpful context without overwhelming',
          }),
        ],
      }),
  },
  n = {
    render: () =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx('h3', { children: 'Context-Specific Behavior' }),
          e.jsxs('div', {
            className: 'space-y-6',
            children: [
              e.jsxs('div', {
                className: 'space-y-2',
                children: [
                  e.jsx('h4', { children: 'Form Context' }),
                  e.jsxs('div', {
                    className: 'space-y-2 w-80',
                    children: [
                      e.jsx(i, { context: 'form', required: !0, children: 'Form Field Label' }),
                      e.jsx(r, { placeholder: 'Interactive form input' }),
                      e.jsx('p', {
                        className: 'text-xs text-muted-foreground',
                        children: 'Optimized for form interaction and accessibility',
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-2',
                children: [
                  e.jsx('h4', { children: 'Descriptive Context' }),
                  e.jsxs('div', {
                    className: 'space-y-2',
                    children: [
                      e.jsx(i, { context: 'descriptive', children: 'Data Description' }),
                      e.jsx('p', {
                        className: 'text-sm',
                        children: 'This label describes static content or read-only information',
                      }),
                      e.jsx('p', {
                        className: 'text-xs text-muted-foreground',
                        children: 'Used for content organization and information hierarchy',
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-2',
                children: [
                  e.jsx('h4', { children: 'Action Context' }),
                  e.jsxs('div', {
                    className: 'space-y-2',
                    children: [
                      e.jsx(i, { context: 'action', children: 'Interactive Label' }),
                      e.jsx('p', {
                        className: 'text-sm',
                        children: 'This label can trigger actions or navigation',
                      }),
                      e.jsx('p', {
                        className: 'text-xs text-muted-foreground',
                        children: 'Includes hover states and interactive affordances',
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
  },
  s = {
    render: () =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx('h3', { children: 'Comprehensive Accessibility' }),
          e.jsxs('div', {
            className: 'space-y-4 w-80',
            children: [
              e.jsxs('div', {
                children: [
                  e.jsx(i, {
                    htmlFor: 'accessible-input',
                    importance: 'critical',
                    required: !0,
                    helpText: "Screen readers announce: 'Email Address, required field, edit text'",
                    children: 'Email Address',
                  }),
                  e.jsx(r, {
                    id: 'accessible-input',
                    type: 'email',
                    'aria-describedby': 'email-help',
                    placeholder: 'your@email.com',
                  }),
                ],
              }),
              e.jsxs('div', {
                children: [
                  e.jsx(i, {
                    htmlFor: 'validation-input',
                    validationState: 'error',
                    helpText: 'Error state uses assertive aria-live for immediate announcement',
                    required: !0,
                    children: 'Password',
                  }),
                  e.jsx(r, {
                    id: 'validation-input',
                    type: 'password',
                    'aria-invalid': 'true',
                    'aria-describedby': 'password-error',
                  }),
                ],
              }),
              e.jsxs('div', {
                children: [
                  e.jsx(i, {
                    htmlFor: 'optional-input',
                    importance: 'optional',
                    helpText: 'Optional fields are clearly marked to reduce cognitive load',
                    children: 'Phone Number',
                  }),
                  e.jsx(r, {
                    id: 'optional-input',
                    type: 'tel',
                    placeholder: 'Optional contact method',
                  }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            children:
              'Proper semantic markup and ARIA attributes ensure perfect screen reader support',
          }),
        ],
      }),
  };
var c, o, d, l, p;
a.parameters = {
  ...a.parameters,
  docs: {
    ...((c = a.parameters) == null ? void 0 : c.docs),
    source: {
      originalSource: `{
  render: () => <>
      <h3>Importance-Based Visual Hierarchy</h3>
      
      <div className="space-y-4 w-80">
        <div>
          <Label importance="critical" required>Critical Information</Label>
          <Input placeholder="Required for account security" />
        </div>

        <div>
          <Label importance="standard" required>Standard Field</Label>
          <Input placeholder="Standard required field" />
        </div>

        <div>
          <Label importance="optional">Optional Enhancement</Label>
          <Input placeholder="Nice to have information" />
        </div>
      </div>
      
      <p>Visual weight matches functional importance, guiding user attention naturally</p>
    </>
}`,
      ...((d = (o = a.parameters) == null ? void 0 : o.docs) == null ? void 0 : d.source),
    },
    description: {
      story: `Semantic Hierarchy

Labels communicate importance through visual weight and semantic meaning.
This reduces cognitive load by helping users prioritize their attention.`,
      ...((p = (l = a.parameters) == null ? void 0 : l.docs) == null ? void 0 : p.description),
    },
  },
};
var m, h, u, x, v;
t.parameters = {
  ...t.parameters,
  docs: {
    ...((m = t.parameters) == null ? void 0 : m.docs),
    source: {
      originalSource: `{
  render: () => <>
      <h3>Contextual Guidance Patterns</h3>
      
      <div className="space-y-4 w-80">
        <div>
          <Label importance="critical" required helpText="We use this to verify your identity and protect your account">
            Email Address
          </Label>
          <Input type="email" placeholder="your@email.com" />
        </div>

        <div>
          <Label validationState="warning" helpText="Password strength could be improved">
            Password
          </Label>
          <Input type="password" placeholder="Enter password" />
        </div>

        <div>
          <Label validationState="success" helpText="Perfect! This username is available">
            Username
          </Label>
          <Input placeholder="Choose a unique username" />
        </div>

        <div>
          <Label validationState="error" helpText="This field is required to continue" required>
            Confirmation
          </Label>
          <Input placeholder="Please confirm your choice" />
        </div>
      </div>
      
      <p>Guidance text adapts to validation states, providing helpful context without overwhelming</p>
    </>
}`,
      ...((u = (h = t.parameters) == null ? void 0 : h.docs) == null ? void 0 : u.source),
    },
    description: {
      story: `Form Guidance Intelligence

Help text provides contextual guidance that reduces errors and builds confidence.
Smart validation states give immediate feedback.`,
      ...((v = (x = t.parameters) == null ? void 0 : x.docs) == null ? void 0 : v.description),
    },
  },
};
var y, b, f, j, g;
n.parameters = {
  ...n.parameters,
  docs: {
    ...((y = n.parameters) == null ? void 0 : y.docs),
    source: {
      originalSource: `{
  render: () => <>
      <h3>Context-Specific Behavior</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <h4>Form Context</h4>
          <div className="space-y-2 w-80">
            <Label context="form" required>Form Field Label</Label>
            <Input placeholder="Interactive form input" />
            <p className="text-xs text-muted-foreground">Optimized for form interaction and accessibility</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4>Descriptive Context</h4>
          <div className="space-y-2">
            <Label context="descriptive">Data Description</Label>
            <p className="text-sm">This label describes static content or read-only information</p>
            <p className="text-xs text-muted-foreground">Used for content organization and information hierarchy</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4>Action Context</h4>
          <div className="space-y-2">
            <Label context="action">Interactive Label</Label>
            <p className="text-sm">This label can trigger actions or navigation</p>
            <p className="text-xs text-muted-foreground">Includes hover states and interactive affordances</p>
          </div>
        </div>
      </div>
    </>
}`,
      ...((f = (b = n.parameters) == null ? void 0 : b.docs) == null ? void 0 : f.source),
    },
    description: {
      story: `Context-Aware Labeling

Different label contexts serve different purposes.
Each context has appropriate styling and behavior patterns.`,
      ...((g = (j = n.parameters) == null ? void 0 : j.docs) == null ? void 0 : g.description),
    },
  },
};
var L, w, N, I, S;
s.parameters = {
  ...s.parameters,
  docs: {
    ...((L = s.parameters) == null ? void 0 : L.docs),
    source: {
      originalSource: `{
  render: () => <>
      <h3>Comprehensive Accessibility</h3>
      
      <div className="space-y-4 w-80">
        <div>
          <Label htmlFor="accessible-input" importance="critical" required helpText="Screen readers announce: 'Email Address, required field, edit text'">
            Email Address
          </Label>
          <Input id="accessible-input" type="email" aria-describedby="email-help" placeholder="your@email.com" />
        </div>

        <div>
          <Label htmlFor="validation-input" validationState="error" helpText="Error state uses assertive aria-live for immediate announcement" required>
            Password
          </Label>
          <Input id="validation-input" type="password" aria-invalid="true" aria-describedby="password-error" />
        </div>

        <div>
          <Label htmlFor="optional-input" importance="optional" helpText="Optional fields are clearly marked to reduce cognitive load">
            Phone Number
          </Label>
          <Input id="optional-input" type="tel" placeholder="Optional contact method" />
        </div>
      </div>
      
      <p>Proper semantic markup and ARIA attributes ensure perfect screen reader support</p>
    </>
}`,
      ...((N = (w = s.parameters) == null ? void 0 : w.docs) == null ? void 0 : N.source),
    },
    description: {
      story: `Accessibility Excellence

Labels provide comprehensive accessibility support through semantic markup,
proper ARIA attributes, and screen reader optimization.`,
      ...((S = (I = s.parameters) == null ? void 0 : I.docs) == null ? void 0 : S.description),
    },
  },
};
const G = ['SemanticHierarchy', 'FormGuidance', 'ContextAwareness', 'AccessibilityExcellence'];
export {
  s as AccessibilityExcellence,
  n as ContextAwareness,
  t as FormGuidance,
  a as SemanticHierarchy,
  G as __namedExportsOrder,
  D as default,
};
