import './style.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RaftersApp } from './app';

const root = createRoot(document.getElementById('app')!);
root.render(
  <StrictMode>
    <RaftersApp />
  </StrictMode>
);
