import { jsx as _jsx } from "react/jsx-runtime";
import './style.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RaftersApp } from './app';
const root = createRoot(document.getElementById('app'));
root.render(_jsx(StrictMode, { children: _jsx(RaftersApp, {}) }));
//# sourceMappingURL=main.js.map