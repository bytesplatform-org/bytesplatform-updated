/** Abstract invoice → ASP → Peppol / FTA composition. Motion is CSS-only and off under reduced motion. */
export default function LoginArt() {
  const blue = "#2457ff";
  return (
    <svg viewBox="0 0 560 360" className="h-auto w-full" role="img" aria-label="An invoice flowing through an accredited service provider to Peppol and the FTA">
      <defs>
        <linearGradient id="bb-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#f6f7ff" />
        </linearGradient>
        <filter id="bb-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#2457ff" floodOpacity="0.14" />
        </filter>
        <radialGradient id="bb-glow">
          <stop offset="0" stopColor={blue} stopOpacity="0.28" />
          <stop offset="1" stopColor={blue} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* network lines */}
      <g fill="none" strokeLinecap="round">
        <path d="M196 180 C 250 180, 262 180, 318 180" stroke="rgb(36 87 255 / .18)" strokeWidth="2" />
        <path d="M196 180 C 250 180, 262 180, 318 180" stroke={blue} strokeWidth="2" strokeDasharray="6 18" className="anim-dash" />
        <path d="M374 166 C 410 130, 420 96, 462 92" stroke="rgb(36 87 255 / .18)" strokeWidth="2" />
        <path d="M374 166 C 410 130, 420 96, 462 92" stroke={blue} strokeWidth="2" strokeDasharray="6 18" className="anim-dash" />
        <path d="M374 194 C 410 230, 420 264, 462 268" stroke="rgb(36 87 255 / .18)" strokeWidth="2" />
        <path d="M374 194 C 410 230, 420 264, 462 268" stroke={blue} strokeWidth="2" strokeDasharray="6 18" className="anim-dash" style={{ animationDelay: "-1.2s" }} />
      </g>

      {/* invoice */}
      <g className="anim-float" filter="url(#bb-shadow)">
        <rect x="40" y="70" width="156" height="210" rx="18" fill="url(#bb-card)" stroke="rgb(17 17 17 / .12)" />
        <rect x="60" y="92" width="58" height="8" rx="4" fill="#111" opacity=".85" />
        <rect x="60" y="108" width="92" height="6" rx="3" fill="#111" opacity=".18" />
        <g opacity=".22" fill="#111">
          <rect x="60" y="138" width="116" height="5" rx="2.5" />
          <rect x="60" y="154" width="100" height="5" rx="2.5" />
          <rect x="60" y="170" width="108" height="5" rx="2.5" />
          <rect x="60" y="186" width="84" height="5" rx="2.5" />
        </g>
        <line x1="60" y1="210" x2="176" y2="210" stroke="rgb(17 17 17 / .12)" />
        <rect x="60" y="224" width="40" height="6" rx="3" fill="#111" opacity=".3" />
        <rect x="128" y="221" width="48" height="10" rx="5" fill={blue} />
        <g transform="translate(152 248)">
          <circle r="14" fill="#e9f2ec" />
          <path d="m-6 0 4 4 8-8" stroke="#2f6a47" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="60" y="262" fontSize="9" fontWeight="600" letterSpacing="1.2" fill="#6b665d">PINT AE</text>
      </g>

      {/* ASP hub */}
      <circle cx="346" cy="180" r="62" fill="url(#bb-glow)" className="anim-pulse" />
      <g filter="url(#bb-shadow)">
        <circle cx="346" cy="180" r="30" fill={blue} />
      </g>
      <text x="346" y="184.5" textAnchor="middle" fontSize="13" fontWeight="600" fill="#fff" letterSpacing=".5">ASP</text>

      {/* Peppol + FTA */}
      {[
        { y: 92, label: "Peppol", sub: "Buyer delivery" },
        { y: 268, label: "FTA", sub: "Tax Data Document" },
      ].map((n, i) => (
        <g key={n.label}>
          <circle cx="486" cy={n.y} r="36" fill="url(#bb-glow)" className="anim-pulse" style={{ animationDelay: `${-i * 1.4}s` }} />
          <g filter="url(#bb-shadow)">
            <rect x="452" y={n.y - 22} width="96" height="44" rx="22" fill="#fff" stroke="rgb(17 17 17 / .12)" />
          </g>
          <circle cx="472" cy={n.y} r="5" fill={blue} />
          <text x="484" y={n.y + 4.5} fontSize="13" fontWeight="600" fill="#111">{n.label}</text>
          <text x="500" y={n.y + 40} textAnchor="middle" fontSize="10" fill="#6b665d">{n.sub}</text>
        </g>
      ))}
    </svg>
  );
}
