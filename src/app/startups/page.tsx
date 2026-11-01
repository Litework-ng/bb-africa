'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './startups.css';

const display = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

/* ------------------------------------------------------------------ */
/* Types & data                                                       */
/* ------------------------------------------------------------------ */

type Stage =
  | 'Pre-seed'
  | 'Seed'
  | 'Series A'
  | 'Series B'
  | 'Series C+'
  | 'Growth'
  | 'Bootstrapped';

type Sector =
  | 'Fintech'
  | 'Commerce'
  | 'Health'
  | 'Logistics'
  | 'Agritech'
  | 'Edtech'
  | 'Climate'
  | 'SaaS / B2B'
  | 'Media'
  | 'Other';

interface Startup {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  sector: Sector;
  stage: Stage;
  status: 'Raising' | 'Not raising' | 'Stealth' | null;
  description: string;
  oneLiner: string;
  raised?: string;
  teamSize?: string;
  founded?: number;
  cover: string;
  initials: string;
  href: string;
}

const STARTUPS: Startup[] = [
  {
    id: 'paystack',
    name: 'Paystack',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Fintech',
    stage: 'Series B',
    status: 'Raising',
    description: 'Modern payments infrastructure for African businesses.',
    oneLiner: 'Modern payments infrastructure for African businesses.',
    raised: '$200M',
    teamSize: '200+',
    founded: 2015,
    cover:
      'https://d1jcea4y7xhp7l.cloudfront.net/wp-content/uploads/2026/01/Paystack-Acquires-Ladder-Microfinance-Bank-750x536-1.png',
    initials: 'PS',
    href: '#',
  },
  {
    id: 'wasoko',
    name: 'Wasoko',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Commerce',
    stage: 'Series B',
    status: 'Raising',
    description: 'B2B e-commerce for informal retailers across East Africa.',
    oneLiner: 'B2B e-commerce for informal retailers across East Africa.',
    raised: '$125M',
    teamSize: '800+',
    founded: 2016,
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    initials: 'WA',
    href: '#',
  },
  {
    id: 'fieldgrid',
    name: 'FieldGrid',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Logistics',
    stage: 'Series A',
    status: null,
    description: 'Digitising last-mile distribution for FMCG across East Africa.',
    oneLiner: 'Digitising last-mile distribution for FMCG across East Africa.',
    raised: '$18M',
    teamSize: '120',
    founded: 2019,
    cover:
      'https://images.unsplash.com/photo-1573495783323-9e59a325d4b4?q=80&w=688&auto=format&fit=crop',
    initials: 'FG',
    href: '#',
  },
  {
    id: 'shoreline',
    name: 'Shoreline',
    location: 'Cape Town, South Africa',
    city: 'Cape Town',
    country: 'South Africa',
    sector: 'Fintech',
    stage: 'Series A',
    status: 'Raising',
    description: 'Embedded finance for Southern African SMEs.',
    oneLiner: 'Embedded finance for Southern African SMEs.',
    raised: '$22M',
    teamSize: '65',
    founded: 2020,
    cover:
      'https://images.unsplash.com/photo-1578758803946-2c4f6738df87?q=80&w=1974&auto=format&fit=crop',
    initials: 'SL',
    href: '#',
  },
  {
    id: 'flutterwave',
    name: 'Flutterwave',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Fintech',
    stage: 'Series C+',
    status: null,
    description: 'Payments infrastructure powering global commerce across Africa.',
    oneLiner: 'Payments infrastructure powering global commerce across Africa.',
    raised: '$477M',
    teamSize: '400+',
    founded: 2016,
    cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    initials: 'FW',
    href: '#',
  },
  {
    id: 'andela',
    name: 'Andela',
    location: 'Lagos / Remote',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'SaaS / B2B',
    stage: 'Series C+',
    status: null,
    description: 'Connecting African engineering talent with global companies.',
    oneLiner: 'Connecting African engineering talent with global companies.',
    raised: '$381M',
    teamSize: '1000+',
    founded: 2014,
    cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    initials: 'AN',
    href: '#',
  },
  {
    id: 'chipper',
    name: 'Chipper Cash',
    location: 'Kampala / San Francisco',
    city: 'Kampala',
    country: 'Uganda',
    sector: 'Fintech',
    stage: 'Series C+',
    status: null,
    description: 'Cross-border payments and financial services for Africa.',
    oneLiner: 'Cross-border payments and financial services for Africa.',
    raised: '$300M+',
    teamSize: '300+',
    founded: 2018,
    cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    initials: 'CC',
    href: '#',
  },
  {
    id: 'yoco',
    name: 'Yoco',
    location: 'Cape Town, South Africa',
    city: 'Cape Town',
    country: 'South Africa',
    sector: 'Fintech',
    stage: 'Series B',
    status: null,
    description: 'Point-of-sale and business tools for South African SMEs.',
    oneLiner: 'Point-of-sale and business tools for South African SMEs.',
    raised: '$83M',
    teamSize: '250+',
    founded: 2015,
    cover: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&q=80',
    initials: 'YO',
    href: '#',
  },
  {
    id: 'twiga',
    name: 'Twiga Foods',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Agritech',
    stage: 'Series B',
    status: 'Raising',
    description: 'Connecting farmers to retailers through a mobile-based B2B platform.',
    oneLiner: 'Connecting farmers to retailers through a mobile-based B2B platform.',
    raised: '$50M+',
    teamSize: '400+',
    founded: 2014,
    cover: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    initials: 'TF',
    href: '#',
  },
  {
    id: 'm-kopa',
    name: 'M-KOPA',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Climate',
    stage: 'Series C+',
    status: null,
    description: 'Asset financing for solar and connected devices across East Africa.',
    oneLiner: 'Asset financing for solar and connected devices across East Africa.',
    raised: '$200M+',
    teamSize: '1000+',
    founded: 2011,
    cover: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    initials: 'MK',
    href: '#',
  },
  {
    id: 'max',
    name: 'MAX',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Logistics',
    stage: 'Series A',
    status: 'Raising',
    description: 'On-demand logistics and mobility for people and goods.',
    oneLiner: 'On-demand logistics and mobility for people and goods.',
    raised: '$30M',
    teamSize: '180',
    founded: 2015,
    cover: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
    initials: 'MX',
    href: '#',
  },
  {
    id: 'tanda',
    name: 'Tanda',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Fintech',
    stage: 'Seed',
    status: 'Raising',
    description: 'Payroll and employee financial wellness for African businesses.',
    oneLiner: 'Payroll and employee financial wellness for African businesses.',
    raised: '$4.5M',
    teamSize: '45',
    founded: 2019,
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    initials: 'TD',
    href: '#',
  },
  {
    id: 'lifebank',
    name: 'LifeBank',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Health',
    stage: 'Series A',
    status: null,
    description: 'On-demand delivery of blood and medical oxygen across Nigeria.',
    oneLiner: 'On-demand delivery of blood and medical oxygen across Nigeria.',
    raised: '$12M',
    teamSize: '90',
    founded: 2016,
    cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    initials: 'LB',
    href: '#',
  },
  {
    id: 'ulesson',
    name: 'uLesson',
    location: 'Lagos / Abuja',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Edtech',
    stage: 'Series A',
    status: null,
    description: 'Live and recorded lessons for secondary school students across Africa.',
    oneLiner: 'Live and recorded lessons for secondary school students across Africa.',
    raised: '$15M',
    teamSize: '120',
    founded: 2019,
    cover: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    initials: 'UL',
    href: '#',
  },
  {
    id: 'farmcrowdy',
    name: 'Farmcrowdy',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Agritech',
    stage: 'Seed',
    status: null,
    description: 'Digital agriculture platform connecting farmers with sponsors.',
    oneLiner: 'Digital agriculture platform connecting farmers with sponsors.',
    raised: '$7M',
    teamSize: '55',
    founded: 2016,
    cover: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    initials: 'FC',
    href: '#',
  },
  {
    id: 'wave',
    name: 'Wave',
    location: 'Dakar, Senegal',
    city: 'Dakar',
    country: 'Senegal',
    sector: 'Fintech',
    stage: 'Series A',
    status: null,
    description: 'Mobile money and financial services built for West Africa.',
    oneLiner: 'Mobile money and financial services built for West Africa.',
    raised: '$200M+',
    teamSize: '500+',
    founded: 2018,
    cover: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80',
    initials: 'WV',
    href: '#',
  },
];

const STAGES: Stage[] = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C+',
  'Growth',
  'Bootstrapped',
];

const SECTORS: Sector[] = [
  'Fintech',
  'Commerce',
  'Health',
  'Logistics',
  'Agritech',
  'Edtech',
  'Climate',
  'SaaS / B2B',
  'Media',
  'Other',
];

const CITIES = ['Lagos', 'Nairobi', 'Cape Town', 'Dakar', 'Kampala', 'Accra', 'Johannesburg'];

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function StartupsPage() {
  const reduce = useReducedMotion();
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState<Stage | 'All'>('All');
  const [sector, setSector] = useState<Sector | 'All'>('All');
  const [city, setCity] = useState<string | 'All'>('All');
  const [raisingOnly, setRaisingOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STARTUPS.filter((s) => {
      if (q && !`${s.name} ${s.oneLiner} ${s.location} ${s.sector}`.toLowerCase().includes(q))
        return false;
      if (stage !== 'All' && s.stage !== stage) return false;
      if (sector !== 'All' && s.sector !== sector) return false;
      if (city !== 'All' && s.city !== city) return false;
      if (raisingOnly && s.status !== 'Raising') return false;
      return true;
    });
  }, [search, stage, sector, city, raisingOnly]);

  const activeFilterCount =
    (stage !== 'All' ? 1 : 0) +
    (sector !== 'All' ? 1 : 0) +
    (city !== 'All' ? 1 : 0) +
    (raisingOnly ? 1 : 0);

  const clearFilters = useCallback(() => {
    setStage('All');
    setSector('All');
    setCity('All');
    setRaisingOnly(false);
    setSearch('');
  }, []);

  return (
    <div className={`sd ${display.variable}`}>
      {/* Soft ambient glow */}
      <div className="sd-ambient" aria-hidden="true" />

      {/* Nav */}
      <nav className={`sd-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="sd-nav-inner">
          <Link href="/" className="sd-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            BB Africa
          </Link>

          <Link href="/" className="sd-logo" aria-label="Home">
            <Image
              src="https://bbafrica.sbs/wp-content/uploads/2026/04/BBA-Logo-White.svg"
              alt="BB Africa"
              width={32}
              height={32}
              priority
            />
          </Link>

          <Link href="/liststartup" className="sd-cta">
            List startup
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="sd-header">
        <div className="sd-header-top">
          <p className="sd-eyebrow">Directory</p>
          <h1 className="sd-title">Startups</h1>
        </div>
        <p className="sd-lede">Explore African startups by stage, sector and city.</p>
      </header>

      {/* Control surface */}
      <div className="sd-controls">
        <div className="sd-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search startups…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search startups"
          />
          {search && (
            <button type="button" className="sd-search-x" onClick={() => setSearch('')} aria-label="Clear">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="button"
          className={`sd-filter-btn ${filtersOpen ? 'is-open' : ''}`}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M6 12h12M9 18h6" />
          </svg>
          Filters
          {activeFilterCount > 0 && <span className="sd-badge">{activeFilterCount}</span>}
        </button>

        {/* Desktop quick filters */}
        <div className="sd-quick">
          <button
            type="button"
            className={`sd-chip ${raisingOnly ? 'is-on' : ''}`}
            onClick={() => setRaisingOnly((v) => !v)}
          >
            Raising
          </button>
          {['Fintech', 'Commerce', 'Logistics', 'Health'].map((s) => (
            <button
              key={s}
              type="button"
              className={`sd-chip ${sector === s ? 'is-on' : ''}`}
              onClick={() => setSector(sector === s ? 'All' : (s as Sector))}
            >
              {s}
            </button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <button type="button" className="sd-clear" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      {/* Expanded filters panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="sd-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="sd-panel-inner">
              <div className="sd-field">
                <span className="sd-label">Stage</span>
                <div className="sd-options">
                  <button
                    type="button"
                    className={`sd-opt ${stage === 'All' ? 'is-on' : ''}`}
                    onClick={() => setStage('All')}
                  >
                    All
                  </button>
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`sd-opt ${stage === s ? 'is-on' : ''}`}
                      onClick={() => setStage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sd-field">
                <span className="sd-label">Sector</span>
                <div className="sd-options">
                  <button
                    type="button"
                    className={`sd-opt ${sector === 'All' ? 'is-on' : ''}`}
                    onClick={() => setSector('All')}
                  >
                    All
                  </button>
                  {SECTORS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`sd-opt ${sector === s ? 'is-on' : ''}`}
                      onClick={() => setSector(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sd-field">
                <span className="sd-label">City</span>
                <div className="sd-options">
                  <button
                    type="button"
                    className={`sd-opt ${city === 'All' ? 'is-on' : ''}`}
                    onClick={() => setCity('All')}
                  >
                    All
                  </button>
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`sd-opt ${city === c ? 'is-on' : ''}`}
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
      <div className="sd-meta">
        <span>
          {filtered.length} {filtered.length === 1 ? 'startup' : 'startups'}
          {activeFilterCount > 0 && ' · filtered'}
        </span>
      </div>

      {/* Grid */}
      <div className="sd-grid">
        {filtered.length === 0 ? (
          <div className="sd-empty">
            <p>No startups match these filters</p>
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((s, i) => (
            <a
              key={s.id}
              href={s.href}
              className="sd-card"
              style={{ animationDelay: reduce ? '0ms' : `${i * 35}ms` }}
            >
              <div className="sd-card-media">
                <img src={s.cover} alt="" loading="lazy" />
                <div className="sd-card-veil" />
                {s.status === 'Raising' && <span className="sd-raising">Raising</span>}
              </div>

              <div className="sd-card-body">
                <div className="sd-card-row">
                  <span className="sd-sector">{s.sector}</span>
                  <span className="sd-stage">{s.stage}</span>
                </div>

                <h2 className="sd-name">{s.name}</h2>
                <p className="sd-desc">{s.oneLiner}</p>

                <div className="sd-card-foot">
                  <span className="sd-loc">{s.location}</span>
                  {s.raised && (
                    <>
                      <span className="sd-dot" />
                      <span className="sd-raised">{s.raised}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Hover glow edge */}
              <span className="sd-glow" aria-hidden="true" />
            </a>
          ))
        )}
      </div>

      <footer className="sd-footer">
        <p>
          © {new Date().getFullYear()} Business Bee Africa
          <span className="sd-sep">·</span>
          <Link href="/">Home</Link>
          <span className="sd-sep">·</span>
          <Link href="/liststartup">List your startup</Link>
        </p>
      </footer>
    </div>
  );
}
