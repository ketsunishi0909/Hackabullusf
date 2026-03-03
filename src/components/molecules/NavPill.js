import { html } from '../../lib/html.js';

const NavPill = ({ links, applyHref }) => html`
  <nav className="nav-pill">
    ${links.map((link) => html`
      <a href=${link.href}>${link.label}</a>
    `)}
    <a href=${applyHref} target="_blank" rel="noopener" className="apply-btn">APPLY NOW</a>
  </nav>
`;

export default NavPill;
