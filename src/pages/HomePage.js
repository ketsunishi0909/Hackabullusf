import { html, useEffect, useState } from '../lib/html.js';
import {
  aboutContent,
  faqContent,
  galleryContent,
  heroContent,
  navLinks,
  socialLinks,
  sponsorsContent,
  tracksContent,
} from '../data/content.js';
import TopBar from '../components/organisms/TopBar.js';
import Hero from '../components/organisms/Hero.js';
import About from '../components/organisms/About.js';
import Tracks from '../components/organisms/Tracks.js';
import Gallery from '../components/organisms/Gallery.js';
import Sponsors from '../components/organisms/Sponsors.js';
import FAQ from '../components/organisms/FAQ.js';

const HomePage = () => {
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    let lastScroll = 0;
    const scrollThreshold = 60;

    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastScroll && current > scrollThreshold) {
        setHeaderHidden(true);
      } else {
        setHeaderHidden(false);
      }
      lastScroll = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .sponsor-card';
    const revealEls = document.querySelectorAll(selectors);

    if (!revealEls.length) return undefined;

    if ('IntersectionObserver' in window) {
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach((el) => revealObs.observe(el));
      return () => revealObs.disconnect();
    }

    revealEls.forEach((el) => el.classList.add('visible'));
    return undefined;
  }, []);

  return html`
    <div>
      <${TopBar}
        socialLinks=${socialLinks}
        navLinks=${navLinks}
        applyHref=${heroContent.applyHref}
        isHidden=${headerHidden}
      />
      <${Hero} content=${heroContent} />
      <${About} content=${aboutContent} />
      <${Tracks} items=${tracksContent} />
      <${Gallery} content=${galleryContent} />
      <${Sponsors} content=${sponsorsContent} />
      <${FAQ} content=${faqContent} />
    </div>
  `;
};

export default HomePage;
