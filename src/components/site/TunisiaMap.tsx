import { TN_GOVERNORATES, TN_VIEWBOX } from "./tunisia-geo";

/* Fully hand-built map: brand-tinted shades of the primary colour (#0B357E). */
const PALETTE = [
  "color-mix(in oklab, var(--brand) 14%, white)",
  "color-mix(in oklab, var(--brand) 30%, white)",
  "color-mix(in oklab, var(--brand) 48%, white)",
  "color-mix(in oklab, var(--brand) 66%, white)",
];

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
  return (
    <svg
      viewBox={TN_VIEWBOX}
      role="img"
      aria-label="Carte de la Tunisie et de ses 24 gouvernorats couverts"
      className={className}
    >
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