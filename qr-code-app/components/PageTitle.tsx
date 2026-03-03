interface PageTitleProps {
  children: string;
  fontSize?: number; // SVG user units (viewBox: 0 0 500 95)
}

// Arc warp via SVG textPath + perspective via CSS transform.
// font-style italic triggers browser synthetic slant (~15°).
// skewX(-8deg) on the wrapper adds ~8° more → total ~23° tilt.
// perspective(700px) rotateY(-4deg) compresses the left side
// and expands the right, giving the trapezoid / movement feel.
export default function PageTitle({ children, fontSize = 48 }: PageTitleProps) {
  const pid = 'pt-' + children.replace(/\W/g, '').toLowerCase();

  return (
    <h1
      aria-label={children}
      style={{
        display: 'inline-block',
        transform: 'perspective(700px) rotateY(-4deg) skewX(-8deg)',
        transformOrigin: 'center center',
      }}
    >
      <svg
        viewBox="0 0 500 95"
        aria-hidden="true"
        style={{ width: '340px', maxWidth: '88vw', overflow: 'visible', display: 'block' }}
      >
        <defs>
          {/* Subtle upward arc: endpoints at y=82, midpoint at y=66 (~16-unit lift) */}
          <path id={pid} d="M 5,82 Q 250,50 495,82" />
        </defs>
        <text
          fontSize={fontSize}
          fontStyle="italic"
          fill="white"
          letterSpacing="1"
          style={{ fontFamily: 'var(--font-audiowide), sans-serif' }}
        >
          <textPath href={`#${pid}`} startOffset="50%" textAnchor="middle">
            {children}
          </textPath>
        </text>
      </svg>
    </h1>
  );
}
