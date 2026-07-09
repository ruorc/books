import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Critical runtime error: Failed to find the root element inside DOM matrix.'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
