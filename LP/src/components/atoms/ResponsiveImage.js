import { html } from '../../lib/html.js';

const buildSrcSet = (base, ext, widths) =>
  widths.map((width) => `images/optimized/${base}-${width}.${ext} ${width}w`).join(', ');

const ResponsiveImage = ({
  base,
  alt,
  widths = [320, 480, 768, 1024, 1440],
  sizes = '(max-width: 768px) 100vw, 600px',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  decoding = 'async',
  fetchpriority,
  fallbackExt = 'jpg',
}) => {
  const fallbackWidth = widths[Math.floor(widths.length / 2)] || widths[0];
  return html`
  <picture className=${className}>
    <source type="image/avif" srcSet=${buildSrcSet(base, 'avif', widths)} sizes=${sizes} />
    <img
      src=${`images/optimized/${base}-${fallbackWidth}.${fallbackExt}`}
      srcSet=${buildSrcSet(base, fallbackExt, widths)}
      sizes=${sizes}
      alt=${alt}
      className=${imgClassName}
      loading=${loading}
      decoding=${decoding}
      fetchpriority=${fetchpriority}
    />
  </picture>
  `;
};

export default ResponsiveImage;
