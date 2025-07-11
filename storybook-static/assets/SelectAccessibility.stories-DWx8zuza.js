import { c as i, a as l, b as n, S as r, d as t } from './Select-BQoa9TWO.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './iframe-Cy2I62ob.js';
import './index-Cox8WoOv.js';
import './index-DYn9WTcg.js';
import './index-BB5JR4LJ.js';
import './index-DuwuiYca.js';
import './index-DoQPmrLJ.js';
import './index-LIN26vHB.js';
import './utils-DuMXYCiK.js';
const { fn: C } = __STORYBOOK_MODULE_TEST__,
  q = {
    title: '03 Components/Form/Select/Accessibility',
    component: r,
    parameters: {
      layout: 'centered',
      docs: {
        description: {
          component:
            'Accessibility is design quality, not compliance. Every accessibility feature improves the experience for all users. Accessibility features that enhance usability for all users while ensuring inclusive design principles are met.',
        },
      },
    },
    tags: ['autodocs'],
    args: { onValueChange: C() },
  },
  c = {
    render: () =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx('h3', { children: 'Clear Labeling' }),
          e.jsx('label', { htmlFor: 'country-select', children: 'Country' }),
          e.jsxs(r, {
            children: [
              e.jsx(l, {
                id: 'country-select',
                'aria-describedby': 'country-help',
                children: e.jsx(n, { placeholder: 'Select your country' }),
              }),
              e.jsxs(i, {
                children: [
                  e.jsx(t, { value: 'us', children: 'United States' }),
                  e.jsx(t, { value: 'ca', children: 'Canada' }),
                  e.jsx(t, { value: 'uk', children: 'United Kingdom' }),
                ],
              }),
            ],
          }),
          e.jsx('p', { id: 'country-help', children: 'Required for shipping calculation' }),
          e.jsx('h3', { children: 'Keyboard Navigation' }),
          e.jsxs(r, {
            children: [
              e.jsx(l, { children: e.jsx(n, { placeholder: 'Navigate with arrow keys' }) }),
              e.jsxs(i, {
                children: [
                  e.jsx(t, { value: 'option1', children: 'First Option' }),
                  e.jsx(t, { value: 'option2', children: 'Second Option' }),
                  e.jsx(t, { value: 'option3', children: 'Third Option' }),
                  e.jsx(t, { value: 'option4', children: 'Fourth Option' }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            children: 'Use Tab to focus, Enter/Space to open, arrows to navigate, Enter to select',
          }),
          e.jsx('h3', { children: 'Motor Accessibility' }),
          e.jsxs(r, {
            children: [
              e.jsx(l, {
                size: 'large',
                children: e.jsx(n, { placeholder: 'Enhanced touch targets' }),
              }),
              e.jsxs(i, {
                children: [
                  e.jsx(t, { value: 'large1', children: 'Larger Touch Target 1' }),
                  e.jsx(t, { value: 'large2', children: 'Larger Touch Target 2' }),
                  e.jsx(t, { value: 'large3', children: 'Larger Touch Target 3' }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            children: '44px minimum touch targets improve usability for all interaction methods',
          }),
        ],
      }),
  },
  s = {
    render: () =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx('h3', { children: 'Required Field' }),
          e.jsxs('label', {
            htmlFor: 'priority-select',
            children: [
              'Priority ',
              e.jsx('span', { className: 'text-destructive', children: '*' }),
            ],
          }),
          e.jsxs(r, {
            required: !0,
            children: [
              e.jsx(l, {
                id: 'priority-select',
                'aria-required': 'true',
                'aria-describedby': 'priority-error',
                children: e.jsx(n, { placeholder: 'Select priority level' }),
              }),
              e.jsxs(i, {
                children: [
                  e.jsx(t, { value: 'high', children: 'High Priority' }),
                  e.jsx(t, { value: 'medium', children: 'Medium Priority' }),
                  e.jsx(t, { value: 'low', children: 'Low Priority' }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            id: 'priority-error',
            role: 'alert',
            children: 'Priority selection is required',
          }),
          e.jsx('h3', { children: 'Choice Count' }),
          e.jsx('label', { htmlFor: 'department-select', children: 'Department' }),
          e.jsxs(r, {
            children: [
              e.jsx(l, {
                id: 'department-select',
                showCount: !0,
                itemCount: 5,
                children: e.jsx(n, { placeholder: 'Choose department' }),
              }),
              e.jsxs(i, {
                children: [
                  e.jsx(t, { value: 'engineering', children: 'Engineering' }),
                  e.jsx(t, { value: 'design', children: 'Design' }),
                  e.jsx(t, { value: 'marketing', children: 'Marketing' }),
                  e.jsx(t, { value: 'sales', children: 'Sales' }),
                  e.jsx(t, { value: 'support', children: 'Support' }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            children: 'Item count helps users understand the scope of available choices',
          }),
        ],
      }),
  },
  a = {
    render: () =>
      e.jsxs(e.Fragment, {
        children: [
          e.jsx('h3', { children: 'Validation Error' }),
          e.jsx('label', { htmlFor: 'status-select', children: 'Status' }),
          e.jsxs(r, {
            children: [
              e.jsx(l, {
                id: 'status-select',
                className: 'border-destructive focus:ring-destructive',
                'aria-invalid': 'true',
                'aria-describedby': 'status-error',
                children: e.jsx(n, { placeholder: 'Select status' }),
              }),
              e.jsxs(i, {
                children: [
                  e.jsx(t, { value: 'active', children: 'Active' }),
                  e.jsx(t, { value: 'inactive', children: 'Inactive' }),
                  e.jsx(t, { value: 'pending', children: 'Pending' }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            id: 'status-error',
            role: 'alert',
            children: 'Please select a valid status from the list',
          }),
          e.jsx('h3', { children: 'Disabled State' }),
          e.jsx('label', { htmlFor: 'locked-select', children: 'Locked Selection' }),
          e.jsxs(r, {
            disabled: !0,
            children: [
              e.jsx(l, {
                id: 'locked-select',
                'aria-describedby': 'locked-help',
                children: e.jsx(n, { placeholder: 'Not available' }),
              }),
              e.jsxs(i, {
                children: [
                  e.jsx(t, { value: 'option1', children: 'Option 1' }),
                  e.jsx(t, { value: 'option2', children: 'Option 2' }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            id: 'locked-help',
            children: 'This selection is locked until previous steps are completed',
          }),
        ],
      }),
  };
var o, d, u, p, h;
c.parameters = {
  ...c.parameters,
  docs: {
    ...((o = c.parameters) == null ? void 0 : o.docs),
    source: {
      originalSource: `{
  render: () => <>
      <h3>Clear Labeling</h3>
      <label htmlFor="country-select">Country</label>
      <Select>
        <SelectTrigger id="country-select" aria-describedby="country-help">
          <SelectValue placeholder="Select your country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
        </SelectContent>
      </Select>
      <p id="country-help">Required for shipping calculation</p>

      <h3>Keyboard Navigation</h3>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Navigate with arrow keys" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">First Option</SelectItem>
          <SelectItem value="option2">Second Option</SelectItem>
          <SelectItem value="option3">Third Option</SelectItem>
          <SelectItem value="option4">Fourth Option</SelectItem>
        </SelectContent>
      </Select>
      <p>Use Tab to focus, Enter/Space to open, arrows to navigate, Enter to select</p>

      <h3>Motor Accessibility</h3>
      <Select>
        <SelectTrigger size="large">
          <SelectValue placeholder="Enhanced touch targets" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="large1">Larger Touch Target 1</SelectItem>
          <SelectItem value="large2">Larger Touch Target 2</SelectItem>
          <SelectItem value="large3">Larger Touch Target 3</SelectItem>
        </SelectContent>
      </Select>
      <p>44px minimum touch targets improve usability for all interaction methods</p>
    </>
}`,
      ...((u = (d = c.parameters) == null ? void 0 : d.docs) == null ? void 0 : u.source),
    },
    description: {
      story: `Foundation Principles

Accessible selects work for everyone, not just assistive technology users.
They provide clear context, proper semantics, and predictable behavior.`,
      ...((h = (p = c.parameters) == null ? void 0 : p.docs) == null ? void 0 : h.description),
    },
  },
};
var m, S, g, v, x;
s.parameters = {
  ...s.parameters,
  docs: {
    ...((m = s.parameters) == null ? void 0 : m.docs),
    source: {
      originalSource: `{
  render: () => <>
      <h3>Required Field</h3>
      <label htmlFor="priority-select">
        Priority <span className="text-destructive">*</span>
      </label>
      <Select required>
        <SelectTrigger id="priority-select" aria-required="true" aria-describedby="priority-error">
          <SelectValue placeholder="Select priority level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">High Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="low">Low Priority</SelectItem>
        </SelectContent>
      </Select>
      <p id="priority-error" role="alert">Priority selection is required</p>

      <h3>Choice Count</h3>
      <label htmlFor="department-select">Department</label>
      <Select>
        <SelectTrigger id="department-select" showCount itemCount={5}>
          <SelectValue placeholder="Choose department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
          <SelectItem value="support">Support</SelectItem>
        </SelectContent>
      </Select>
      <p>Item count helps users understand the scope of available choices</p>
    </>
}`,
      ...((g = (S = s.parameters) == null ? void 0 : S.docs) == null ? void 0 : g.source),
    },
    description: {
      story: `Screen Reader Support

Proper ARIA attributes and semantic structure support assistive technology.
These patterns enhance understanding for all users.`,
      ...((x = (v = s.parameters) == null ? void 0 : v.docs) == null ? void 0 : x.description),
    },
  },
};
var j, y, b, I, T;
a.parameters = {
  ...a.parameters,
  docs: {
    ...((j = a.parameters) == null ? void 0 : j.docs),
    source: {
      originalSource: `{
  render: () => <>
      <h3>Validation Error</h3>
      <label htmlFor="status-select">Status</label>
      <Select>
        <SelectTrigger id="status-select" className="border-destructive focus:ring-destructive" aria-invalid="true" aria-describedby="status-error">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
      <p id="status-error" role="alert">Please select a valid status from the list</p>

      <h3>Disabled State</h3>
      <label htmlFor="locked-select">Locked Selection</label>
      <Select disabled>
        <SelectTrigger id="locked-select" aria-describedby="locked-help">
          <SelectValue placeholder="Not available" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
      <p id="locked-help">This selection is locked until previous steps are completed</p>
    </>
}`,
      ...((b = (y = a.parameters) == null ? void 0 : y.docs) == null ? void 0 : b.source),
    },
    description: {
      story: `Error States

Clear error communication helps users understand and resolve issues.
Visual and semantic indicators work together.`,
      ...((T = (I = a.parameters) == null ? void 0 : I.docs) == null ? void 0 : T.description),
    },
  },
};
const N = ['AccessibilityBasics', 'ScreenReaderSupport', 'ErrorStates'];
export {
  c as AccessibilityBasics,
  a as ErrorStates,
  s as ScreenReaderSupport,
  N as __namedExportsOrder,
  q as default,
};
