import { html } from '../../lib/html.js';
import SocialIcons from '../molecules/SocialIcons.js';
import NavPill from '../molecules/NavPill.js';

const TopBar = ({ socialLinks, navLinks, applyHref, isHidden }) => html`
  <div className=${`top-bar ${isHidden ? 'header-hidden' : ''}`.trim()}>
    <${SocialIcons} links=${socialLinks} />
    <${NavPill} links=${navLinks} applyHref=${applyHref} />
  </div>
`;

export default TopBar;
