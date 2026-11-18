'use client';

/**
 * BBA Startup Profile
 * Continues the home / directory visual system.
 * Identity panel + company intelligence + interactive field motif.
 */

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Inter_Tight } from 'next/font/google';
import { useReducedMotion } from 'framer-motion';
import './profile.css';

const display = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const LOGO_URL =
  'https://bbafrica.sbs/wp-content/uploads/2026/04/BBA-Logo-White.svg';

/* Demo — swap for PROFILES + STARTUP_CONTENT in production */
const DEMO = {
  id: 'paystack',
  kind: 'Startup',
  name: 'Paystack',
  location: 'Lagos, Nigeria',
  sector: 'Fintech',
  stage: 'Series B',
  status: 'Raising' as const,
  description:
    'Modern payments infrastructure for African businesses. Paystack helps companies accept payments online and offline, settle in local currency, and scale across markets.',
  oneLiner: 'Modern payments infrastructure for African businesses.',
  raised: '$200M',
  teamSize: '200+',
  founded: 2015,
  cover:
    'https://d1jcea4y7xhp7l.cloudfront.net/wp-content/uploads/2026/01/Paystack-Acquires-Ladder-Microfinance-Bank-750x536-1.png',
  initials: 'PS',
  logo: null as string | null,
  verified: true,
  tagline: 'Payments infrastructure for ambitious African businesses.',
  industry: 'Fintech',
  businessModel: 'B2B SaaS',
  website: 'https://paystack.com',
  overview:
    'Paystack builds modern payment infrastructure for African businesses. From online checkout to in-person payments, the platform helps merchants accept cards, bank transfers, and mobile money — then settle in the currencies that matter locally.',
  problem:
    'Accepting digital payments across Africa has been fragmented, expensive, and unreliable for growing businesses.',
  solution:
    'A single, developer-friendly payments platform with local acquiring, instant settlement options, and tools that scale from early startups to large enterprises.',
  tags: ['Payments', 'Infrastructure', 'API-first'],
  markets: ['Nigeria', 'Ghana', 'South Africa', 'Kenya'],
  funding: {
    total: '$200M',
    latestRound: 'Series B',
    note: 'Illustrative profile data for design preview.',
  },
  founders: [
    {
      name: 'Shola Akinlade',
      role: 'Co-founder & CEO',
      bio: 'Building payment rails that work for African businesses at scale.',
      initials: 'SA',
    },
    {
      name: 'Ezra Olubi',
      role: 'Co-founder & CTO',
      bio: 'Engineering reliable, developer-first payment infrastructure.',
      initials: 'EO',
    },
  ],
  products: [
    {
      name: 'Checkout',
      category: 'Product',
      description: 'Hosted and embedded checkout for cards, transfers, and mobile money.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    },
    {
      name: 'Paystack API',
      category: 'Platform',
      description: 'Full payments API for custom flows, billing, and marketplace payouts.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
  ],
  milestones: [
    { year: '2015', title: 'Founded in Lagos', description: 'Started building modern payments infrastructure for Nigerian businesses.' },
    { year: '2020', title: 'Acquired by Stripe', description: 'Joined Stripe to accelerate payments expansion across Africa.' },
    { year: '2024', title: 'Multi-market growth', description: 'Expanded product surface and merchant base across key African markets.' },
  ],
  investors: ['Stripe', 'Tencent', 'Visa'],
  partners: ['Banks across operating markets'],
  related: ['Flutterwave', 'Interswitch'],
};

function Value({ value }: { value?: string | number | null }) {
  return <>{value ?? '—'}</>;
}

function Initials({ value, className = '' }: { value?: string; className?: string }) {
  return <div className={`sp-initials ${className}`}>{value || '—'}</div>;
}

/** Cursor-reactive commerce field — unique to profile, same DNA as home motif */
function ProfileField({ density = 1 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const raf = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let t0 = 0;

    type Node = { x: number; y: number; vx: number; vy: number; r: number; pulse: number };
    type Link = { a: number; b: number; phase: number };
    type Dot = { x: number; y: number; vx: number; vy: number; life: number; green: boolean };

    let nodes: Node[] = [];
    let links: Link[] = [];
    let dots: Dot[] = [];

    const seed = () => {
      const n = Math.floor((14 + density * 10) * (reduce ? 0.5 : 1));
      nodes = [];
      for (let i = 0; i < n; i++) {
        nodes.push({
          x: 0.12 + Math.random() * 0.76,
          y: 0.14 + Math.random() * 0.72,
          vx: (Math.random() - 0.5) * 0.00012,
          vy: (Math.random() - 0.5) * 0.00012,
          r: 1.2 + Math.random() * 2.2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
      links = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < 0.085) {
            links.push({ a: i, b: j, phase: Math.random() * Math.PI * 2 });
          }
        }
      }
      dots = [];
      const dCount = Math.floor(28 * density * (reduce ? 0.4 : 1));
      for (let i = 0; i < dCount; i++) {
        dots.push({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0004,
          vy: (Math.random() - 0.5) * 0.0004,
          life: Math.random(),
          green: Math.random() > 0.55,
        });
      }
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

    const draw = (ts: number) => {
      if (!t0) t0 = ts;
      const t = (ts - t0) * 0.001;
      ctx.clearRect(0, 0, w, h);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const live = mouse.current.active && !reduce;

      // soft field wash under cursor
      if (live) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 140);
        g.addColorStop(0, 'rgba(14, 186, 88, 0.1)');
        g.addColorStop(0.5, 'rgba(14, 186, 88, 0.03)');
        g.addColorStop(1, 'rgba(14, 186, 88, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mx, my, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // links
      for (const L of links) {
        const A = nodes[L.a];
        const B = nodes[L.b];
        let ax = A.x * w;
        let ay = A.y * h;
        let bx = B.x * w;
        let by = B.y * h;
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + L.phase);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = `rgba(14, 186, 88, ${0.06 + pulse * 0.08})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // ambient dots
      for (const d of dots) {
        d.x += d.vx * (reduce ? 0.3 : 1);
        d.y += d.vy * (reduce ? 0.3 : 1);
        if (d.x < 0 || d.x > 1) d.vx *= -1;
        if (d.y < 0 || d.y > 1) d.vy *= -1;
        let x = d.x * w;
        let y = d.y * h;
        if (live) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 100 && dist > 1) {
            const f = (1 - dist / 100) * 18;
            x += (dx / dist) * f;
            y += (dy / dist) * f;
          }
        }
        ctx.beginPath();
        ctx.arc(x, y, d.green ? 1.4 : 0.9, 0, Math.PI * 2);
        ctx.fillStyle = d.green
          ? `rgba(90, 220, 150, ${0.35 + d.life * 0.35})`
          : `rgba(200, 210, 220, ${0.12 + d.life * 0.2})`;
        ctx.fill();
      }

      // nodes
      for (const n of nodes) {
        n.x += n.vx * (reduce ? 0.3 : 1);
        n.y += n.vy * (reduce ? 0.3 : 1);
        if (n.x < 0.08 || n.x > 0.92) n.vx *= -1;
        if (n.y < 0.1 || n.y > 0.9) n.vy *= -1;
        let x = n.x * w;
        let y = n.y * h;
        if (live) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 1) {
            const f = (1 - dist / 120) * 22;
            x += (dx / dist) * f;
            y += (dy / dist) * f;
          }
        }
        const breathe = 1 + Math.sin(t * 1.4 + n.pulse) * 0.15;
        const rr = n.r * breathe;
        ctx.beginPath();
        ctx.arc(x, y, rr * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(14, 186, 88, 0.08)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, rr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(105, 233, 163, 0.75)';
        ctx.fill();
      }

      raf.current = requestAnimationFrame(draw);
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

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [density, reduce]);

  return <canvas ref={canvasRef} className="sp-field" aria-hidden="true" />;
}

export default function StartupProfilePage() {
  const p = DEMO;
  const [scrolled, setScrolled] = useState(false);
  const website = p.website?.startsWith('http') ? p.website : p.website ? `https://${p.website}` : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className={`${display.variable} sp`}>
      <div className="sp-ambient" aria-hidden="true" />

      <header className={`sp-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="sp-nav-inner">
          <Link href="/" className="sp-brand" aria-label="Home">
            <Image src={LOGO_URL} alt="BB Africa" width={34} height={34} priority unoptimized />
          </Link>
          <div className="sp-nav-right">
            <Link href="/startups" className="sp-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Directory
            </Link>
            <span className="sp-nav-chip">Startup profile</span>
          </div>
        </div>
      </header>

      <div className="sp-shell">
        <div className="sp-crumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/startups">Startups</Link>
          <span>/</span>
          <span>{p.name}</span>
        </div>

        {/* Hero */}
        <section className="sp-hero">
          <aside className="sp-id">
            <div className="sp-id-top">
              <span className="sp-eyebrow">Startup</span>
              {p.verified && (
                <span className="sp-verified">
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                    <path d="m5 10 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Verified
                </span>
              )}
            </div>

            <div className="sp-id-brand">
              {p.logo ? (
                <Image src={p.logo} alt="" width={56} height={56} className="sp-logo" unoptimized />
              ) : (
                <Initials value={p.initials} className="sp-logo-fb" />
              )}
              <div>
                <p className="sp-loc">{p.location}</p>
                <p className="sp-meta-line">
                  {p.sector}
                  {p.stage ? ` · ${p.stage}` : ''}
                </p>
              </div>
            </div>

            <h1>{p.name}</h1>
            {p.tagline && <p className="sp-tagline">{p.tagline}</p>}

            <div className="sp-actions">
              {website && (
                <a href={website} className="sp-btn sp-btn-primary" target="_blank" rel="noopener noreferrer">
                  Visit website
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              )}
              <Link href="/startups" className="sp-btn sp-btn-ghost">
                Directory
              </Link>
            </div>

            <div className="sp-tags">
              {p.industry && <span className="sp-tag sp-tag-green">{p.industry}</span>}
              {p.stage && <span className="sp-tag">{p.stage}</span>}
              {p.status && <span className="sp-tag sp-tag-orange">{p.status}</span>}
              {p.tags?.slice(0, 2).map((t) => (
                <span className="sp-tag" key={t}>{t}</span>
              ))}
            </div>

            <dl className="sp-facts">
              <div>
                <dt>Founded</dt>
                <dd><Value value={p.founded} /></dd>
              </div>
              <div>
                <dt>Team</dt>
                <dd><Value value={p.teamSize} /></dd>
              </div>
              <div>
                <dt>Raised</dt>
                <dd><Value value={p.raised} /></dd>
              </div>
              <div>
                <dt>Model</dt>
                <dd><Value value={p.businessModel} /></dd>
              </div>
            </dl>
          </aside>

          <div className="sp-visual">
            {p.cover ? (
              <Image
                src={p.cover}
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
                className="sp-cover"
                unoptimized
              />
            ) : null}
            <div className="sp-visual-veil" aria-hidden="true" />
            <ProfileField density={0.9} />
            <div className="sp-visual-meta">
              <span>BB AFRICA</span>
              <span>MOVE CURSOR</span>
            </div>
            <p className="sp-visual-cap">{p.oneLiner}</p>
          </div>
        </section>

        {/* Metrics */}
        <section className="sp-metrics" aria-label="Key metrics">
          {[
            ['Founded', p.founded],
            ['Stage', p.stage],
            ['Team', p.teamSize],
            ['Funding', p.raised || p.funding?.total],
          ].map(([label, val]) => (
            <div key={String(label)}>
              <span>{label}</span>
              <strong><Value value={val as string | number} /></strong>
            </div>
          ))}
        </section>

        {/* Overview */}
        <section className="sp-section">
          <div className="sp-section-head">
            <div>
              <p className="sp-eyebrow">The company</p>
              <h2>Overview</h2>
            </div>
          </div>
          <p className="sp-lead">{p.overview || p.description}</p>
          {(p.problem || p.solution) && (
            <div className="sp-ps">
              {p.problem && (
                <div className="sp-card">
                  <span className="sp-eyebrow">Problem</span>
                  <p>{p.problem}</p>
                </div>
              )}
              {p.solution && (
                <div className="sp-card">
                  <span className="sp-eyebrow">Approach</span>
                  <p>{p.solution}</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Snapshot */}
        <section className="sp-section">
          <div className="sp-section-head">
            <div>
              <p className="sp-eyebrow">Company data</p>
              <h2>Snapshot</h2>
            </div>
          </div>
          <div className="sp-snap">
            {[
              ['Company', p.name],
              ['HQ', p.location],
              ['Founded', p.founded],
              ['Industry', p.industry || p.sector],
              ['Stage', p.stage],
              ['Model', p.businessModel],
              ['Team', p.teamSize],
              ['Web', p.website?.replace(/^https?:\/\//, '')],
            ].map(([label, value]) => (
              <div className="sp-snap-cell" key={String(label)}>
                <span>{label}</span>
                <strong><Value value={value as string | number} /></strong>
              </div>
            ))}
          </div>
          {p.markets?.length > 0 && (
            <div className="sp-markets">
              <span className="sp-eyebrow">Markets</span>
              <div>
                {p.markets.map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Products */}
        {p.products?.length > 0 && (
          <section className="sp-section">
            <div className="sp-section-head">
              <div>
                <p className="sp-eyebrow">What they ship</p>
                <h2>Products</h2>
              </div>
              <span className="sp-count">{String(p.products.length).padStart(2, '0')}</span>
            </div>
            <div className="sp-products">
              {p.products.map((prod, i) => (
                <article className="sp-product" key={prod.name}>
                  <div className="sp-product-media">
                    {prod.image && (
                      <Image src={prod.image} alt="" fill sizes="(max-width:700px) 100vw, 50vw" unoptimized />
                    )}
                    <span>{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="sp-product-body">
                    {prod.category && <span className="sp-eyebrow">{prod.category}</span>}
                    <h3>{prod.name}</h3>
                    {prod.description && <p>{prod.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Team */}
        {p.founders?.length > 0 && (
          <section className="sp-section">
            <div className="sp-section-head">
              <div>
                <p className="sp-eyebrow">Leadership</p>
                <h2>Team</h2>
              </div>
            </div>
            <div className="sp-people">
              {p.founders.map((person) => (
                <article className="sp-person" key={person.name}>
                  <Initials value={person.initials} />
                  <div>
                    <h3>{person.name}</h3>
                    {person.role && <span>{person.role}</span>}
                    {person.bio && <p>{person.bio}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Funding + timeline */}
        {(p.funding || (p.milestones && p.milestones.length > 0)) && (
          <section className="sp-section">
            <div className="sp-section-head">
              <div>
                <p className="sp-eyebrow">Capital & path</p>
                <h2>Funding & milestones</h2>
              </div>
            </div>
            {p.funding && (
              <div className="sp-capital">
                <div>
                  <p className="sp-eyebrow">Raised</p>
                  <p className="sp-capital-total">{p.funding.total || '—'}</p>
                  {p.funding.note && <p className="sp-capital-note">{p.funding.note}</p>}
                </div>
                <div className="sp-capital-grid">
                  <div>
                    <span>Total</span>
                    <strong><Value value={p.funding.total} /></strong>
                  </div>
                  <div>
                    <span>Latest</span>
                    <strong><Value value={p.funding.latestRound} /></strong>
                  </div>
                </div>
              </div>
            )}
            {p.milestones && p.milestones.length > 0 && (
              <div className="sp-timeline">
                {p.milestones.map((m) => (
                  <article key={`${m.year}-${m.title}`}>
                    <span className="sp-tl-dot" aria-hidden="true" />
                    <span className="sp-tl-year">{m.year}</span>
                    <h3>{m.title}</h3>
                    {m.description && <p>{m.description}</p>}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Ecosystem */}
        {(p.investors?.length || p.partners?.length || p.related?.length) && (
          <section className="sp-section">
            <div className="sp-section-head">
              <div>
                <p className="sp-eyebrow">Ecosystem</p>
                <h2>Connections</h2>
              </div>
            </div>
            <div className="sp-network">
              {p.investors && p.investors.length > 0 && (
                <div className="sp-net-col">
                  <span className="sp-eyebrow">Investors</span>
                  {p.investors.map((name) => (
                    <div className="sp-net-row" key={name}>
                      <Initials
                        value={name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        className="sp-net-av"
                      />
                      <strong>{name}</strong>
                    </div>
                  ))}
                </div>
              )}
              {p.partners && p.partners.length > 0 && (
                <div className="sp-net-col">
                  <span className="sp-eyebrow">Partners</span>
                  {p.partners.map((name) => (
                    <div className="sp-net-row" key={name}>
                      <strong>{name}</strong>
                    </div>
                  ))}
                </div>
              )}
              {p.related && p.related.length > 0 && (
                <div className="sp-net-col">
                  <span className="sp-eyebrow">Related</span>
                  {p.related.map((name) => (
                    <div className="sp-net-row" key={name}>
                      <strong>{name}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <section className="sp-cta">
          <div>
            <p className="sp-eyebrow">Directory</p>
            <h2>Explore more startups</h2>
            <p>Discover companies, founders, and capital across African tech.</p>
          </div>
          <Link href="/startups" className="sp-btn sp-btn-primary">
            Browse directory
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        <footer className="sp-footer">
          <Link href="/" className="sp-footer-brand">
            <Image src={LOGO_URL} alt="" width={26} height={26} unoptimized />
            Business Bee Africa
          </Link>
          <span>African startups, founders, and investors.</span>
          <Link href="/startups">Explore directory →</Link>
        </footer>
      </div>
    </main>
  );
}
