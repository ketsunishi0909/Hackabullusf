import { html, useEffect, useRef, useState } from '../../lib/html.js';
import SectionTitle from '../atoms/SectionTitle.js';

const Tracks = ({ items }) => {
  const carouselRef = useRef(null);
  const angleRef = useRef(0);
  const intervalRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const startAutoRotate = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      angleRef.current -= 0.4;
      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateY(${angleRef.current}deg)`;
      }
    }, 16);
  };

  useEffect(() => {
    startAutoRotate();
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleClick = (index) => {
    if (!carouselRef.current) return;
    clearInterval(intervalRef.current);
    const targetAngle = -(index * 90);
    angleRef.current = targetAngle;
    carouselRef.current.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    carouselRef.current.style.transform = `rotateY(${targetAngle}deg)`;
    setActiveIndex(index);

    setTimeout(() => {
      if (carouselRef.current) {
        carouselRef.current.style.transition = '';
      }
      startAutoRotate();
    }, 3000);
  };

  const activeItem = items[activeIndex] || items[0];

  return html`
    <section id="tracks" className="tracks">
      <div className="tracks-inner">
        <div className="tracks-left">
          <${SectionTitle} text="TRACKS" className="track-title" />
        </div>
        <div className="carousel-container">
          <div className="carousel" ref=${carouselRef}>
            ${items.map((item, index) => html`
              <div
                className=${`carousel-item ${index === activeIndex ? 'active' : ''}`.trim()}
                data-index=${index}
                onClick=${() => handleClick(index)}
                role="button"
                tabIndex="0"
                onKeyDown=${(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleClick(index);
                  }
                }}
              >
                <img src=${item.img} alt=${item.alt} />
              </div>
            `)}
          </div>
          <div className="carousel-info">
            <h3 className="carousel-title">${activeItem.title}</h3>
            <p className="carousel-desc">${activeItem.desc}</p>
          </div>
        </div>
      </div>
    </section>
  `;
};

export default Tracks;
