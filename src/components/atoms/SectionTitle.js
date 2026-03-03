import { html } from '../../lib/html.js';

const SectionTitle = ({ id, text, className = '' }) => html`
  <h2 id=${id} className=${`section-title glow ${className}`.trim()}>${text}</h2>
`;

export default SectionTitle;
