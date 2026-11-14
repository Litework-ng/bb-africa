
'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

type Props = {
  density?: number;
  className?: string;
};

type Hub = {
  name: string;
  x: number;
  y: number;
  strength: number;
};


type Route = {
  a: number;
  b: number;
  c1x: number;
  c1y: number;
  c2x: number;
  c2y: number;
};

type Particle = {
  route: number;
  t: number;
  speed: number;
  size: number;
  alpha: number;
};


const HUBS: Hub[] = [
  { name: 'Dakar', x: 0.364, y: 0.354, strength: 0.55 },
  { name: 'Accra', x: 0.492, y: 0.458, strength: 0.65 },
  { name: 'Lagos', x: 0.519, y: 0.447, strength: 1.0 },
  { name: 'Kinshasa', x: 0.607, y: 0.571, strength: 0.55 },
  { name: 'Cairo', x: 0.725, y: 0.180, strength: 0.6 },
  { name: 'Addis Ababa', x: 0.781, y: 0.419, strength: 0.65 },
  { name: 'Nairobi', x: 0.767, y: 0.536, strength: 0.9 },
  { name: 'Johannesburg', x: 0.702, y: 0.820, strength: 1.0 },
  { name: 'Cape Town', x: 0.630, y: 0.908, strength: 0.5 },
];
const ROUTES: Route[] = [
  { a: 1, b: 2, c1x: 0.501, c1y: 0.443, c2x: 0.512, c2y: 0.443 },
  { a: 0, b: 6, c1x: 0.61, c1y: 0.43, c2x: 0.70, c2y: 0.44 },
  { a: 6, b: 7, c1x: 0.75, c1y: 0.64, c2x: 0.69, c2y: 0.77 },
  { a: 0, b: 3, c1x: 0.54, c1y: 0.55, c2x: 0.57, c2y: 0.57 },
  { a: 3, b: 7, c1x: 0.60, c1y: 0.69, c2x: 0.62, c2y: 0.76 },
  { a: 6, b: 5, c1x: 0.76, c1y: 0.46, c2x: 0.75, c2y: 0.42 },
  { a: 5, b: 4, c1x: 0.75, c1y: 0.33, c2x: 0.76, c2y: 0.27 },
  { a: 2, b: 0, c1x: 0.47, c1y: 0.42, c2x: 0.50, c2y: 0.47 },
  { a: 6, b: 8, c1x: 0.76, c1y: 0.59, c2x: 0.72, c2y: 0.65 },
];


function createAfricaPath(w: number, h: number) {
  const p = new Path2D();

  const X = (v: number) => v * w;
  const Y = (v: number) => v * h;

  // Mainland Africa — begin in the northwest
  p.moveTo(X(0.375), Y(0.155));

  // Atlantic coast: Morocco and Western Sahara
  p.bezierCurveTo(
    X(0.395), Y(0.125),
    X(0.425), Y(0.115),
    X(0.465), Y(0.115)
  );

  // Northern coastline: Mauritania, Algeria and Tunisia
  p.bezierCurveTo(
    X(0.505), Y(0.105),
    X(0.555), Y(0.112),
    X(0.595), Y(0.115)
  );

  p.bezierCurveTo(
    X(0.635), Y(0.115),
    X(0.685), Y(0.125),
    X(0.715), Y(0.145)
  );

  // Libya and Egypt
  p.bezierCurveTo(
    X(0.745), Y(0.155),
    X(0.765), Y(0.175),
    X(0.775), Y(0.205)
  );

  p.bezierCurveTo(
    X(0.785), Y(0.235),
    X(0.775), Y(0.265),
    X(0.765), Y(0.295)
  );

  // Red Sea and northeastern Africa
  p.bezierCurveTo(
    X(0.755), Y(0.325),
    X(0.765), Y(0.355),
    X(0.785), Y(0.385)
  );

  // Horn of Africa — more natural Somali projection
  p.bezierCurveTo(
    X(0.815), Y(0.385),
    X(0.855), Y(0.395),
    X(0.885), Y(0.415)
  );

  p.bezierCurveTo(
    X(0.865), Y(0.445),
    X(0.835), Y(0.475),
    X(0.815), Y(0.505)
  );

  // East African coastline
  p.bezierCurveTo(
    X(0.805), Y(0.545),
    X(0.785), Y(0.585),
    X(0.765), Y(0.625)
  );

  // Mozambique coastline
  p.bezierCurveTo(
    X(0.745), Y(0.675),
    X(0.725), Y(0.735),
    X(0.705), Y(0.785)
  );

  // Southern Africa — Namibia and South Africa
  p.bezierCurveTo(
    X(0.685), Y(0.835),
    X(0.665), Y(0.875),
    X(0.645), Y(0.905)
  );

  p.bezierCurveTo(
    X(0.635), Y(0.925),
    X(0.615), Y(0.935),
    X(0.605), Y(0.925)
  );

  // Southern Atlantic coastline
  p.bezierCurveTo(
    X(0.585), Y(0.905),
    X(0.565), Y(0.865),
    X(0.555), Y(0.825)
  );

  // Angola and the southwestern coast
  p.bezierCurveTo(
    X(0.545), Y(0.785),
    X(0.555), Y(0.735),
    X(0.555), Y(0.695)
  );

  p.bezierCurveTo(
    X(0.555), Y(0.655),
    X(0.555), Y(0.615),
    X(0.545), Y(0.585)
  );

  // Central and western African coastline
  p.bezierCurveTo(
    X(0.535), Y(0.555),
    X(0.525), Y(0.525),
    X(0.505), Y(0.505)
  );

  // Gulf of Guinea
  p.bezierCurveTo(
    X(0.485), Y(0.485),
    X(0.465), Y(0.485),
    X(0.445), Y(0.495)
  );

  // West African coastal indentation
  p.bezierCurveTo(
    X(0.425), Y(0.505),
    X(0.405), Y(0.485),
    X(0.395), Y(0.455)
  );

  p.bezierCurveTo(
    X(0.385), Y(0.425),
    X(0.375), Y(0.395),
    X(0.365), Y(0.365)
  );

  // Senegal and the westernmost coastline
  p.bezierCurveTo(
    X(0.355), Y(0.325),
    X(0.355), Y(0.285),
    X(0.365), Y(0.245)
  );

  // Northwest coast returning to Morocco
  p.bezierCurveTo(
    X(0.365), Y(0.205),
    X(0.365), Y(0.175),
    X(0.375), Y(0.155)
  );

  p.closePath();

  // Madagascar — elongated and narrower
  p.moveTo(X(0.835), Y(0.675));

  p.bezierCurveTo(
    X(0.850), Y(0.695),
    X(0.855), Y(0.735),
    X(0.850), Y(0.775)
  );

  p.bezierCurveTo(
    X(0.845), Y(0.815),
    X(0.830), Y(0.855),
    X(0.815), Y(0.865)
  );

  p.bezierCurveTo(
    X(0.800), Y(0.865),
    X(0.800), Y(0.825),
    X(0.805), Y(0.785)
  );

  p.bezierCurveTo(
    X(0.810), Y(0.745),
    X(0.815), Y(0.705),
    X(0.835), Y(0.675)
  );

  p.closePath();

  return p;
}


function pointOnRoute(
  route: Route,
  t: number,
  w: number,
  h: number
) {
  const a = HUBS[route.a];
  const b = HUBS[route.b];
  const u = 1 - t;

  const x =
    u ** 3 * a.x +
    3 * u ** 2 * t * route.c1x +
    3 * u * t ** 2 * route.c2x +
    t ** 3 * b.x;

  const y =
    u ** 3 * a.y +
    3 * u ** 2 * t * route.c1y +
    3 * u * t ** 2 * route.c2y +
    t ** 3 * b.y;

  return { x: x * w, y: y * h };
}

export default function LivingMotif({
  density = 0.7,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;

    let africa: Path2D;
    let particles: Particle[] = [];
    let networkNodes: { x: number; y: number; alpha: number }[] = [];

    const reduced = Boolean(reduceMotion);

    const hubPosition = (hub: Hub) => ({
      x: hub.x * w,
      y: hub.y * h,
    });

    const seedNetwork = () => {
      networkNodes = [];

      const count = Math.floor(115 * density);
      let attempts = 0;

      while (networkNodes.length < count && attempts < count * 15) {
        attempts++;

        const x = (0.39 + Math.random() * 0.51) * w;
        const y = (0.11 + Math.random() * 0.82) * h;

        if (!ctx!.isPointInPath(africa, x, y)) continue;

        networkNodes.push({
          x,
          y,
          alpha: 0.10 + Math.random() * 0.22,
        });
      }

      particles = ROUTES.flatMap((_, route) => {
        const count = Math.max(1, Math.floor(2 * density));

        return Array.from({ length: count }, () => ({
          route,
          t: Math.random(),
          speed: 0.035 + Math.random() * 0.025,
          size: 1 + Math.random() * 0.6,
          alpha: 0.35 + Math.random() * 0.35,
        }));
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      africa = createAfricaPath(w, h);
      seedNetwork();
    };

    const draw = (timestamp: number) => {
      const dt = lastTime
        ? Math.min((timestamp - lastTime) / 1000, 0.05)
        : 0;

      lastTime = timestamp;
      elapsed += dt;

      ctx!.clearRect(0, 0, w, h);

      // Continental silhouette
      const fill = ctx!.createLinearGradient(
        w * 0.43,
        h * 0.15,
        w * 0.80,
        h * 0.90
      );

      fill.addColorStop(0, 'rgba(255,255,255,0.055)');
      fill.addColorStop(0.55, 'rgba(14,186,88,0.085)');
      fill.addColorStop(1, 'rgba(14,186,88,0.045)');

      ctx!.fillStyle = fill;
      ctx!.fill(africa);

      // More defined continental outline
      ctx!.strokeStyle = 'rgba(180,220,195,0.32)';
      ctx!.lineWidth = 1.5;
      ctx!.stroke(africa);

      ctx!.save();
      ctx!.clip(africa);

      // Soft internal atmosphere
      const atmosphere = ctx!.createRadialGradient(
        w * 0.65,
        h * 0.48,
        0,
        w * 0.65,
        h * 0.48,
        Math.min(w, h) * 0.45
      );

      atmosphere.addColorStop(0, 'rgba(14,186,88,0.055)');
      atmosphere.addColorStop(1, 'rgba(14,186,88,0)');

      ctx!.fillStyle = atmosphere;
      ctx!.fillRect(0, 0, w, h);

      // Fine network connections
      ctx!.lineWidth = 0.85;

      for (let i = 0; i < networkNodes.length; i++) {
        const a = networkNodes[i];

        let nearest = -1;
        let nearestDistance = 48;

        for (let j = 0; j < networkNodes.length; j++) {
          if (i === j) continue;

          const b = networkNodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = j;
          }
        }

        if (nearest >= 0) {
          const b = networkNodes[nearest];

          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(b.x, b.y);
          ctx!.strokeStyle = `rgba(145,220,175,${0.10 + a.alpha * 0.20})`;
          ctx!.stroke();
        }

        ctx!.beginPath();
        ctx!.arc(a.x, a.y, 1.15, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200,245,220,${Math.min(a.alpha + 0.12, 0.55)})`;
        ctx!.fill();
      }

      // Main ecosystem routes
      ROUTES.forEach((route, index) => {
        const a = hubPosition(HUBS[route.a]);
        const b = hubPosition(HUBS[route.b]);

        ctx!.beginPath();
        ctx!.moveTo(a.x, a.y);
        ctx!.bezierCurveTo(
          route.c1x * w,
          route.c1y * h,
          route.c2x * w,
          route.c2y * h,
          b.x,
          b.y
        );

        const primary = index < 5;

       ctx!.strokeStyle = primary
          ? 'rgba(14,210,100,0.42)'
          : 'rgba(160,210,180,0.18)';

        ctx!.lineWidth = primary ? 1.35 : 0.85;
        ctx!.stroke();
      });

      // Moving data particles
      particles.forEach((particle) => {
        if (!reduced) {
          particle.t = (particle.t + particle.speed * dt) % 1;
        }

        const point = pointOnRoute(
          ROUTES[particle.route],
          particle.t,
          w,
          h
        );

        const pulse = reduced
          ? 1
          : 0.75 + Math.sin(elapsed * 1.5 + particle.route) * 0.25;

        ctx!.beginPath();
        ctx!.arc(
          point.x,
          point.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx!.fillStyle = `rgba(75,225,145,${particle.alpha * pulse})`;
        ctx!.fill();
      });

      // Technology hubs: restrained illumination
      HUBS.forEach((hub, index) => {
        const { x, y } = hubPosition(hub);

        const pulse = reduced
          ? 1
          : 0.85 + Math.sin(elapsed * 1.1 + index) * 0.15;

        const radius = hub.strength > 0.85 ? 3.5 : 2.2;

        if (hub.strength > 0.85) {
          const glow = ctx!.createRadialGradient(
            x, y, 0, x, y, 19
          );

         glow.addColorStop(0, 'rgba(14,210,100,0.38)');
          glow.addColorStop(0.45, 'rgba(14,210,100,0.12)');
          glow.addColorStop(1, 'rgba(14,210,100,0)');

          ctx!.fillStyle = glow;
          ctx!.beginPath();
          ctx!.arc(x, y, 19, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(x, y, radius * pulse, 0, Math.PI * 2);

        ctx!.fillStyle = hub.strength > 0.85
          ? 'rgba(65,235,145,0.9)'
          : 'rgba(220,245,230,0.6)';

        ctx!.fill();
      });

      ctx!.restore();

      if (!reduced) {
        frame = requestAnimationFrame(draw);
      }
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [density, reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`living-motif ${className}`}
      aria-hidden="true"
    />
  );
}
