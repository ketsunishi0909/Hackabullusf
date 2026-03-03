import { html } from '../../lib/html.js';

const IconLink = ({ href, img, alt, className = '' }) => html`
  <a href=${href} target="_blank" rel="noopener" className=${className}>
    <img src=${img} alt=${alt} />
  </a>
`;

export default IconLink;
