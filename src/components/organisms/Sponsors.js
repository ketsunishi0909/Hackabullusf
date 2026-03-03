import { html } from '../../lib/html.js';
import SectionTitle from '../atoms/SectionTitle.js';

const Sponsors = ({ content }) => html`
  <section id="sponsors" className="sponsors">
    <div className="sponsors-inner">
      <${SectionTitle} text=${content.title} className="reveal" />
      <div className="sponsors-grid">
        ${content.grid.map((sponsor) => html`
          <div className="sponsor-card">
            <img src=${sponsor.img} alt=${sponsor.alt} />
          </div>
        `)}
      </div>
    </div>

    <div className="sponsors-ticker">
      <div className="ticker-track">
        ${content.grid.concat(content.grid).map((sponsor) => html`
          <div className="ticker-item"><img src=${sponsor.img} alt=${sponsor.alt} /></div>
        `)}
      </div>
    </div>
  </section>
`;

export default Sponsors;
