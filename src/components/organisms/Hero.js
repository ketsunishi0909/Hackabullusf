import { html } from '../../lib/html.js';

const Hero = ({ content }) => html`
  <section className="hero" id="home">
    <div className="hero-content fade-in">
      <div className="hero-pack">
        <h1 className="glow hero-logo-wrap">
          <img src="images/hackabull_logo.png" alt="HackaBull logo" className="site-logo" />
        </h1>
        <div className="hero-subtitles">
          <div className="hero-tagline hero-subtitle-1 text-shine-white">
            ${content.tagline}
          </div>
          <div className="hero-tagline hero-subtitle-2 text-shine-white text-shine-red">
            ${content.date}
          </div>
          <div className="hero-apply-wrap">
            <a
              href=${content.applyHref}
              target="_blank"
              rel="noopener"
              className="hero-apply-btn Btn-Container"
              aria-label="Apply now for Hackabull"
            >
              <span className="text">APPLY NOW</span>
              <span className="icon-Container" aria-hidden="true">
                <svg
                  className="arrow"
                  width="28"
                  height="28"
                  viewBox="0 0 16 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="1.6" cy="1.6" r="1.5" fill="currentColor"></circle>
                  <circle cx="5.7" cy="1.6" r="1.5" fill="currentColor"></circle>
                  <circle cx="5.7" cy="5.5" r="1.5" fill="currentColor"></circle>
                  <circle cx="9.8" cy="5.5" r="1.5" fill="currentColor"></circle>
                  <circle cx="9.8" cy="9.5" r="1.5" fill="currentColor"></circle>
                  <circle cx="14" cy="9.5" r="1.5" fill="currentColor"></circle>
                  <circle cx="5.7" cy="13.4" r="1.5" fill="currentColor"></circle>
                  <circle cx="9.8" cy="13.4" r="1.5" fill="currentColor"></circle>
                  <circle cx="1.6" cy="17.3" r="1.5" fill="currentColor"></circle>
                  <circle cx="5.7" cy="17.3" r="1.5" fill="currentColor"></circle>
                </svg>
              </span>
            </a>
          </div>
        </div>
      </div>
      <a href="https://www.shpeusf.com" target="_blank" rel="noopener" className="shpe-logo-link">
        <img src="images/SHPE_logo.png" alt="SHPE" className="shpe-logo" />
      </a>
    </div>
  </section>
`;

export default Hero;
