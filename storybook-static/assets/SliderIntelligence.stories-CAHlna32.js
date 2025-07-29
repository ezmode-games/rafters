import { S as a } from './Slider-Nq1eD_aH.js';
import { r as t } from './iframe-Cy2I62ob.js';
import { j as e } from './jsx-runtime-BjG_zV1W.js';
import './index-DYn9WTcg.js';
import './index-BB5JR4LJ.js';
import './index-DuwuiYca.js';
import './index-DoQPmrLJ.js';
import './index-Cox8WoOv.js';
import './utils-DuMXYCiK.js';
const T = {
  title: '03 Components/Forms/Slider/Intelligence',
  component: a,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
const r = {
  render: () => {
    const [s, l] = t.useState([75]);
    const [n, i] = t.useState([50]);
    return e.jsxs('div', {
      className: 'space-y-8 p-6 max-w-lg',
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
                'Larger thumb and track sizes improve manipulation for users with motor challenges',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-6',
          children: [
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  className: 'block text-sm font-medium mb-3',
                  children: 'Volume Control (Standard)',
                }),
                e.jsx(a, {
                  value: s,
                  onValueChange: l,
                  max: 100,
                  step: 5,
                  showValue: !0,
                  unit: '%',
                  className: 'w-full',
                }),
                e.jsx('p', {
                  className: 'text-xs text-gray-500 mt-2',
                  children: 'Standard size with value display for precision',
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  className: 'block text-sm font-medium mb-3',
                  children: 'Brightness Control (Enhanced)',
                }),
                e.jsx(a, {
                  value: n,
                  onValueChange: i,
                  max: 100,
                  step: 10,
                  thumbSize: 'large',
                  trackSize: 'large',
                  showValue: !0,
                  unit: '%',
                  className: 'w-full',
                }),
                e.jsx('p', {
                  className: 'text-xs text-gray-500 mt-2',
                  children: 'Larger thumb and track for easier manipulation',
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
};
const m = {
  render: () => {
    const [s, l] = t.useState([72]);
    const [n, i] = t.useState([0.8]);
    return e.jsxs('div', {
      className: 'space-y-8 p-6 max-w-lg',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Precision and Context',
            }),
            e.jsx('p', {
              className: 'text-sm text-gray-600 mb-6',
              children:
                'Value labels and step indicators help users understand and control precise values',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-6',
          children: [
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  className: 'block text-sm font-medium mb-3',
                  children: 'Temperature Setting',
                }),
                e.jsx(a, {
                  value: s,
                  onValueChange: l,
                  min: 60,
                  max: 85,
                  step: 1,
                  showValue: !0,
                  showSteps: !0,
                  unit: '°F',
                  thumbSize: 'large',
                  trackSize: 'large',
                  className: 'w-full',
                }),
                e.jsx('p', {
                  className: 'text-xs text-gray-500 mt-2',
                  children: 'Step indicators show available values clearly',
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  className: 'block text-sm font-medium mb-3',
                  children: 'Opacity Level',
                }),
                e.jsx(a, {
                  value: n,
                  onValueChange: i,
                  min: 0,
                  max: 1,
                  step: 0.1,
                  showValue: !0,
                  unit: '',
                  thumbSize: 'large',
                  className: 'w-full',
                }),
                e.jsx('p', {
                  className: 'text-xs text-gray-500 mt-2',
                  children: 'Decimal precision with clear value feedback',
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
};
const c = {
  render: () => {
    const [s, l] = t.useState([2500]);
    const [n, i] = t.useState([30]);
    const [o, j] = t.useState([3]);
    const u = ['Low', 'Medium', 'High', 'Premium', 'Ultra'];
    return e.jsxs('div', {
      className: 'space-y-8 p-6 max-w-lg',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('h3', {
              className: 'text-lg font-semibold mb-4',
              children: 'Context-Rich Controls',
            }),
            e.jsx('p', {
              className: 'text-sm text-gray-600 mb-6',
              children:
                'Clear labels, units, and ranges reduce cognitive load for complex settings',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-6',
          children: [
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  className: 'block text-sm font-medium mb-3',
                  children: 'Project Budget',
                }),
                e.jsx(a, {
                  value: s,
                  onValueChange: l,
                  min: 1e3,
                  max: 1e4,
                  step: 250,
                  showValue: !0,
                  unit: '$',
                  thumbSize: 'large',
                  trackSize: 'large',
                  className: 'w-full',
                }),
                e.jsxs('div', {
                  className: 'flex justify-between text-xs text-gray-500 mt-1',
                  children: [
                    e.jsx('span', { children: 'Minimum: $1,000' }),
                    e.jsx('span', { children: 'Maximum: $10,000' }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  className: 'block text-sm font-medium mb-3',
                  children: 'Project Duration',
                }),
                e.jsx(a, {
                  value: n,
                  onValueChange: i,
                  min: 7,
                  max: 90,
                  step: 7,
                  showValue: !0,
                  unit: ' days',
                  thumbSize: 'large',
                  className: 'w-full',
                }),
                e.jsxs('div', {
                  className: 'flex justify-between text-xs text-gray-500 mt-1',
                  children: [
                    e.jsx('span', { children: '1 week' }),
                    e.jsx('span', { children: '~3 months' }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              children: [
                e.jsx('label', {
                  className: 'block text-sm font-medium mb-3',
                  children: 'Quality Level',
                }),
                e.jsx(a, {
                  value: o,
                  onValueChange: j,
                  min: 0,
                  max: 4,
                  step: 1,
                  showValue: !1,
                  thumbSize: 'large',
                  trackSize: 'large',
                  className: 'w-full',
                }),
                e.jsx('div', {
                  className: 'flex justify-between text-xs text-gray-500 mt-2',
                  children: u.map((d, S) =>
                    e.jsx(
                      'span',
                      { className: o[0] === S ? 'font-medium text-gray-900' : '', children: d },
                      d
                    )
                  ),
                }),
                e.jsxs('p', {
                  className: 'text-xs text-gray-500 mt-2',
                  children: ['Current: ', u[o[0]]],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
};
let x;
let p;
let h;
r.parameters = {
  ...r.parameters,
  docs: {
    ...((x = r.parameters) == null ? void 0 : x.docs),
    source: {
      originalSource: `{
  render: () => {
    const [volume, setVolume] = useState([75]);
    const [brightness, setBrightness] = useState([50]);
    return <div className="space-y-8 p-6 max-w-lg">
        <div>
          <h3 className="text-lg font-semibold mb-4">Enhanced Touch Targets</h3>
          <p className="text-sm text-gray-600 mb-6">
            Larger thumb and track sizes improve manipulation for users with motor challenges
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Volume Control (Standard)
            </label>
            <Slider value={volume} onValueChange={setVolume} max={100} step={5} showValue={true} unit="%" className="w-full" />
            <p className="text-xs text-gray-500 mt-2">
              Standard size with value display for precision
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Brightness Control (Enhanced)
            </label>
            <Slider value={brightness} onValueChange={setBrightness} max={100} step={10} thumbSize="large" trackSize="large" showValue={true} unit="%" className="w-full" />
            <p className="text-xs text-gray-500 mt-2">
              Larger thumb and track for easier manipulation
            </p>
          </div>
        </div>
      </div>;
  }
}`,
      ...((h = (p = r.parameters) == null ? void 0 : p.docs) == null ? void 0 : h.source),
    },
  },
};
let b;
let g;
let v;
m.parameters = {
  ...m.parameters,
  docs: {
    ...((b = m.parameters) == null ? void 0 : b.docs),
    source: {
      originalSource: `{
  render: () => {
    const [temperature, setTemperature] = useState([72]);
    const [opacity, setOpacity] = useState([0.8]);
    return <div className="space-y-8 p-6 max-w-lg">
        <div>
          <h3 className="text-lg font-semibold mb-4">Precision and Context</h3>
          <p className="text-sm text-gray-600 mb-6">
            Value labels and step indicators help users understand and control precise values
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Temperature Setting
            </label>
            <Slider value={temperature} onValueChange={setTemperature} min={60} max={85} step={1} showValue={true} showSteps={true} unit="°F" thumbSize="large" trackSize="large" className="w-full" />
            <p className="text-xs text-gray-500 mt-2">
              Step indicators show available values clearly
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Opacity Level
            </label>
            <Slider value={opacity} onValueChange={setOpacity} min={0} max={1} step={0.1} showValue={true} unit="" thumbSize="large" className="w-full" />
            <p className="text-xs text-gray-500 mt-2">
              Decimal precision with clear value feedback
            </p>
          </div>
        </div>
      </div>;
  }
}`,
      ...((v = (g = m.parameters) == null ? void 0 : g.docs) == null ? void 0 : v.source),
    },
  },
};
let y;
let N;
let f;
c.parameters = {
  ...c.parameters,
  docs: {
    ...((y = c.parameters) == null ? void 0 : y.docs),
    source: {
      originalSource: `{
  render: () => {
    const [budget, setBudget] = useState([2500]);
    const [duration, setDuration] = useState([30]);
    const [quality, setQuality] = useState([3]);
    const qualityLabels = ['Low', 'Medium', 'High', 'Premium', 'Ultra'];
    return <div className="space-y-8 p-6 max-w-lg">
        <div>
          <h3 className="text-lg font-semibold mb-4">Context-Rich Controls</h3>
          <p className="text-sm text-gray-600 mb-6">
            Clear labels, units, and ranges reduce cognitive load for complex settings
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Project Budget
            </label>
            <Slider value={budget} onValueChange={setBudget} min={1000} max={10000} step={250} showValue={true} unit="$" thumbSize="large" trackSize="large" className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum: $1,000</span>
              <span>Maximum: $10,000</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Project Duration
            </label>
            <Slider value={duration} onValueChange={setDuration} min={7} max={90} step={7} showValue={true} unit=" days" thumbSize="large" className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 week</span>
              <span>~3 months</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Quality Level
            </label>
            <Slider value={quality} onValueChange={setQuality} min={0} max={4} step={1} showValue={false} thumbSize="large" trackSize="large" className="w-full" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {qualityLabels.map((label, index) => <span key={label} className={quality[0] === index ? 'font-medium text-gray-900' : ''}>
                  {label}
                </span>)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Current: {qualityLabels[quality[0]]}
            </p>
          </div>
        </div>
      </div>;
  }
}`,
      ...((f = (N = c.parameters) == null ? void 0 : N.docs) == null ? void 0 : f.source),
    },
  },
};
const M = ['MotorAccessibility', 'PrecisionControl', 'CognitiveLoadOptimization'];
export {
  c as CognitiveLoadOptimization,
  r as MotorAccessibility,
  m as PrecisionControl,
  M as __namedExportsOrder,
  T as default,
};
