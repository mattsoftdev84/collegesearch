// App bundle -> deploy/mainmenu.js. Needs, in order: DataMethods.js, mainmenu-vendor.js.
// Mounts into <div id="sapien-root"></div>.
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

function mount() {
  const el = document.getElementById('sapien-root');
  if (!el) {
    console.error('SAPIEN: no <div id="sapien-root"> on the page.');
    return;
  }
  createRoot(el).render(<App rootEl={el} />);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();
