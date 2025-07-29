import { I as a } from './Input-CVXQ6vxa.js';
import { r as c } from './iframe-Cy2I62ob.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './utils-DuMXYCiK.js';
const M = {
  title: '03 Components/Forms/Input/Intelligence',
  component: a,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
const r = {
  render: () => {
    const [n, w] = c.useState('');
    const [d, N] = c.useState('');
    const [t, j] = c.useState(!1);
    const E = (s) =>
      s
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
          ? ''
          : 'Please enter a valid email address'
        : 'Email is required';
    const k = (s) =>
      s ? (s.length < 8 ? 'Password must be at least 8 characters' : '') : 'Password is required';
    const o = t ? E(n) : '';
    const m = t ? k(d) : '';
    return e.jsxs('div', {
      className: 'space-y-6 p-6 max-w-md',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Prevention vs Recovery Patterns',
            }),
            e.jsx('p', {
              className: 'text-sm text-gray-600 mb-6',
              children:
                'Intelligence prevents errors before they occur, rather than just showing them after',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-4',
          children: [
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  htmlFor: 'email',
                  className: 'block text-sm font-medium mb-2',
                  children: 'Email Address',
                }),
                e.jsx(a, {
                  id: 'email',
                  type: 'email',
                  placeholder: 'Enter your email',
                  value: n,
                  onChange: (s) => w(s.target.value),
                  variant: o ? 'error' : n && !o ? 'success' : 'default',
                  validationMode: 'live',
                  showValidation: t,
                  validationMessage: o,
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  htmlFor: 'password',
                  className: 'block text-sm font-medium mb-2',
                  children: 'Password',
                }),
                e.jsx(a, {
                  id: 'password',
                  type: 'password',
                  placeholder: 'Enter your password',
                  value: d,
                  onChange: (s) => N(s.target.value),
                  variant: m ? 'error' : d && !m ? 'success' : 'default',
                  validationMode: 'onBlur',
                  sensitive: !0,
                  showValidation: t,
                  validationMessage: m,
                }),
              ],
            }),
            e.jsx('button', {
              type: 'button',
              onClick: () => j(!0),
              className:
                'w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors',
              children: 'Submit Form',
            }),
          ],
        }),
      ],
    });
  },
};
const l = {
  render: () =>
    e.jsxs('div', {
      className: 'space-y-6 p-6 max-w-md',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Enhanced Touch Targets',
            }),
            e.jsx('p', {
              className: 'text-sm text-gray-600 mb-6',
              children:
                '44px minimum touch targets on mobile, 40px on desktop for motor accessibility',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-4',
          children: [
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  htmlFor: 'mobile-input',
                  className: 'block text-sm font-medium mb-2',
                  children: 'Mobile-Optimized Input',
                }),
                e.jsx(a, {
                  id: 'mobile-input',
                  placeholder: 'Touch target: 44px mobile, 40px desktop',
                  className: 'w-full',
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  htmlFor: 'search-input',
                  className: 'block text-sm font-medium mb-2',
                  children: 'Search Field',
                }),
                e.jsx(a, {
                  id: 'search-input',
                  type: 'search',
                  placeholder: 'Enhanced for search interactions',
                  className: 'w-full',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
};
const i = {
  render: () =>
    e.jsxs('div', {
      className: 'space-y-6 p-6 max-w-md',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Trust-Building Patterns',
            }),
            e.jsx('p', {
              className: 'text-sm text-gray-600 mb-6',
              children: 'Visual indicators and enhanced styling for sensitive data inputs',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-4',
          children: [
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  htmlFor: 'credit-card',
                  className: 'block text-sm font-medium mb-2',
                  children: 'Credit Card Number',
                }),
                e.jsx(a, {
                  id: 'credit-card',
                  type: 'text',
                  placeholder: '1234 5678 9012 3456',
                  sensitive: !0,
                  className: 'w-full',
                }),
                e.jsx('p', {
                  className: 'text-xs text-gray-500 mt-1',
                  children: 'Enhanced border indicates secure field',
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  htmlFor: 'ssn',
                  className: 'block text-sm font-medium mb-2',
                  children: 'Social Security Number',
                }),
                e.jsx(a, {
                  id: 'ssn',
                  type: 'password',
                  placeholder: 'XXX-XX-XXXX',
                  sensitive: !0,
                  className: 'w-full',
                }),
                e.jsx('p', {
                  className: 'text-xs text-gray-500 mt-1',
                  children: 'Visual trust indicators for sensitive data',
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  htmlFor: 'regular',
                  className: 'block text-sm font-medium mb-2',
                  children: 'Regular Field (for comparison)',
                }),
                e.jsx(a, {
                  id: 'regular',
                  type: 'text',
                  placeholder: 'Standard styling',
                  className: 'w-full',
                }),
              ],
            }),
          ],
        }),
      ],
    }),
};
let u;
let p;
let h;
r.parameters = {
  ...r.parameters,
  docs: {
    ...((u = r.parameters) == null ? void 0 : u.docs),
    source: {
      originalSource: `{
  render: () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const validateEmail = (value: string) => {
      if (!value) return 'Email is required';
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return emailRegex.test(value) ? '' : 'Please enter a valid email address';
    };
    const validatePassword = (value: string) => {
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Password must be at least 8 characters';
      return '';
    };
    const emailError = submitted ? validateEmail(email) : '';
    const passwordError = submitted ? validatePassword(password) : '';
    return <div className="space-y-6 p-6 max-w-md">
        <div>
          <h3 className="text-lg font-semibold mb-4">Prevention vs Recovery Patterns</h3>
          <p className="text-sm text-gray-600 mb-6">
            Intelligence prevents errors before they occur, rather than just showing them after
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} variant={emailError ? 'error' : email && !emailError ? 'success' : 'default'} validationMode="live" showValidation={submitted} validationMessage={emailError} />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} variant={passwordError ? 'error' : password && !passwordError ? 'success' : 'default'} validationMode="onBlur" sensitive={true} showValidation={submitted} validationMessage={passwordError} />
          </div>
          
          <button type="button" onClick={() => setSubmitted(true)} className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
            Submit Form
          </button>
        </div>
      </div>;
  }
}`,
      ...((h = (p = r.parameters) == null ? void 0 : p.docs) == null ? void 0 : h.source),
    },
  },
};
let x;
let b;
let v;
l.parameters = {
  ...l.parameters,
  docs: {
    ...((x = l.parameters) == null ? void 0 : x.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-6 p-6 max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">Enhanced Touch Targets</h3>
        <p className="text-sm text-gray-600 mb-6">
          44px minimum touch targets on mobile, 40px on desktop for motor accessibility
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="mobile-input" className="block text-sm font-medium mb-2">
            Mobile-Optimized Input
          </label>
          <Input id="mobile-input" placeholder="Touch target: 44px mobile, 40px desktop" className="w-full" />
        </div>
        
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium mb-2">
            Search Field
          </label>
          <Input id="search-input" type="search" placeholder="Enhanced for search interactions" className="w-full" />
        </div>
      </div>
    </div>
}`,
      ...((v = (b = l.parameters) == null ? void 0 : b.docs) == null ? void 0 : v.source),
    },
  },
};
let g;
let f;
let y;
i.parameters = {
  ...i.parameters,
  docs: {
    ...((g = i.parameters) == null ? void 0 : g.docs),
    source: {
      originalSource: `{
  render: () => <div className="space-y-6 p-6 max-w-md">
      <div>
        <h3 className="text-lg font-semibold mb-4">Trust-Building Patterns</h3>
        <p className="text-sm text-gray-600 mb-6">
          Visual indicators and enhanced styling for sensitive data inputs
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="credit-card" className="block text-sm font-medium mb-2">
            Credit Card Number
          </label>
          <Input id="credit-card" type="text" placeholder="1234 5678 9012 3456" sensitive={true} className="w-full" />
          <p className="text-xs text-gray-500 mt-1">
            Enhanced border indicates secure field
          </p>
        </div>
        
        <div>
          <label htmlFor="ssn" className="block text-sm font-medium mb-2">
            Social Security Number
          </label>
          <Input id="ssn" type="password" placeholder="XXX-XX-XXXX" sensitive={true} className="w-full" />
          <p className="text-xs text-gray-500 mt-1">
            Visual trust indicators for sensitive data
          </p>
        </div>
        
        <div>
          <label htmlFor="regular" className="block text-sm font-medium mb-2">
            Regular Field (for comparison)
          </label>
          <Input id="regular" type="text" placeholder="Standard styling" className="w-full" />
        </div>
      </div>
    </div>
}`,
      ...((y = (f = i.parameters) == null ? void 0 : f.docs) == null ? void 0 : y.source),
    },
  },
};
const C = ['ValidationIntelligence', 'MotorAccessibility', 'TrustBuilding'];
export {
  l as MotorAccessibility,
  i as TrustBuilding,
  r as ValidationIntelligence,
  C as __namedExportsOrder,
  M as default,
};
