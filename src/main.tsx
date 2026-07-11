import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DevProvider } from './context/DevContext';
import { DevPanel } from './components/DevPanel';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DevProvider>
      <App />
      <DevPanel />
    </DevProvider>
  </StrictMode>,
);
