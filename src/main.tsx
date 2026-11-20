import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

import './styles/tokens.css';
import './styles/global.css';
import './styles/components.css';
import './styles/cursor.css';
import './styles/motion.css';
import './styles/scene.css';
import './styles/loader.css';
import './styles/pages.css';

import App from './App';

// Take over scroll restoration: every route starts at the top.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
