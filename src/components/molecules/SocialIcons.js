import { html } from '../../lib/html.js';
import IconLink from '../atoms/IconLink.js';

const SocialIcons = ({ links }) => html`
  <div className="social-icons-top">
    ${links.map((link) => html`
      <${IconLink}
        href=${link.href}
        base=${link.base}
        alt=${link.alt}
        fallbackExt=${link.ext}
      />
    `)}
  </div>
`;

export default SocialIcons;
