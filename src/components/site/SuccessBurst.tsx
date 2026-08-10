import { useMemo } from "react";

/** Celebratory confetti burst shown once a lead is submitted. */
export function SuccessBurst({ pieces = 26 }: { pieces?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => {
        const angle = (i / pieces) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 70 + Math.random() * 110;
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 20,
          delay: Math.random() * 0.18,
          size: 6 + Math.random() * 6,
          rotate: Math.random() * 360,
          round: i % 3 === 0,
          tone: i % 3,
        };
      }),
    [pieces],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
      <div className="absolute left-1/2 top-[86px] h-0 w-0">
        {bits.map((b, i) => (
          <span
            key={i}
            className={`confetti-bit absolute block ${b.round ? "rounded-full" : "rounded-[2px]"} ${
              b.tone === 0 ? "bg-brand" : b.tone === 1 ? "bg-brand-light" : "bg-ink/40"
            }`}
            style={
              {
                width: `${b.size}px`,
                height: `${b.size * (b.round ? 1 : 1.6)}px`,
                animationDelay: `${b.delay}s`,
                "--cx": `${b.x}px`,
                "--cy": `${b.y}px`,
                "--cr": `${b.rotate}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}