'use client';

/**
 * LivingMotif v2 — BB Africa hero
 *
 * Outlined ribbon paths + African commerce network:
 * particles travel along clear stroke-like trade routes between
 * soft market hubs (Lagos · Nairobi · Cape Town · Accra · Dakar).
 * Cursor leaves a disturbance. Brand green on primary flows.
 *
 *   <div className="hero-motif" id="motif" aria-hidden="true">
 *     <LivingMotif />
 *   </div>
 */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

type Particle = {
  // path-following
  route: number;
  t: number; // 0–1 along route
  speed: number;
  offset: number; // perpendicular offset for outline thickness
  size: number;
  alpha: number;
  green: boolean;
  // for hubs that orbit
  kind: 'route' | 'hub';
  hub?: number;
  angle?: number;
  radius?: number;
};

type Hub = {
  x: number; // 0–1 normalized
  y: number;
  r: number;
  pulse: number;
};

type Props = {
  density?: number;
  className?: string;
};

/** Cubic bezier point */
function bez(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}

/** Approximate tangent for perpendicular offset */
function bezDeriv(
  t: number,
  p0: number,
  p1: number,
  p2: number,
  p3: number
): number {
  const u = 1 - t;
  return (
    3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2)
  );
}

/**
 * Ribbon routes — outlined trade arcs across the hero.
 * Coordinates are normalized 0–1 (will scale to canvas).
 * Each route: [x0,y0, cx1,cy1, cx2,cy2, x1,y1]
 */
const ROUTES: number[][] = [
  // upper sweep — west → east
  [0.02, 0.28, 0.25, 0.12, 0.55, 0.38, 0.98, 0.22],
  // mid high
  [0.0, 0.42, 0.3, 0.28, 0.65, 0.52, 1.0, 0.36],
  // central commerce spine
  [0.0, 0.55, 0.28, 0.48, 0.7, 0.62, 1.0, 0.5],
  // mid low
  [0.02, 0.68, 0.32, 0.58, 0.62, 0.78, 0.98, 0.64],
  // lower sweep
  [0.0, 0.8, 0.28, 0.72, 0.58, 0.9, 1.0, 0.78],
  // cross-link (diagonal trade)
  [0.08, 0.2, 0.35, 0.55, 0.55, 0.35, 0.92, 0.72],
  // secondary cross
  [0.05, 0.75, 0.4, 0.4, 0.6, 0.7, 0.95, 0.28],
];

/** Soft market hubs (normalized). Order suggests major corridors. */
const HUBS: Hub[] = [
  { x: 0.18, y: 0.48, r: 18, pulse: 0.0 }, // Lagos-ish
  { x: 0.42, y: 0.32, r: 14, pulse: 1.2 }, // Accra / West
  { x: 0.55, y: 0.58, r: 16, pulse: 2.1 }, // Nairobi
  { x: 0.72, y: 0.4, r: 13, pulse: 0.6 }, // East corridor
  { x: 0.38, y: 0.72, r: 12, pulse: 1.7 }, // Southern link
  { x: 0.78, y: 0.68, r: 15, pulse: 0.9 }, // Cape corridor
];

export default function LivingMotif({ density = 1, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const particles = useRef<Particle[]>([]);
  const raf = useRef(0);
  const time = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const pointOnRoute = (route: number[], t: number, off: number) => {
      const [x0, y0, x1, y1, x2, y2, x3, y3] = route;
      const px = bez(t, x0, x1, x2, x3) * w;
      const py = bez(t, y0, y1, y2, y3) * h;
      const dx = bezDeriv(t, x0, x1, x2, x3) * w;
      const dy = bezDeriv(t, y0, y1, y2, y3) * h;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      // perpendicular
      const nx = -dy / len;
      const ny = dx / len;
      return { x: px + nx * off, y: py + ny * off };
    };

    const seed = () => {
      const list: Particle[] = [];
      const routeCount = Math.floor(420 * density * (reduce ? 0.4 : 1));
      const hubCount = Math.floor(90 * density * (reduce ? 0.4 : 1));

      // Particles that outline and travel the ribbon routes
      for (let i = 0; i < routeCount; i++) {
        const route = i % ROUTES.length;
        // Prefer edge of the stroke for a clearer outline feel
        const edge = Math.random() > 0.35;
        const offset = edge
          ? (Math.random() > 0.5 ? 1 : -1) * (2.5 + Math.random() * 5.5)
          : (Math.random() - 0.5) * 3;
        list.push({
          kind: 'route',
          route,
          t: Math.random(),
          speed: 0.00015 + Math.random() * 0.00055,
          offset,
          size: edge ? 0.9 + Math.random() * 1.1 : 0.5 + Math.random() * 0.7,
          alpha: edge ? 0.35 + Math.random() * 0.45 : 0.12 + Math.random() * 0.25,
          green: route === 2 || route === 5 || Math.random() > 0.82,
        });
      }

      // Hub orbit particles — market nodes
      for (let i = 0; i < hubCount; i++) {
        const hub = i % HUBS.length;
        list.push({
          kind: 'hub',
          route: 0,
          t: 0,
          speed: 0.4 + Math.random() * 0.8,
          offset: 0,
          size: 0.7 + Math.random() * 1.2,
          alpha: 0.25 + Math.random() * 0.4,
          green: hub === 0 || hub === 2 || Math.random() > 0.7,
          hub,
          angle: Math.random() * Math.PI * 2,
          radius: 6 + Math.random() * (HUBS[hub].r * 0.9),
        });
      }

      particles.current = list;
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active = true;
    };
    const onLeave = () => {
      mouse.current.active = false;
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };

    const drawHubRings = (t: number) => {
      for (let i = 0; i < HUBS.length; i++) {
        const hub = HUBS[i];
        const cx = hub.x * w;
        const cy = hub.y * h;
        const pulse = 1 + Math.sin(t * 0.9 + hub.pulse) * 0.08;
        const r = hub.r * pulse;

        // Outer faint ring
        ctx.beginPath();
        ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(14, 186, 88, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner outlined ring
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core
        ctx.beginPath();
        ctx.arc(cx, cy, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 || i === 2 ? 'rgba(14, 186, 88, 0.55)' : 'rgba(255, 255, 255, 0.35)';
        ctx.fill();
      }
    };

    /** Very faint static outline of the ribbon paths for structure */
    const drawRouteGuides = () => {
      ctx.lineWidth = 1;
      for (let i = 0; i < ROUTES.length; i++) {
        const r = ROUTES[i];
        ctx.beginPath();
        ctx.moveTo(r[0] * w, r[1] * h);
        ctx.bezierCurveTo(r[2] * w, r[3] * h, r[4] * w, r[5] * h, r[6] * w, r[7] * h);
        ctx.strokeStyle =
          i === 2 || i === 5
            ? 'rgba(14, 186, 88, 0.07)'
            : 'rgba(255, 255, 255, 0.04)';
        ctx.stroke();
      }
    };

    const draw = (ts: number) => {
      time.current = ts * 0.001;
      const t = time.current;
      ctx.clearRect(0, 0, w, h);

      drawRouteGuides();
      drawHubRings(t);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const live = mouse.current.active && !reduce;

      for (const p of particles.current) {
        let x = 0;
        let y = 0;

        if (p.kind === 'route') {
          p.t += p.speed * (reduce ? 0.4 : 1);
          if (p.t > 1) p.t -= 1;
          if (p.t < 0) p.t += 1;
          const pt = pointOnRoute(ROUTES[p.route], p.t, p.offset);
          x = pt.x;
          y = pt.y;
        } else {
          // hub orbit
          const hub = HUBS[p.hub!];
          p.angle! += 0.003 * p.speed * (reduce ? 0.4 : 1);
          const cx = hub.x * w;
          const cy = hub.y * h;
          const rr = p.radius! * (1 + Math.sin(t * 0.7 + p.angle!) * 0.05);
          x = cx + Math.cos(p.angle!) * rr;
          y = cy + Math.sin(p.angle!) * rr;
        }

        // Cursor disturbance
        if (live) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = 110;
          if (dist < radius && dist > 0.5) {
            const force = (1 - dist / radius) * 22;
            x += (dx / dist) * force;
            y += (dy / dist) * force;
          }
        }

        const r = p.green ? 120 : 210;
        const g = p.green ? 220 : 220;
        const b = p.green ? 170 : 235;
        const a = p.alpha * (reduce ? 0.75 : 1);

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fill();
      }

      // Soft cursor wash
      if (live) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 100);
        grad.addColorStop(0, 'rgba(14, 186, 88, 0.07)');
        grad.addColorStop(1, 'rgba(14, 186, 88, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 100, 0, Math.PI * 2);
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onMove);
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onMove);
    };
  }, [density, reduce]);

  return (
    <canvas
      ref={canvasRef}
      className={`living-motif ${className}`}
      aria-hidden="true"
    />
  );
}
