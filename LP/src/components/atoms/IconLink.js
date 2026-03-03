import { html } from '../../lib/html.js';
import ResponsiveImage from './ResponsiveImage.js';

const IconLink = ({ href, base, alt, fallbackExt = 'jpg', className = '' }) => html`
  <a href=${href} target="_blank" rel="noopener" className=${className}>
    <${ResponsiveImage}
      base=${base}
      alt=${alt}
      fallbackExt=${fallbackExt}
      widths=${[320, 480]}
      sizes="72px"
    />
  </a>
`;

export default IconLink;
