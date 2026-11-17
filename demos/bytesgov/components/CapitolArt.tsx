/* Line-art portico standing in for the hazy government-building photo:
   columns, pediment and steps drawn as hairlines, with slow light
   streaks flowing across. Purely decorative. */

const COLS = 8;
const LEFT = 70;
const SPAN = 460;

export function CapitolArt({ className }: { className?: string }) {
  const gap = SPAN / (COLS - 1);
  const cols = Array.from({ length: COLS }, (_, i) => LEFT + i * gap);

  return (
    <svg viewBox="0 0 600 720" className={className} aria-hidden="true" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="bg-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2457ff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#111" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="bg-streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2457ff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#2457ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g stroke="url(#bg-fade)" strokeWidth="1.2" fill="none">
        {/* dome drum + dome, faint, behind the portico */}
        <path d="M190 210 Q300 40 410 210" strokeOpacity="0.55" />
        <path d="M215 210 Q300 75 385 210" strokeOpacity="0.35" />
        <path d="M300 62 v-26 M292 36 h16" strokeOpacity="0.5" />
        <rect x="180" y="210" width="240" height="40" strokeOpacity="0.5" />
        {Array.from({ length: 11 }, (_, i) => (
          <path key={i} d={`M${192 + i * 21.6} 214 v32`} strokeOpacity="0.35" />
        ))}

        {/* pediment */}
        <path d="M40 360 L300 262 L560 360 Z" />
        <path d="M78 352 L300 279 L522 352" strokeOpacity="0.55" />
        <rect x="40" y="360" width="520" height="18" />
        <rect x="46" y="378" width="508" height="26" strokeOpacity="0.8" />
        {Array.from({ length: 26 }, (_, i) => (
          <path key={i} d={`M${56 + i * 19.4} 382 v18`} strokeOpacity="0.35" />
        ))}

        {/* columns */}
        {cols.map((x, i) => (
          <g key={i}>
            <rect x={x - 22} y="404" width="44" height="10" />
            <path d={`M${x - 19} 414 h38`} />
            <path d={`M${x - 16} 418 L${x - 18} 612 M${x + 16} 418 L${x + 18} 612`} />
            <path d={`M${x - 8} 420 L${x - 9} 610 M${x} 420 L${x} 610 M${x + 8} 420 L${x + 9} 610`} strokeOpacity="0.4" />
            <rect x={x - 22} y="612" width="44" height="9" />
          </g>
        ))}

        {/* steps */}
        <rect x="30" y="621" width="540" height="14" />
        <rect x="14" y="635" width="572" height="14" strokeOpacity="0.8" />
        <rect x="0" y="649" width="600" height="14" strokeOpacity="0.6" />
        <path d="M0 680 H600" strokeOpacity="0.4" />
      </g>

      {/* light streaks */}
      <g fill="none" strokeLinecap="round">
        <path className="flow-line" d="M-40 520 C 120 470, 260 560, 420 500 S 640 430, 700 460" stroke="url(#bg-streak)" strokeWidth="1.6" pathLength="1000" />
        <path className="flow-line" style={{ animationDelay: "-3s", animationDuration: "11s" }} d="M-40 300 C 140 250, 300 340, 460 290 S 640 230, 700 250" stroke="#2457ff" strokeOpacity="0.55" strokeWidth="1.2" pathLength="1000" />
        <path className="flow-line" style={{ animationDelay: "-6s", animationDuration: "13s" }} d="M-40 430 C 100 400, 280 450, 440 410 S 620 380, 700 400" stroke="#2457ff" strokeOpacity="0.4" strokeWidth="1" pathLength="1000" />
        <path className="flow-line" style={{ animationDelay: "-1.5s", animationDuration: "15s" }} d="M-40 600 C 160 570, 300 640, 480 590 S 640 560, 700 580" stroke="#2457ff" strokeOpacity="0.35" strokeWidth="1" pathLength="1000" />
      </g>

      <g fill="#2457ff">
        {[
          [90, 250, 0],
          [470, 200, -2],
          [520, 470, -4],
          [140, 560, -1],
          [360, 150, -3],
          [250, 480, -5],
          [560, 300, -6],
        ].map(([x, y, d], i) => (
          <circle key={i} className="drift" style={{ animationDelay: `${d}s` }} cx={x} cy={y} r={i % 2 ? 1.6 : 2.4} fillOpacity="0.7" />
        ))}
      </g>
    </svg>
  );
}
