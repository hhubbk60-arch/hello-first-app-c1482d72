import { TN_GOVERNORATES, TN_VIEWBOX } from "./tunisia-geo";

/* Fully hand-built map: brand-tinted shades of the primary colour (#0B357E). */
const PALETTE = [
  "color-mix(in oklab, var(--brand) 14%, white)",
  "color-mix(in oklab, var(--brand) 30%, white)",
  "color-mix(in oklab, var(--brand) 48%, white)",
  "color-mix(in oklab, var(--brand) 66%, white)",
];

/* Message route colours: alternating green / red pulses. */
const ROUTE_GREEN = "oklch(0.65 0.22 145)";
const ROUTE_RED = "oklch(0.62 0.22 25)";
const ROUTE_COLOURS = [ROUTE_GREEN, ROUTE_RED];

/* Manual colour index so neighbours never share a colour. */
const COLOR_BY_NAME: Record<string, number> = {
  Bizerte: 0,
  Ariana: 1,
  Tunis: 2,
  Manouba: 2,
  "Ben Arous": 1,
  Nabeul: 3,
  Béja: 1,
  Jendouba: 2,
  Zaghouan: 3,
  "Le Kef": 3,
  Siliana: 0,
  Sousse: 1,
  Kairouan: 3,
  Monastir: 3,
  Mahdia: 2,
  Kasserine: 2,
  "Sidi Bouzid": 1,
  Sfax: 0,
  Gafsa: 3,
  Tozeur: 1,
  Gabès: 2,
  Kébili: 0,
  Médenine: 3,
  Tataouine: 1,
};

/* Small nudges so dense northern labels stay inside their governorate. */
const LABEL_OFFSET: Record<string, [number, number]> = {
  Tunis: [10, -6],
  Ariana: [-2, -14],
  Manouba: [-26, 0],
  "Ben Arous": [6, 12],
  Monastir: [12, 2],
  Mahdia: [6, 6],
};

export function TunisiaMap({ className = "" }: { className?: string }) {
  const byName = new Map(TN_GOVERNORATES.map((g) => [g.n, g] as const));
  const ROUTES: Array<[string, string]> = [
    ["Tunis", "Sfax"],
    ["Tunis", "Jendouba"],
    ["Sousse", "Tozeur"],
    ["Sfax", "Médenine"],
    ["Bizerte", "Kairouan"],
    ["Gabès", "Tataouine"],
    ["Nabeul", "Gafsa"],
  ];

  const arcs = ROUTES.map(([a, b], i) => {
    const A = byName.get(a);
    const B = byName.get(b);
    if (!A || !B) return null;
    const mx = (A.cx + B.cx) / 2;
    const my = (A.cy + B.cy) / 2;
    const dx = B.cx - A.cx;
    const dy = B.cy - A.cy;
    const len = Math.hypot(dx, dy) || 1;
    /* Perpendicular offset gives every route a smooth outward bow. */
    const bow = len * 0.28 * (i % 2 === 0 ? 1 : -1);
    const qx = mx + (-dy / len) * bow;
    const qy = my + (dx / len) * bow;
    const colour = ROUTE_COLOURS[i % ROUTE_COLOURS.length];
    return {
      id: `${a}-${b}`,
      d: `M ${A.cx} ${A.cy} Q ${qx} ${qy} ${B.cx} ${B.cy}`,
      from: A,
      to: B,
      delay: i * 0.75,
      colour,
    };
  }).filter(Boolean) as Array<{
    id: string;
    d: string;
    from: { cx: number; cy: number };
    to: { cx: number; cy: number };
    delay: number;
    colour: string;
  }>;

  return (
    <svg
      viewBox={TN_VIEWBOX}
      role="img"
      aria-label="Carte de la Tunisie et de ses 24 gouvernorats couverts"
      className={className}
    >
      <defs>
        <linearGradient id="tn-arc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--brand)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
        <filter id="tn-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g strokeLinejoin="round">
        {TN_GOVERNORATES.map((g) => (
          <path
            key={g.n}
            d={g.d}
            fill={PALETTE[COLOR_BY_NAME[g.n] ?? 0]}
            stroke="#ffffff"
            strokeWidth={2.2}
            className="transition-[fill] duration-200 hover:[fill:var(--brand)]"
          />
        ))}
      </g>

      {/* Message routes: drawing arcs + travelling packets */}
      <g className="pointer-events-none motion-reduce:hidden" filter="url(#tn-glow)">
        {arcs.map((a) => (
          <g key={a.id}>
            <path
              d={a.d}
              fill="none"
              stroke="url(#tn-arc)"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeDasharray="220 900"
              opacity={0.85}
            >
              <animate
                attributeName="stroke-dashoffset"
                from="1120"
                to="-220"
                dur="5s"
                begin={`${a.delay}s`}
                repeatCount="indefinite"
              />
            </path>

            <circle r={5} fill="var(--brand)">
              <animate
                attributeName="r"
                values="0;5;5;0"
                keyTimes="0;0.08;0.92;1"
                dur="5s"
                begin={`${a.delay}s`}
                repeatCount="indefinite"
              />
              <animateMotion dur="5s" begin={`${a.delay}s`} repeatCount="indefinite" path={a.d} />
            </circle>

            {/* Sender + receiver pulses */}
            {[a.from, a.to].map((p, k) => (
              <circle key={k} cx={p.cx} cy={p.cy} fill="none" stroke="var(--brand)" strokeWidth={2}>
                <animate
                  attributeName="r"
                  values="2;2;18"
                  keyTimes="0;0.7;1"
                  dur="5s"
                  begin={`${a.delay + (k === 0 ? 0 : 4.4)}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.7;0"
                  keyTimes="0;0.7;1"
                  dur="5s"
                  begin={`${a.delay + (k === 0 ? 0 : 4.4)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        ))}
      </g>

      <g
        fontSize={16}
        fontWeight={600}
        fill="var(--ink)"
        textAnchor="middle"
        className="pointer-events-none"
        style={{ paintOrder: "stroke" }}
      >
        {TN_GOVERNORATES.map((g) => {
          const [dx, dy] = LABEL_OFFSET[g.n] ?? [0, 0];
          return (
            <text key={g.n} x={g.cx + dx} y={g.cy + dy} stroke="#ffffff" strokeWidth={3.5} strokeOpacity={0.9}>
              {g.n.toUpperCase()}
            </text>
          );
        })}
      </g>
    </svg>
  );
}