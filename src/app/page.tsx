'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './styles/home.css';

const display = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const RIBBONS = Array.from({ length: 16 }, (_, i) => {
  const y = 60 + i * 56;
  return {
    d: `M-200 ${y + 380} C 250 ${y + 120}, 700 ${y + 520}, 1100 ${y + 150} S 1600 ${y - 200}, 1900 ${y - 260} L 1900 1500 L -200 1500 Z`,
    fill: i % 2 === 0 ? 'url(#ribA)' : 'url(#ribB)',
    highlight: 0.04 + (i / 15) * 0.06,
  };
});

const INSIGHTS = [
  { title: 'How Lagos founders are raising their first round', href: '#insights' },
  { title: 'What investors look at before a seed cheque', href: '#insights' },
  { title: 'Hiring your first ten people in Nairobi', href: '#insights' },
];

/** Mixed directory highlights — startups, founders, investors */
const FEATURED = [
  {
    id: 'paystack',
    kind: 'Startup' as const,
    name: 'Paystack',
    location: 'Lagos, Nigeria',
    badge: 'Fintech',
    status: 'Raising' as const,
    description: 'Modern payments infrastructure for African businesses.',
    metricALabel: 'Raised',
    metricAValue: '$200M',
    metricBLabel: 'Stage',
    metricBValue: 'Series B',
    footLine: '$200M · Series B',
    href: '#startups',
    initials: 'PS',
    cover: 'https://d1jcea4y7xhp7l.cloudfront.net/wp-content/uploads/2026/01/Paystack-Acquires-Ladder-Microfinance-Bank-750x536-1.png',
    logo: null as string | null,
  },
  {
    id: 'amara-okello',
    kind: 'Founder' as const,
    name: 'Amara Okello',
    location: 'Nairobi, Kenya',
    badge: 'Co-founder, FieldGrid',
    status: null,
    description: 'Digitising last-mile distribution for FMCG across East Africa.',
    metricALabel: 'Company',
    metricAValue: 'FieldGrid',
    metricBLabel: 'Stage',
    metricBValue: 'Series A',
    footLine: 'FieldGrid · Series A',
    href: '#founders',
    initials: 'AO',
    cover: 'https://images.unsplash.com/photo-1573495783323-9e59a325d4b4?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    logo: null,
  },
  {
    id: 'partech-africa',
    kind: 'Investor' as const,
    name: 'Partech Africa',
    location: 'Dakar / Paris',
    badge: 'Seed–Series B',
    status: null,
    description: 'Backing category-defining tech companies across the continent.',
    metricALabel: 'Focus',
    metricAValue: 'Multi-stage',
    metricBLabel: 'Type',
    metricBValue: 'Venture',
    footLine: 'Multi-stage · Venture',
    href: '#investors',
    initials: 'PA',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    logo: null,
  },
  {
    id: 'wasoko',
    kind: 'Startup' as const,
    name: 'Wasoko',
    location: 'Nairobi, Kenya',
    badge: 'Commerce',
    status: 'Raising' as const,
    description: 'B2B e-commerce for informal retailers across East Africa.',
    metricALabel: 'Raised',
    metricAValue: '$125M',
    metricBLabel: 'Stage',
    metricBValue: 'Series B',
    footLine: '$125M · Series B',
    href: '#startups',
    initials: 'WA',
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    logo: null,
  },
  {
    id: 'echo-vc',
    kind: 'Investor' as const,
    name: 'EchoVC',
    location: 'Lagos',
    badge: 'Seed',
    status: 'Active' as const,
    description: 'Early-stage fund investing in African founders.',
    metricALabel: 'Focus',
    metricAValue: 'Seed',
    metricBLabel: 'Type',
    metricBValue: 'Early',
    footLine: 'Seed · Early',
    href: '#investors',
    initials: 'EV',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    logo: null,
  },
  {
    id: 'thabo-dlamini',
    kind: 'Founder' as const,
    name: 'Thabo Dlamini',
    location: 'Cape Town, SA',
    badge: 'CEO, Shoreline',
    status: 'Raising' as const,
    description: 'Embedded finance for Southern African SMEs.',
    metricALabel: 'Company',
    metricAValue: 'Shoreline',
    metricBLabel: 'Stage',
    metricBValue: 'Series A',
    footLine: 'Shoreline · Series A',
    href: '#founders',
    initials: 'TD',
    cover: 'https://images.unsplash.com/photo-1578758803946-2c4f6738df87?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    logo: null,
  },
];

const RESOURCES = [
  {
    id: 'r1',
    type: 'Interview' as const,
    title: 'How Lagos founders close their first institutional round',
    excerpt:
      'Three operators on what changed between their angel cheques and the term sheet that actually closed.',
    meta: '28 min read',
    date: 'Oct 2026',
    href: '#resources',
    // Lagos Island skyline — urban, serious, “deal city”
    cover: 'https://images.unsplash.com/photo-1719314073622-9399d167725b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D', 
    featured: true,
  },
  {
    id: 'r2',
    type: 'Podcast' as const,
    title: 'Cheque size is a signal — not the strategy',
    excerpt: 'A partner at a Dakar-based fund on pace, conviction, and saying no early.',
    meta: 'Ep. 42 · 34 min',
    date: 'Oct 2026',
    href: '#resources',
    // Close mic / studio — reads as audio without looking random
    cover:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&q=80',
    featured: false,
  },
  {
    id: 'r3',
    type: 'Report' as const,
    title: 'State of African seed · H2 2026',
    excerpt: 'Cheque sizes, sectors, and where capital is actually landing this half.',
    meta: '48 pages',
    date: 'Sep 2026',
    href: '#resources',
    // Desk + data — research / memo energy
    cover:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
    featured: false,
  },
  {
    id: 'r4',
    type: 'Event' as const,
    title: 'BB Africa Capital Night · Nairobi',
    excerpt: 'Founders and investors, one room, no pitch theatre.',
    meta: 'Nov 14 · Nairobi',
    date: 'Upcoming',
    href: '#resources',
    // Room full of people — mixer / night energy
    cover:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80',
    featured: false,
  },
  {
    id: 'r5',
    type: 'Blog' as const,
    title: 'Hiring your first ten in a multi-city team',
    excerpt: 'What breaks first when the second office opens — and what to protect.',
    meta: '12 min read',
    date: 'Sep 2026',
    href: '#resources',
    // Operators at laptops — team / hiring
    cover:
      'https://images.unsplash.com/photo-1739298061709-cfc57e6b620e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
    featured: false,
  },
  {
    id: 'r6',
    type: 'Press' as const,
    title: 'BB Africa in TechCabal: mapping the next wave',
    excerpt: 'Coverage of the directory launch and the operators behind it.',
    meta: 'TechCabal',
    date: 'Aug 2026',
    href: '#resources',
    // Lekki–Ikoyi Link Bridge, Lagos — landmark, press-ready
    cover:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80',
    featured: false,
  },
];


function FeaturedStrip() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (reduce) setUserPaused(true);
  }, [reduce]);

  const next = useCallback(() => setIndex((i) => (i + 1) % INSIGHTS.length), []);
  const paused = userPaused || hovered || focused;
  const item = INSIGHTS[index];

  return (
    <div
      className={`hero-strip ${paused ? 'is-paused' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="strip-track">
        <div key={index} className="strip-bar" onAnimationEnd={next} />
      </div>
      <div className="strip-row">
        <span className="strip-chip">Featured insights</span>
        <div className="strip-title" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.a
              key={index}
              href={item.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {item.title}
            </motion.a>
          </AnimatePresence>
        </div>
        <div className="strip-controls">
          {!reduce && (
            <button
              type="button"
              className="strip-btn"
              onClick={() => setUserPaused((v) => !v)}
              aria-label={userPaused ? 'Play featured insights' : 'Pause featured insights'}
            >
              {userPaused ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4v16l13-8z" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                </svg>
              )}
            </button>
          )}
          <button type="button" className="strip-btn" onClick={next} aria-label="Next insight">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const reduce = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDesktop = useRef(false);

  const closeAll = useCallback(() => {
    setSearchOpen(false);
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    const check = () => {
      isDesktop.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeAll]);

  useEffect(() => {
    if (searchOpen) {
      const t = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = searchOpen || menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen, menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });

    const motif = document.getElementById('motif');
    const onParallax = () => {
      const y = window.scrollY;
      if (motif && y < window.innerHeight) {
        motif.style.transform = `translate(-50%, calc(-50% + ${y * 0.12}px))`;
      }
    };
    window.addEventListener('scroll', onParallax, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = [...(entry.target.parentElement?.children || [])];
            const i = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('in'), i * 70);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    document.querySelectorAll('.card, .path, .insight, .resource').forEach((el) => {
      io.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onParallax);
      io.disconnect();
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    };
  }, []);

  const openSearch = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    setMenuOpen(false);
    setSearchOpen(true);
  };

  const scheduleCloseSearch = () => {
    if (!isDesktop.current) return;
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = setTimeout(() => setSearchOpen(false), 280);
  };

  const cancelCloseSearch = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
  };

  const menuLinks = [
    { href: '/startups', label: 'Startups' },
    { href: '/startups', label: 'Founders' },
    { href: '/startups', label: 'Investors' },
    { href: '#insights', label: 'Insights' },
  ];

  const lead = FEATURED[0];
  const rest = FEATURED.slice(1, 5);

  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.35,
            delay: i * 0.08,
            ease: [0.32, 0.72, 0, 1] as const,
          },
        };

  return (
    <div className={display.variable}>
      <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo" onClick={closeAll}>
            <Image
              src="https://bbafrica.sbs/wp-content/uploads/2026/04/BBA-Logo-White.svg"
              alt="BB Africa"
              width={42}
              height={42}
              priority
            />
          </Link>

          <div className="nav-actions">
            <div className="nav-pill">
              <button
                ref={searchBtnRef}
                type="button"
                className="nav-icon-btn"
                onClick={openSearch}
                onMouseEnter={() => {
                  if (isDesktop.current) openSearch();
                }}
                onMouseLeave={scheduleCloseSearch}
                aria-label="Search"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </button>

              <div className="pill-links">
                {menuLinks.map((link) => (
                  <Link key={link.label} href={link.href} onClick={closeAll}>
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link href="/liststartup" className="pill-cta" onClick={closeAll}>
                List your startup
              </Link>

              <button
                type="button"
                className="nav-icon-btn nav-menu-btn"
                onClick={() => {
                  setSearchOpen(false);
                  setMenuOpen((v) => !v);
                }}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <span className="hamburger">
                  <motion.span
                    animate={menuOpen ? { y: 6.6, rotate: 45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                  />
                  <motion.span
                    animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.18 }}
                  />
                  <motion.span
                    animate={menuOpen ? { y: -6.6, rotate: -45 } : { y: 0, rotate: 0 }}
                    transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="search-overlay"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              onMouseEnter={cancelCloseSearch}
              onMouseLeave={scheduleCloseSearch}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSearchOpen(false);
              }}
            >
              <motion.div
                className="search-bar"
                initial={{ opacity: 0, scale: 0.55, x: 48, y: -4 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, x: 36, y: -2 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.7 }}
                style={{ originX: 1, originY: 0.5 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search startups, founders, investors…"
                  className="search-input"
                />
                <button
                  type="button"
                  className="nav-icon-btn search-close"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <div className="mobile-menu is-open" aria-hidden={false}>
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu-panel"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            >
              <nav className="mobile-menu-links">
                {menuLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, delay: 0.05 + i * 0.05, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <Link href={link.href} onClick={closeAll}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.32, delay: 0.26, ease: [0.32, 0.72, 0, 1] }}
                >
                  <Link href="/liststartup" onClick={closeAll} className="mobile-cta">
                    List your startup
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="hero">
        <div className="hero-motif" id="motif" aria-hidden="true">
          <svg className="ribbons" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ribA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#222730" />
                <stop offset="1" stopColor="#0a0b0e" />
              </linearGradient>
              <linearGradient id="ribB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#181b21" />
                <stop offset="1" stopColor="#060708" />
              </linearGradient>
              <linearGradient id="hl" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.55" stopColor="#fff" stopOpacity="1" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {RIBBONS.map((r, i) => (
              <g key={i}>
                <path d={r.d} fill={r.fill} />
                <path d={r.d} stroke="url(#hl)" strokeOpacity={r.highlight} strokeWidth="1.5" />
              </g>
            ))}
          </svg>
        </div>
        <div className="hero-shade" aria-hidden="true" />

        <div className="hero-inner">
          <motion.div className="hero-label" {...rise(0)}>
            Pan-African tech platform
          </motion.div>
          <motion.h1 {...rise(1)}>
            <span className="line">Discover, fund and join</span>
            <em className="line">Africa’s next wave</em>
          </motion.h1>
          <motion.p className="hero-desc" {...rise(2)}>
            The essential directory for African startups, founders and investors.
            Track traction. Raise capital. Find talent.
          </motion.p>
          <motion.div className="hero-actions" {...rise(3)}>
            <Link href="/startups" className="btn btn-primary">
              Explore Directory
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/liststartup" className="btn btn-ghost">
              List your startup
            </Link>
          </motion.div>
        </div>

        <FeaturedStrip />
      </section>

     <section className="section section-startups" id="directory">
  <div className="startups-header">
    <div className="startups-header-copy">
      <p className="startups-eyebrow">On the rise</p>
      <h2 className="startups-title">Spotlight across the ecosystem</h2>
      <p className="startups-lede">
        Startups, founders and investors earning attention this quarter —
        the people and companies shaping Africa’s next wave.
      </p>
    </div>
    <Link href="/startups" className="startups-all">
      Browse directory
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  </div>

  {/* Lead split */}
  {(() => {
    const lead = FEATURED[0];
    return (
      <a href={lead.href} className="spot-lead card">
        <div className="spot-lead-copy">
          <div className="spot-lead-tags">
            <span className="badge-kind">{lead.kind}</span>
            <span className="badge-green">{lead.badge}</span>
            {lead.status && <span className="badge-orange">{lead.status}</span>}
          </div>
          <h3 className="spot-lead-name">{lead.name}</h3>
          <p className="spot-lead-loc">{lead.location}</p>
          <p className="spot-lead-desc">{lead.description}</p>
          <div className="spot-lead-metrics">
            <div>
              <span className="startup-stat-label">{lead.metricALabel}</span>
              <span className="startup-stat-value">{lead.metricAValue}</span>
            </div>
            <div>
              <span className="startup-stat-label">{lead.metricBLabel}</span>
              <span className="startup-stat-value">{lead.metricBValue}</span>
            </div>
          </div>
          <span className="spot-lead-cta">
            View profile
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
        <div className="spot-lead-media">
          <img src={lead.cover} alt="" />
          <div className="spot-lead-media-shade" />
          <div className="spot-float">
            <span className="spot-float-label">{lead.metricALabel}</span>
            <span className="spot-float-value">{lead.metricAValue}</span>
          </div>
        </div>
      </a>
    );
  })()}

  {/* Pair row */}
  <div className="spot-pair">
    {FEATURED.slice(1, 3).map((s) => (
      <a key={s.id} href={s.href} className="spot-split card">
        <div className="spot-split-copy">
          <div className="spot-lead-tags">
            <span className="badge-kind">{s.kind}</span>
            {s.status && <span className="badge-orange">{s.status}</span>}
          </div>
          <h3 className="spot-split-name">{s.name}</h3>
          <p className="spot-split-desc">{s.description}</p>
          <p className="spot-split-meta">
            {s.footLine}
            <span className="resource-dot" />
            {s.location}
          </p>
        </div>
        <div className="spot-split-media">
          <img src={s.cover} alt="" />
        </div>
      </a>
    ))}
  </div>

  {/* Compact row */}
  <div className="spot-row">
    {FEATURED.slice(3, 6).map((s) => (
      <a key={s.id} href={s.href} className="spot-tile card">
        <div className="spot-tile-media">
          <img src={s.cover} alt="" />
          <span className="badge-kind spot-tile-kind">{s.kind}</span>
        </div>
        <div className="spot-tile-body">
          <h3 className="spot-tile-name">{s.name}</h3>
          <p className="spot-tile-meta">{s.footLine}</p>
        </div>
      </a>
    ))}
  </div>
</section>

          <section className="section section-resources" id="resources">
      <div className="resources-header">
        <div className="resources-header-copy">
          <p className="resources-eyebrow">Resource centre</p>
          <h2 className="resources-title">
            Signals from the ecosystem
          </h2>
          <p className="resources-lede">
            Interviews, reports, sessions and field notes — the reading and listening
            that keep founders and investors sharp.
          </p>
        </div>
        <a href="#resources" className="resources-all">
          All resources
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="resources-stage">
        {/* Cinematic lead */}
        {(() => {
          const lead = RESOURCES.find((r) => r.featured) ?? RESOURCES[0];
          return (
            <a href={lead.href} className="resource-lead card">
              <div className="resource-lead-media">
                <img src={lead.cover} alt="" className="resource-lead-cover" />
                <div className="resource-lead-veil" />
                <div className="resource-lead-grain" aria-hidden="true" />
              </div>
              <div className="resource-lead-body">
                <div className="resource-lead-meta">
                  <span className="resource-type">{lead.type}</span>
                  <span className="resource-dot" />
                  <span className="resource-meta-text">{lead.meta}</span>
                  <span className="resource-dot" />
                  <span className="resource-meta-text">{lead.date}</span>
                </div>
                <h3 className="resource-lead-title">{lead.title}</h3>
                <p className="resource-lead-excerpt">{lead.excerpt}</p>
                <span className="resource-lead-cta">
                  Read story
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </a>
          );
        })()}

        {/* Side stack — mixed types */}
        <div className="resource-stack">
          {RESOURCES.filter((r) => !r.featured)
            .slice(0, 3)
            .map((r, i) => (
              <a key={r.id} href={r.href} className="resource-stack-item card" style={{ ['--i' as string]: i }}>
                <div className="resource-stack-media">
                  <img src={r.cover} alt="" />
                </div>
                <div className="resource-stack-body">
                  <div className="resource-stack-top">
                    <span className="resource-type resource-type-sm">{r.type}</span>
                    <span className="resource-meta-text">{r.meta}</span>
                  </div>
                  <h3 className="resource-stack-title">{r.title}</h3>
                </div>
              </a>
            ))}
        </div>
      </div>

      {/* Lower rail — remaining mix */}
      <div className="resource-rail">
        {RESOURCES.filter((r) => !r.featured)
          .slice(3)
          .map((r) => (
            <a key={r.id} href={r.href} className="resource-tile card">
              <div className="resource-tile-media">
                <img src={r.cover} alt="" />
                <div className="resource-tile-shade" />
                <span className="resource-type resource-type-on-media">{r.type}</span>
              </div>
              <div className="resource-tile-body">
                <h3 className="resource-tile-title">{r.title}</h3>
                <p className="resource-tile-meta">
                  <span>{r.meta}</span>
                  <span className="resource-dot" />
                  <span>{r.date}</span>
                </p>
              </div>
            </a>
          ))}
      </div>
          </section>
    <section className="section section-purpose" id="about">
  <div className="purpose-inner">
    <p className="purpose-eyebrow">About</p>

    <h2 className="purpose-title">
      Business Bee Africa connects people, companies, and capital across African tech.
    </h2>

    <p className="purpose-body">
      We put startups, founders, investors, and operators in one place so emerging
      ventures can be found, followed, and taken seriously. Through the directory,
      original reporting, and programmes such as the African Tech Tour, we surface
      real work and real opportunities across the continent.
    </p>

    <ul className="purpose-paths">
      <li>
        <Link href="/startups" className="purpose-path">
          <span className="purpose-path-label">Founders</span>
          <span className="purpose-path-desc">
            List your company and stay visible to capital and talent
          </span>
          <span className="purpose-path-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </li>
      <li>
        <Link href="/startups" className="purpose-path">
          <span className="purpose-path-label">Investors</span>
          <span className="purpose-path-desc">
            Track startups, founders, and where attention is moving
          </span>
          <span className="purpose-path-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </li>
      <li>
        <a href="#resources" className="purpose-path">
          <span className="purpose-path-label">Operators</span>
          <span className="purpose-path-desc">
            Read the signal and plug into the network
          </span>
          <span className="purpose-path-arrow" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </a>
      </li>
    </ul>
  </div>
</section>

            <section className="section section-close" id="join">
<div className="close-panel">
  <div className="close-motif" aria-hidden="true">
  <svg
    className="close-ribbons"
    viewBox="0 0 800 420"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="closeRibA" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a1f26" />
        <stop offset="1" stopColor="#0e1218" />
      </linearGradient>
      <linearGradient id="closeRibB" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#222830" />
        <stop offset="1" stopColor="#12161c" />
      </linearGradient>
      <linearGradient id="closeHl" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.08" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    {[
      'M-80 80 C 120 20, 280 160, 480 90 S 720 40, 880 100 L 880 420 L -80 420 Z',
      'M-80 140 C 140 70, 300 210, 500 140 S 740 90, 880 150 L 880 420 L -80 420 Z',
      'M-80 200 C 160 130, 320 260, 520 190 S 760 140, 880 210 L 880 420 L -80 420 Z',
      'M-80 260 C 180 190, 340 310, 540 240 S 780 190, 880 270 L 880 420 L -80 420 Z',
      'M-80 320 C 200 250, 360 360, 560 290 S 800 240, 880 330 L 880 420 L -80 420 Z',
    ].map((d, i) => (
      <g key={i}>
        <path
          d={d}
          fill={i % 2 === 0 ? 'url(#closeRibA)' : 'url(#closeRibB)'}
          opacity={0.45 + i * 0.06}
        />
        <path d={d} stroke="url(#closeHl)" strokeWidth="1.2" fill="none" />
      </g>
    ))}
  </svg>
</div>

  <div className="close-grid">
    <div className="close-copy">
      <p className="close-eyebrow">Stay close</p>
      <h2 className="close-title">
        The ecosystem moves fast. Keep the useful parts.
      </h2>
      <p className="close-lede">
        Short briefings on startups, founders, capital, and the stories behind them.
        No noise. Unsubscribe whenever you want.
      </p>
    </div>

    <form
      className="close-form"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label htmlFor="close-email" className="sr-only">
        Email address
      </label>
      <div className="close-field">
        <input
          id="close-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className="close-input"
        />
        <button type="submit" className="close-submit">
          Subscribe
        </button>
      </div>
      <p className="close-hint">One email a week. No pitch decks in your inbox.</p>
    </form>
  </div>
</div>

  <footer className="site-footer">
    <div className="footer-top">
      <div className="footer-brand">
        <Link href="/" className="footer-logo">
          <Image
            src="https://bbafrica.sbs/wp-content/uploads/2026/04/BBA-Logo-White.svg"
            alt="BB Africa"
            width={36}
            height={36}
          />
        </Link>
        <p className="footer-tag">
          The directory for African startups, founders, and investors.
        </p>
      </div>

      <div className="footer-cols">
        <div className="footer-col">
          <p className="footer-heading">Explore</p>
          <Link href="/startups">Directory</Link>
          <Link href="#resources">Resources</Link>
          <Link href="#about">About</Link>
        </div>
        <div className="footer-col">
          <p className="footer-heading">For you</p>
          <Link href="/liststartup">List your startup</Link>
          <Link href="/startups">For investors</Link>
          <Link href="#resources">Events & reports</Link>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Connect</p>
          <a href="mailto:hello@bbafrica.sbs">hello@bbafrica.sbs</a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </div>

    <div className="footer-bottom">
      <p className="footer-legal">
        © {new Date().getFullYear()} Business Bee Africa. All rights reserved.
      </p>
      <div className="footer-legal-links">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </div>
    </div>
  </footer>
</section>
    </div>
  );
}