import { useEffect, useRef } from "react";

type Marker = { lat: number; lon: number; weight: number; label: string };

/** Rotating wireframe globe with visitor markers — canvas 3D projection, no deps. */
export function Globe3D({ markers, height = 380 }: { markers: Marker[]; height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let angle = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const w = canvas.clientWidth;
      canvas.width = w * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const maxWeight = Math.max(1, ...markers.map((m) => m.weight));

    const project = (lat: number, lon: number, r: number, cx: number, cy: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + angle) * (Math.PI / 180);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      const tilt = -0.35;
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt);
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      return { x: cx + x, y: cy - y2, z: z2 };
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const cx = w / 2;
      const cy = height / 2;
      const r = Math.min(w, height) * 0.38;
      ctx.clearRect(0, 0, w, height);

      // halo
      const halo = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.5);
      halo.addColorStop(0, "rgba(0,95,234,0.35)");
      halo.addColorStop(1, "rgba(0,95,234,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // sphere body
      ctx.fillStyle = "rgba(8,24,64,0.55)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // parallels
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lon = 0; lon <= 360; lon += 4) {
          const p = project(lat, lon, r, cx, cy);
          ctx.strokeStyle = `rgba(255,255,255,${p.z > 0 ? 0.22 : 0.07})`;
          if (lon === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.stroke();
      }
      // meridians
      for (let lon = 0; lon < 180; lon += 30) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(lat, lon, r, cx, cy);
          if (lat === -90) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.stroke();
      }

      // outline
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // markers
      const t = Date.now() / 1000;
      for (const m of markers) {
        const p = project(m.lat, m.lon, r, cx, cy);
        const front = p.z > 0;
        const size = 2.5 + (m.weight / maxWeight) * 6;
        const pulse = 1 + Math.sin(t * 2 + m.lon) * 0.25;
        ctx.globalAlpha = front ? 1 : 0.22;
        ctx.fillStyle = "rgba(56,220,150,0.9)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        if (front) {
          ctx.strokeStyle = "rgba(56,220,150,0.35)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.2 * pulse, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      if (!reduce) angle += 0.18;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [markers, height]);

  return <canvas ref={ref} style={{ height }} className="w-full" aria-hidden />;
}