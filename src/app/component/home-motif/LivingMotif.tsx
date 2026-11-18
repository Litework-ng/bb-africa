'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  AFRICA_HUBS,
  AFRICA_PATH,
  AFRICA_VIEWBOX,
} from './africa-map.generated';

type Props = {
  density?: number;
  className?: string;
};

type Hub = (typeof AFRICA_HUBS)[number];
type Route = { a: number; b: number; bend: number };
type Particle = {
  route: number;
  t: number;
  speed: number;
  size: number;
  alpha: number;
};
type Point = { x: number; y: number };

// These connections use the projected hub coordinates generated from
// the same Natural Earth projection as the SVG coastline.
const ROUTES: Route[] = [
  { a: 1, b: 2, bend: -24 },
  { a: 0, b: 6, bend: 42 },
  { a: 6, b: 7, bend: 32 },
  { a: 0, b: 3, bend: 26 },
  { a: 3, b: 7, bend: -34 },
  { a: 6, b: 5, bend: -24 },
  { a: 5, b: 4, bend: 22 },
  { a: 2, b: 0, bend: -32 },
  { a: 6, b: 8, bend: 30 },
];
function mapPoint(point: { x: number; y: number }, scale: number, offsetX: number, offsetY: number): Point {
  return {
    x: offsetX + point.x * scale,
    y: offsetY + point.y * scale,
  };
}

function routeControls(a: Point, b: Point, bend: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const nx = -dy / length;
  const ny = dx / length;

  return {
    c1: {
      x: a.x + dx * 0.34 + nx * bend,
      y: a.y + dy * 0.34 + ny * bend,
    },
    c2: {
      x: a.x + dx * 0.68 + nx * bend,
      y: a.y + dy * 0.68 + ny * bend,
    },
  };
}

function pointOnRoute(a: Point, b: Point, bend: number, t: number): Point {
  const { c1, c2 } = routeControls(a, b, bend);
  const u = 1 - t;
  return {
    x: u ** 3 * a.x + 3 * u ** 2 * t * c1.x + 3 * u * t ** 2 * c2.x + t ** 3 * b.x,
    y: u ** 3 * a.y + 3 * u ** 2 * t * c1.y + 3 * u * t ** 2 * c2.y + t ** 3 * b.y,
  };
}

export default function LivingMotif({ density = 0.7, className = '' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;
    let africa = new Path2D();
    let hubs: Point[] = [];
    let particles: Particle[] = [];
    let networkNodes: { x: number; y: number; alpha: number }[] = [];

    const reduced = Boolean(reduceMotion);

    const seedNetwork = () => {
      networkNodes = [];
      const count = Math.floor(175 * density);
      let attempts = 0;

      while (networkNodes.length < count && attempts < count * 24) {
        attempts++;
        const x = offsetX + (Math.random() * AFRICA_VIEWBOX.width) * scale;
        const y = offsetY + (Math.random() * AFRICA_VIEWBOX.height) * scale;
        if (!ctx.isPointInPath(africa, x, y)) continue;
        networkNodes.push({ x, y, alpha: 0.10 + Math.random() * 0.22 });
      }

      particles = ROUTES.flatMap((_, route) => {
        const amount = Math.max(2, Math.floor(3 * density));
        return Array.from({ length: amount }, () => ({
          route,
          t: Math.random(),
          speed: 0.04 + Math.random() * 0.025,
          size: 1 + Math.random() * 0.6,
          alpha: 0.35 + Math.random() * 0.35,
        }));
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Preserve the map's geographic proportions; never stretch the continent.
      scale = Math.min(width / AFRICA_VIEWBOX.width, height / AFRICA_VIEWBOX.height);
      scale *= 1.09;
      offsetX = (width - AFRICA_VIEWBOX.width * scale) / 2;
      offsetY = (height - AFRICA_VIEWBOX.height * scale) / 2;

      const matrix = new DOMMatrix()
        .translate(offsetX, offsetY)
        .scale(scale);
      africa = new Path2D();
      africa.addPath(new Path2D(AFRICA_PATH), matrix);
      hubs = AFRICA_HUBS.map((hub) => mapPoint(hub, scale, offsetX, offsetY));
      seedNetwork();
    };

    const draw = (timestamp: number) => {
      const dt = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0;
      lastTime = timestamp;
      elapsed += dt;
      ctx.clearRect(0, 0, width, height);

      // Subtle depth behind the geographic silhouette.
      const fill = ctx.createLinearGradient(
        offsetX + width * 0.30,
        offsetY + height * 0.12,
        offsetX + width * 0.78,
        offsetY + height * 0.90,
      );
      fill.addColorStop(0, 'rgba(255,255,255,0.055)');
      fill.addColorStop(0.52, 'rgba(14,186,88,0.12)');
      fill.addColorStop(1, 'rgba(14,186,88,0.055)');
      ctx.fillStyle = fill;
      ctx.fill(africa);

      // A crisp, restrained coastline makes the actual continent legible.
      ctx.save();
      ctx.shadowColor = 'rgba(54, 220, 130, 0.20)';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = 'rgba(180, 230, 200, 0.52)';
      ctx.lineWidth = 1.3;
      ctx.stroke(africa);
      ctx.restore();

      ctx.save();
      ctx.clip(africa);

      const atmosphere = ctx.createRadialGradient(
        offsetX + width * 0.55,
        offsetY + height * 0.48,
        0,
        offsetX + width * 0.55,
        offsetY + height * 0.48,
        Math.min(width, height) * 0.52,
      );
      atmosphere.addColorStop(0, 'rgba(14,186,88,0.075)');
      atmosphere.addColorStop(1, 'rgba(14,186,88,0)');
      ctx.fillStyle = atmosphere;
      ctx.fillRect(0, 0, width, height);

      // Fine, locally connected nodes remain clipped to the landmass.
      ctx.lineWidth = 0.8;
      for (let i = 0; i < networkNodes.length; i++) {
        const node = networkNodes[i];
        let nearest = -1;
        let nearestDistance = 48 * Math.max(0.65, scale);

        for (let j = 0; j < networkNodes.length; j++) {
          if (i === j) continue;
          const candidate = networkNodes[j];
          const distance = Math.hypot(node.x - candidate.x, node.y - candidate.y);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = j;
          }
        }

        if (nearest >= 0) {
          const neighbour = networkNodes[nearest];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(neighbour.x, neighbour.y);
          ctx.strokeStyle = `rgba(145,220,175,${0.10 + node.alpha * 0.20})`;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.05, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,245,220,${Math.min(node.alpha + 0.12, 0.55)})`;
        ctx.fill();
      }

      // Trade and ecosystem routes use the same projected city coordinates.
      ROUTES.forEach((route, index) => {
        const a = hubs[route.a];
        const b = hubs[route.b];
        const { c1, c2 } = routeControls(a, b, route.bend * scale);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, b.x, b.y);
        ctx.strokeStyle = index < 5
          ? `rgba(14,210,100,${0.36 + (reduced ? 0 : Math.sin(elapsed * 1.1 + index) * 0.06)})`
          : 'rgba(160,210,180,0.20)';
        ctx.lineWidth = index < 5 ? 1.3 : 0.85;
        ctx.stroke();

        if (!reduced && index < 5) {
          ctx.setLineDash([6, 18]);
          ctx.lineDashOffset = -elapsed * 12;
          ctx.strokeStyle = 'rgba(120,245,170,0.18)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.lineDashOffset = 0;
        }
      });

      particles.forEach((particle) => {
        if (!reduced) particle.t = (particle.t + particle.speed * dt) % 1;
        const route = ROUTES[particle.route];
        const point = pointOnRoute(
          hubs[route.a],
          hubs[route.b],
          route.bend * scale,
          particle.t,
        );
        const pulse = reduced ? 1 : 0.75 + Math.sin(elapsed * 1.5 + particle.route) * 0.25;
        ctx.beginPath();
        ctx.arc(point.x, point.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(75,225,145,${particle.alpha * pulse})`;
        ctx.fill();
      });

      AFRICA_HUBS.forEach((hub: Hub, index: number) => {
        const { x, y } = hubs[index];
        const pulse = reduced ? 1 : 0.85 + Math.sin(elapsed * 1.1 + index) * 0.15;
        const radius = hub.strength > 0.85 ? 3.4 : 2.1;

        if (hub.strength > 0.85) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 19 * scale);
          glow.addColorStop(0, 'rgba(14,210,100,0.38)');
          glow.addColorStop(0.45, 'rgba(14,210,100,0.12)');
          glow.addColorStop(1, 'rgba(14,210,100,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, 19 * scale, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(x, y, radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = hub.strength > 0.85
          ? 'rgba(65,235,145,0.9)'
          : 'rgba(220,245,230,0.65)';
        ctx.fill();
      });

      ctx.restore();
      if (!reduced) frame = requestAnimationFrame(draw);
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

  return <canvas ref={canvasRef} className={`living-motif ${className}`} aria-hidden="true" />;
}
