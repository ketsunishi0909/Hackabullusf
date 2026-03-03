import { html, useEffect, useRef, useState } from '../../lib/html.js';
import SectionTitle from '../atoms/SectionTitle.js';
import ResponsiveImage from '../atoms/ResponsiveImage.js';

const Gallery = ({ content }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);
  const slides = content.slides;

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3800);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentIndex((index + slides.length) % slides.length);
    startInterval();
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  return html`
    <section id="gallery" className="gallery">
      <div className="gallery-inner">
        <${SectionTitle} text=${content.title} className="reveal" />
        <p className="gallery-sub reveal">${content.subtitle}</p>
        <div className="slideshow-wrapper reveal-scale">
          <div className="slideshow">
            ${slides.map((slide, index) => html`
              <${ResponsiveImage}
                base=${slide.base}
                alt=${slide.alt}
                className=${`slide ${index === currentIndex ? 'active' : ''}`.trim()}
                imgClassName=\"slide-img\"
                sizes=\"(max-width: 768px) 100vw, 600px\"
              />
            `)}
          </div>
          <button className="slide-btn prev" onClick=${prevSlide} aria-label="Previous slide">&#8249;</button>
          <button className="slide-btn next" onClick=${nextSlide} aria-label="Next slide">&#8250;</button>
          <div className="slide-dots">
            ${slides.map((_, index) => html`
              <div
                className=${`dot ${index === currentIndex ? 'active' : ''}`.trim()}
                onClick=${() => goToSlide(index)}
                role="button"
                tabIndex="0"
                onKeyDown=${(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    goToSlide(index);
                  }
                }}
              ></div>
            `)}
          </div>
        </div>
        <p className="gallery-caption">${content.caption}</p>
      </div>
    </section>
  `;
};

export default Gallery;
