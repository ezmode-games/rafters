import { r as p } from './iframe-Cy2I62ob.js';
import { j as s } from './jsx-runtime-BjG_zV1W.js';
import { c as u } from './utils-DuMXYCiK.js';
const d = p.forwardRef(
  (
    {
      variant: e = 'default',
      validationMode: o = 'onBlur',
      sensitive: c = !1,
      showValidation: l = !1,
      validationMessage: r,
      className: f,
      type: i,
      ...a
    },
    m
  ) => {
    const t = c || i === 'password' || i === 'email',
      n = e === 'error' && o === 'live';
    return s.jsxs('div', {
      className: 'relative',
      children: [
        s.jsx('input', {
          ref: m,
          type: i,
          className: u(
            'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-disabled',
            'transition-all duration-200',
            'hover:opacity-hover',
            'min-h-[44px] sm:min-h-[40px]',
            t && 'shadow-sm border-2',
            {
              'border-input bg-background focus-visible:ring-primary': e === 'default',
              'border-destructive bg-destructive/10 focus-visible:ring-destructive text-destructive-foreground':
                e === 'error',
              'border-success bg-success/10 focus-visible:ring-success text-success-foreground':
                e === 'success',
              'border-warning bg-warning/10 focus-visible:ring-warning text-warning-foreground':
                e === 'warning',
            },
            n && 'ring-2 ring-destructive/20',
            f
          ),
          'aria-invalid': e === 'error',
          'aria-describedby': l && r ? `${a.id || 'input'}-validation` : void 0,
          ...a,
        }),
        l &&
          r &&
          s.jsxs('div', {
            id: `${a.id || 'input'}-validation`,
            className: u('mt-1 text-xs flex items-center gap-1', {
              'text-destructive': e === 'error',
              'text-success': e === 'success',
              'text-warning': e === 'warning',
            }),
            role: e === 'error' ? 'alert' : 'status',
            'aria-live': n ? 'assertive' : 'polite',
            children: [
              e === 'error' &&
                s.jsx('span', {
                  className:
                    'w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center',
                  'aria-hidden': 'true',
                  children: s.jsx('span', { className: 'w-1 h-1 rounded-full bg-destructive' }),
                }),
              e === 'success' &&
                s.jsx('span', {
                  className: 'w-3 h-3 rounded-full bg-success/20 flex items-center justify-center',
                  'aria-hidden': 'true',
                  children: s.jsx('span', { className: 'w-1 h-1 rounded-full bg-success' }),
                }),
              e === 'warning' &&
                s.jsx('span', {
                  className: 'w-3 h-3 rounded-full bg-warning/20 flex items-center justify-center',
                  'aria-hidden': 'true',
                  children: s.jsx('span', { className: 'w-1 h-1 rounded-full bg-warning' }),
                }),
              r,
            ],
          }),
        t &&
          s.jsx('div', {
            className: 'absolute right-2 top-2 w-2 h-2 rounded-full bg-primary/30',
            'aria-hidden': 'true',
          }),
      ],
    });
  }
);
d.displayName = 'Input';
d.__docgenInfo = {
  description: '',
  methods: [],
  displayName: 'Input',
  props: {
    variant: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'default' | 'error' | 'success' | 'warning'",
        elements: [
          { name: 'literal', value: "'default'" },
          { name: 'literal', value: "'error'" },
          { name: 'literal', value: "'success'" },
          { name: 'literal', value: "'warning'" },
        ],
      },
      description: '',
      defaultValue: { value: "'default'", computed: !1 },
    },
    validationMode: {
      required: !1,
      tsType: {
        name: 'union',
        raw: "'live' | 'onBlur' | 'onSubmit'",
        elements: [
          { name: 'literal', value: "'live'" },
          { name: 'literal', value: "'onBlur'" },
          { name: 'literal', value: "'onSubmit'" },
        ],
      },
      description: '',
      defaultValue: { value: "'onBlur'", computed: !1 },
    },
    sensitive: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
    showValidation: {
      required: !1,
      tsType: { name: 'boolean' },
      description: '',
      defaultValue: { value: 'false', computed: !1 },
    },
    validationMessage: { required: !1, tsType: { name: 'string' }, description: '' },
  },
};
export { d as I };
