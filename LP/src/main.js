import { React, html } from './lib/html.js';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import HomePage from './pages/HomePage.js';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement);

root.render(html`<${HomePage} />`);
