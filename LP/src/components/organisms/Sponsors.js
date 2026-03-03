import { html } from '../../lib/html.js';
import SectionTitle from '../atoms/SectionTitle.js';
import ResponsiveImage from '../atoms/ResponsiveImage.js';

const Sponsors = ({ content }) => html`
  <section id="sponsors" className="sponsors">
    <div className="sponsors-inner">
      <${SectionTitle} text=${content.title} className="reveal" />
      <div className="sponsors-grid">
        ${content.grid.map((sponsor) => html`
          <div className="sponsor-card">
            <${ResponsiveImage}
              base=${sponsor.base}
              alt=${sponsor.alt}
              fallbackExt=${sponsor.ext}
              widths=${[320, 480, 768]}
              sizes="(max-width: 768px) 50vw, 260px"
            />
          </div>
        `)}
      </div>
    </div>

    <div className="sponsors-ticker">
      <div className="ticker-track">
        ${content.grid.concat(content.grid).map((sponsor) => html`
          <div className="ticker-item">
            <${ResponsiveImage}
              base=${sponsor.base}
              alt=${sponsor.alt}
              fallbackExt=${sponsor.ext}
              widths=${[320, 480]}
              sizes="120px"
            />
          </div>
        `)}
      </div>
    </div>
  </section>
`;

export default Sponsors;
