import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
// Studio-specific styles (sidebar, header, layout)
import './styles/global.css';
// Split CSS for instant HMR:
// - rafters.tailwind.css: static @theme inline with var() refs (processed once by Tailwind)
// - rafters.vars.css: pure CSS variables (instant HMR on token changes)
import '@rafters-output/rafters.tailwind.css';
import '@rafters-output/rafters.vars.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
