interface PageTitleProps {
  children: string;
  fontSize?: number;
}

export default function PageTitle({ children, fontSize = 48 }: PageTitleProps) {
  return (
    <h1
      aria-label={children}
      style={{
        display: 'inline-block',
        transform: 'perspective(200px) rotateY(22deg) skewX(-6deg)',
        transformOrigin: 'center center',
      }}
    >
      <svg
        viewBox="0 0 500 80"
        aria-hidden="true"
        style={{ width: '340px', maxWidth: '88vw', overflow: 'visible', display: 'block' }}
      >
        <text
          x="250"
          y="65"
          textAnchor="middle"
          fontSize={fontSize}
          fontStyle="italic"
          fontWeight="bold"
          fill="white"
          letterSpacing="1"
          style={{ fontFamily: 'var(--font-audiowide), sans-serif' }}
        >
          {children}
        </text>
      </svg>
    </h1>
  );
}
