import { html } from '../../lib/html.js';

const PillButton = ({ label }) => html`
  <button className="pill-btn" type="button">${label}</button>
`;

export default PillButton;
