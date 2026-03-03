import { html } from '../../lib/html.js';
import SectionTitle from '../atoms/SectionTitle.js';
import PillButton from '../atoms/PillButton.js';

const About = ({ content }) => html`
  <section id="about" className="about">
    <div className="about-inner">
      <${SectionTitle} text=${content.title} className="reveal" />
      <p className="lead reveal">${content.lead}</p>
      <div className="about-pills reveal stagger-children">
        ${content.pills.map((pill) => html`<${PillButton} label=${pill} />`)}
      </div>
      <p className="faq-link reveal">
        Want to learn more? Check our <a href="#faq">FAQ</a>
      </p>
    </div>
  </section>
`;

export default About;
