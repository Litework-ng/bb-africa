'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './investors.css';

const display = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

/* ------------------------------------------------------------------ */
/* Types & data                                                       */
/* ------------------------------------------------------------------ */

type Focus =
  | 'Pre-seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Multi-stage'
  | 'Growth'
  | 'All stages';

type Type = 'Venture' | 'Corporate' | 'Angel' | 'Family office' | 'Accelerator';

interface Investor {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  focus: Focus;
  type: Type;
  status: 'Active' | 'Inactive' | null;
  description: string;
  oneLiner: string;
  ticket?: string;
  aum?: string;
  cover: string;
  initials: string;
  href: string;
}

const INVESTORS: Investor[] = [
  {
    id: 'partech-africa',
    name: 'Partech Africa',
    location: 'Dakar / Paris',
    city: 'Dakar',
    country: 'Senegal',
    focus: 'Multi-stage',
    type: 'Venture',
    status: 'Active',
    description: 'Backing category-defining tech companies across the continent.',
    oneLiner: 'Backing category-defining tech companies across the continent.',
    ticket: '$1–15M',
    aum: '$400M+',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    initials: 'PA',
    href: '#',
  },
  {
    id: 'echovc',
    name: 'EchoVC',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    focus: 'Seed',
    type: 'Venture',
    status: 'Active',
    description: 'Early-stage fund investing in African founders.',
    oneLiner: 'Early-stage fund investing in African founders.',
    ticket: '$250K–2M',
    aum: '$100M+',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    initials: 'EV',
    href: '#',
  },
  {
    id: 'tlcom',
    name: 'TLcom Capital',
    location: 'Lagos / London',
    city: 'Lagos',
    country: 'Nigeria',
    focus: 'Series A',
    type: 'Venture',
    status: 'Active',
    description: 'Growth capital for technology companies across Africa.',
    oneLiner: 'Growth capital for technology companies across Africa.',
    ticket: '$2–10M',
    aum: '$160M+',
    cover: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    initials: 'TL',
    href: '#',
  },
  {
    id: 'ventures-platform',
    name: 'Ventures Platform',
    location: 'Lagos / Abuja',
    city: 'Lagos',
    country: 'Nigeria',
    focus: 'Seed',
    type: 'Venture',
    status: 'Active',
    description: 'Pre-seed and seed investor backing African founders from day one.',
    oneLiner: 'Pre-seed and seed investor backing African founders from day one.',
    ticket: '$50K–1M',
    aum: '$50M+',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    initials: 'VP',
    href: '#',
  },
  {
    id: 'norrsken22',
    name: 'Norrsken22',
    location: 'Kigali / Stockholm',
    city: 'Kigali',
    country: 'Rwanda',
    focus: 'Series A',
    type: 'Venture',
    status: 'Active',
    description: 'Impact-focused growth fund for African tech companies.',
    oneLiner: 'Impact-focused growth fund for African tech companies.',
    ticket: '$2–15M',
    aum: '$200M+',
    cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    initials: 'N22',
    href: '#',
  },
  {
    id: 'future-africa',
    name: 'Future Africa',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    focus: 'Pre-seed',
    type: 'Venture',
    status: 'Active',
    description: 'Operator-led fund investing in early African startups.',
    oneLiner: 'Operator-led fund investing in early African startups.',
    ticket: '$25K–500K',
    aum: '$30M+',
    cover: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    initials: 'FA',
    href: '#',
  },
  {
    id: 'capria',
    name: 'Capria Ventures',
    location: 'Nairobi / Seattle',
    city: 'Nairobi',
    country: 'Kenya',
    focus: 'Multi-stage',
    type: 'Venture',
    status: 'Active',
    description: 'Global emerging markets investor with deep African presence.',
    oneLiner: 'Global emerging markets investor with deep African presence.',
    ticket: '$1–8M',
    aum: '$350M+',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    initials: 'CV',
    href: '#',
  },
  {
    id: 'chandaria',
    name: 'Chandaria Capital',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    focus: 'Seed',
    type: 'Family office',
    status: 'Active',
    description: 'Kenyan family office investing in East African tech and innovation.',
    oneLiner: 'Kenyan family office investing in East African tech and innovation.',
    ticket: '$100K–2M',
    cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    initials: 'CC',
    href: '#',
  },
  {
    id: 'y-combinator',
    name: 'Y Combinator',
    location: 'San Francisco / Global',
    city: 'San Francisco',
    country: 'USA',
    focus: 'Seed',
    type: 'Accelerator',
    status: 'Active',
    description: 'Backing African founders through the world’s leading accelerator.',
    oneLiner: 'Backing African founders through the world’s leading accelerator.',
    ticket: '$500K',
    cover: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
    initials: 'YC',
    href: '#',
  },
  {
    id: 'google-for-startups',
    name: 'Google for Startups',
    location: 'Lagos / Nairobi',
    city: 'Lagos',
    country: 'Nigeria',
    focus: 'Seed',
    type: 'Corporate',
    status: 'Active',
    description: 'Equity-free support and capital pathways for African startups.',
    oneLiner: 'Equity-free support and capital pathways for African startups.',
    cover: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80',
    initials: 'GS',
    href: '#',
  },
  {
    id: 'sauce-vc',
    name: 'Sauce VC',
    location: 'Cape Town, South Africa',
    city: 'Cape Town',
    country: 'South Africa',
    focus: 'Seed',
    type: 'Venture',
    status: 'Active',
    description: 'Early-stage fund focused on Southern African tech founders.',
    oneLiner: 'Early-stage fund focused on Southern African tech founders.',
    ticket: '$200K–1.5M',
    aum: '$25M+',
    cover: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    initials: 'SV',
    href: '#',
  },
  {
    id: 'africinvest',
    name: 'AfricInvest',
    location: 'Tunis / Abidjan',
    city: 'Abidjan',
    country: 'Côte d’Ivoire',
    focus: 'Growth',
    type: 'Venture',
    status: 'Active',
    description: 'Pan-African private equity and venture investor.',
    oneLiner: 'Pan-African private equity and venture investor.',
    ticket: '$5–30M',
    aum: '$2B+',
    cover: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    initials: 'AI',
    href: '#',
  },
  {
    id: 'kepple-africa',
    name: 'Kepple Africa Ventures',
    location: 'Lagos / Tokyo',
    city: 'Lagos',
    country: 'Nigeria',
    focus: 'Seed',
    type: 'Venture',
    status: 'Active',
    description: 'Japan-backed early-stage fund investing in African startups.',
    oneLiner: 'Japan-backed early-stage fund investing in African startups.',
    ticket: '$100K–1M',
    cover: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    initials: 'KA',
    href: '#',
  },
  {
    id: 'janngo',
    name: 'Janngo Capital',
    location: 'Abidjan, Côte d’Ivoire',
    city: 'Abidjan',
    country: 'Côte d’Ivoire',
    focus: 'Seed',
    type: 'Venture',
    status: 'Active',
    description: 'Francophone West Africa focused early-stage investor.',
    oneLiner: 'Francophone West Africa focused early-stage investor.',
    ticket: '$50K–800K',
    cover: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    initials: 'JC',
    href: '#',
  },
  {
    id: 'defiance',
    name: 'Defiance Capital',
    location: 'Cape Town, South Africa',
    city: 'Cape Town',
    country: 'South Africa',
    focus: 'Series A',
    type: 'Venture',
    status: 'Active',
    description: 'Backing high-growth technology companies in Southern Africa.',
    oneLiner: 'Backing high-growth technology companies in Southern Africa.',
    ticket: '$1–5M',
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    initials: 'DC',
    href: '#',
  },
  {
    id: 'angel-list-africa',
    name: 'AngelList Africa',
    location: 'Remote / Global',
    city: 'Remote',
    country: 'Global',
    focus: 'Pre-seed',
    type: 'Angel',
    status: 'Active',
    description: 'Syndicates and rolling funds connecting global angels to African deals.',
    oneLiner: 'Syndicates and rolling funds connecting global angels to African deals.',
    ticket: '$25K–500K',
    cover: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
    initials: 'AL',
    href: '#',
  },
];

const FOCUSES: Focus[] = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Multi-stage',
  'Growth',
  'All stages',
];

const TYPES: Type[] = ['Venture', 'Corporate', 'Angel', 'Family office', 'Accelerator'];

const CITIES = [
  'Lagos',
  'Nairobi',
  'Cape Town',
  'Dakar',
  'Kigali',
  'Abidjan',
  'San Francisco',
  'Remote',
];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function InvestorsPage() {
  const reduce = useReducedMotion();
  const [search, setSearch] = useState('');
  const [focus, setFocus] = useState<Focus | 'All'>('All');
  const [type, setType] = useState<Type | 'All'>('All');
  const [city, setCity] = useState<string | 'All'>('All');
  const [activeOnly, setActiveOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return INVESTORS.filter((inv) => {
      if (
        q &&
        !`${inv.name} ${inv.oneLiner} ${inv.location} ${inv.focus} ${inv.type}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (focus !== 'All' && inv.focus !== focus) return false;
      if (type !== 'All' && inv.type !== type) return false;
      if (city !== 'All' && inv.city !== city) return false;
      if (activeOnly && inv.status !== 'Active') return false;
      return true;
    });
  }, [search, focus, type, city, activeOnly]);

  const activeFilterCount =
    (focus !== 'All' ? 1 : 0) +
    (type !== 'All' ? 1 : 0) +
    (city !== 'All' ? 1 : 0) +
    (activeOnly ? 1 : 0);

  const clearFilters = useCallback(() => {
    setFocus('All');
    setType('All');
    setCity('All');
    setActiveOnly(false);
    setSearch('');
  }, []);

  return (
    <div className={`iv ${display.variable}`}>
      <div className="iv-ambient" aria-hidden="true" />

      {/* Nav */}
      <nav className={`iv-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="iv-nav-inner">
          <Link href="/" className="iv-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            BB Africa
          </Link>

          <Link href="/" className="iv-logo" aria-label="Home">
            <Image
              src="https://bbafrica.sbs/wp-content/uploads/2026/04/BBA-Logo-White.svg"
              alt="BB Africa"
              width={32}
              height={32}
              priority
            />
          </Link>

          <Link href="/liststartup" className="iv-cta">
            List startup
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="iv-header">
        <div className="iv-header-top">
          <p className="iv-eyebrow">Directory</p>
          <h1 className="iv-title">Investors</h1>
        </div>
        <p className="iv-lede">
          Funds, angels and institutions backing African founders.
        </p>
      </header>

      {/* Controls */}
      <div className="iv-controls">
        <div className="iv-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search investors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search investors"
          />
          {search && (
            <button type="button" className="iv-search-x" onClick={() => setSearch('')} aria-label="Clear">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="button"
          className={`iv-filter-btn ${filtersOpen ? 'is-open' : ''}`}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M6 12h12M9 18h6" />
          </svg>
          Filters
          {activeFilterCount > 0 && <span className="iv-badge">{activeFilterCount}</span>}
        </button>

        <div className="iv-quick">
          <button
            type="button"
            className={`iv-chip ${activeOnly ? 'is-on' : ''}`}
            onClick={() => setActiveOnly((v) => !v)}
          >
            Active
          </button>
          {['Seed', 'Series A', 'Multi-stage'].map((f) => (
            <button
              key={f}
              type="button"
              className={`iv-chip ${focus === f ? 'is-on' : ''}`}
              onClick={() => setFocus(focus === f ? 'All' : (f as Focus))}
            >
              {f}
            </button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <button type="button" className="iv-clear" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="iv-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="iv-panel-inner">
              <div className="iv-field">
                <span className="iv-label">Focus</span>
                <div className="iv-options">
                  <button
                    type="button"
                    className={`iv-opt ${focus === 'All' ? 'is-on' : ''}`}
                    onClick={() => setFocus('All')}
                  >
                    All
                  </button>
                  {FOCUSES.map((f) => (
                    <button
                      key={f}
                      type="button"
                      className={`iv-opt ${focus === f ? 'is-on' : ''}`}
                      onClick={() => setFocus(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="iv-field">
                <span className="iv-label">Type</span>
                <div className="iv-options">
                  <button
                    type="button"
                    className={`iv-opt ${type === 'All' ? 'is-on' : ''}`}
                    onClick={() => setType('All')}
                  >
                    All
                  </button>
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`iv-opt ${type === t ? 'is-on' : ''}`}
                      onClick={() => setType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="iv-field">
                <span className="iv-label">City</span>
                <div className="iv-options">
                  <button
                    type="button"
                    className={`iv-opt ${city === 'All' ? 'is-on' : ''}`}
                    onClick={() => setCity('All')}
                  >
                    All
                  </button>
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`iv-opt ${city === c ? 'is-on' : ''}`}
                      onClick={() => setCity(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count */}
      <div className="iv-meta">
        <span>
          {filtered.length} {filtered.length === 1 ? 'investor' : 'investors'}
          {activeFilterCount > 0 && ' · filtered'}
        </span>
      </div>

      {/* Grid */}
      <div className="iv-grid">
        {filtered.length === 0 ? (
          <div className="iv-empty">
            <p>No investors match these filters</p>
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((inv, i) => (
            <a
              key={inv.id}
              href={inv.href}
              className="iv-card"
              style={{ animationDelay: reduce ? '0ms' : `${i * 35}ms` }}
            >
              <div className="iv-card-media">
                <img src={inv.cover} alt="" loading="lazy" />
                <div className="iv-card-veil" />
                {inv.status === 'Active' && <span className="iv-active">Active</span>}
              </div>

              <div className="iv-card-body">
                <div className="iv-card-row">
                  <span className="iv-type">{inv.type}</span>
                  <span className="iv-focus">{inv.focus}</span>
                </div>

                <h2 className="iv-name">{inv.name}</h2>
                <p className="iv-desc">{inv.oneLiner}</p>

                <div className="iv-card-foot">
                  <span className="iv-loc">{inv.location}</span>
                  {inv.ticket && (
                    <>
                      <span className="iv-dot" />
                      <span className="iv-ticket">{inv.ticket}</span>
                    </>
                  )}
                </div>
              </div>

              <span className="iv-glow" aria-hidden="true" />
            </a>
          ))
        )}
      </div>

      <footer className="iv-footer">
        <p>
          © {new Date().getFullYear()} Business Bee Africa
          <span className="iv-sep">·</span>
          <Link href="/">Home</Link>
          <span className="iv-sep">·</span>
          <Link href="/startups">Startups</Link>
          <span className="iv-sep">·</span>
          <Link href="/founders">Founders</Link>
          <span className="iv-sep">·</span>
          <Link href="/liststartup">List your startup</Link>
        </p>
      </footer>
    </div>
  );
}
