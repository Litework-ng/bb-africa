'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './founders.css';

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

interface Founder {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  city: string;
  country: string;
  sector: Sector;
  stage: Stage;
  status: 'Raising' | 'Not raising' | 'Stealth' | null;
  description: string;
  oneLiner: string;
  raised?: string;
  cover: string;
  initials: string;
  href: string;
}

const FOUNDERS: Founder[] = [
  {
    id: 'amara-okello',
    name: 'Amara Okello',
    role: 'Co-founder & CEO',
    company: 'FieldGrid',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Logistics',
    stage: 'Series A',
    status: null,
    description: 'Digitising last-mile distribution for FMCG across East Africa.',
    oneLiner: 'Digitising last-mile distribution for FMCG across East Africa.',
    raised: '$18M',
    cover:
      'https://images.unsplash.com/photo-1573495783323-9e59a325d4b4?q=80&w=688&auto=format&fit=crop',
    initials: 'AO',
    href: '#',
  },
  {
    id: 'thabo-dlamini',
    name: 'Thabo Dlamini',
    role: 'CEO & Founder',
    company: 'Shoreline',
    location: 'Cape Town, South Africa',
    city: 'Cape Town',
    country: 'South Africa',
    sector: 'Fintech',
    stage: 'Series A',
    status: 'Raising',
    description: 'Embedded finance for Southern African SMEs.',
    oneLiner: 'Embedded finance for Southern African SMEs.',
    raised: '$22M',
    cover:
      'https://images.unsplash.com/photo-1578758803946-2c4f6738df87?q=80&w=1974&auto=format&fit=crop',
    initials: 'TD',
    href: '#',
  },
  {
    id: 'shola-adebayo',
    name: 'Shola Adebayo',
    role: 'Co-founder',
    company: 'Paystack',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Fintech',
    stage: 'Series B',
    status: null,
    description: 'Building modern payments infrastructure for African businesses.',
    oneLiner: 'Building modern payments infrastructure for African businesses.',
    raised: '$200M',
    cover: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    initials: 'SA',
    href: '#',
  },
  {
    id: 'aisha-mwangi',
    name: 'Aisha Mwangi',
    role: 'Founder & CEO',
    company: 'Twiga Foods',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Agritech',
    stage: 'Series B',
    status: 'Raising',
    description: 'Connecting farmers to retailers through a mobile-based B2B platform.',
    oneLiner: 'Connecting farmers to retailers through a mobile-based B2B platform.',
    raised: '$50M+',
    cover: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80',
    initials: 'AM',
    href: '#',
  },
  {
    id: 'kofi-mensah',
    name: 'Kofi Mensah',
    role: 'Co-founder & CTO',
    company: 'Wave',
    location: 'Dakar, Senegal',
    city: 'Dakar',
    country: 'Senegal',
    sector: 'Fintech',
    stage: 'Series A',
    status: null,
    description: 'Mobile money and financial services built for West Africa.',
    oneLiner: 'Mobile money and financial services built for West Africa.',
    raised: '$200M+',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    initials: 'KM',
    href: '#',
  },
  {
    id: 'nneka-okeke',
    name: 'Nneka Okeke',
    role: 'Founder',
    company: 'LifeBank',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Health',
    stage: 'Series A',
    status: null,
    description: 'On-demand delivery of blood and medical oxygen across Nigeria.',
    oneLiner: 'On-demand delivery of blood and medical oxygen across Nigeria.',
    raised: '$12M',
    cover: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=800&q=80',
    initials: 'NO',
    href: '#',
  },
  {
    id: 'daniel-kimani',
    name: 'Daniel Kimani',
    role: 'CEO',
    company: 'M-KOPA',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Climate',
    stage: 'Series C+',
    status: null,
    description: 'Asset financing for solar and connected devices across East Africa.',
    oneLiner: 'Asset financing for solar and connected devices across East Africa.',
    raised: '$200M+',
    cover: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
    initials: 'DK',
    href: '#',
  },
  {
    id: 'fatou-diallo',
    name: 'Fatou Diallo',
    role: 'Co-founder',
    company: 'Tanda',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Fintech',
    stage: 'Seed',
    status: 'Raising',
    description: 'Payroll and employee financial wellness for African businesses.',
    oneLiner: 'Payroll and employee financial wellness for African businesses.',
    raised: '$4.5M',
    cover: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    initials: 'FD',
    href: '#',
  },
  {
    id: 'ibrahim-sow',
    name: 'Ibrahim Sow',
    role: 'Founder & CEO',
    company: 'MAX',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Logistics',
    stage: 'Series A',
    status: 'Raising',
    description: 'On-demand logistics and mobility for people and goods.',
    oneLiner: 'On-demand logistics and mobility for people and goods.',
    raised: '$30M',
    cover: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    initials: 'IS',
    href: '#',
  },
  {
    id: 'zainab-hassan',
    name: 'Zainab Hassan',
    role: 'Co-founder',
    company: 'uLesson',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Edtech',
    stage: 'Series A',
    status: null,
    description: 'Live and recorded lessons for secondary school students across Africa.',
    oneLiner: 'Live and recorded lessons for secondary school students across Africa.',
    raised: '$15M',
    cover: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=800&q=80',
    initials: 'ZH',
    href: '#',
  },
  {
    id: 'pierre-nduati',
    name: 'Pierre Nduati',
    role: 'Founder',
    company: 'Wasoko',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    country: 'Kenya',
    sector: 'Commerce',
    stage: 'Series B',
    status: 'Raising',
    description: 'B2B e-commerce for informal retailers across East Africa.',
    oneLiner: 'B2B e-commerce for informal retailers across East Africa.',
    raised: '$125M',
    cover: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
    initials: 'PN',
    href: '#',
  },
  {
    id: 'lara-van-zyl',
    name: 'Lara van Zyl',
    role: 'Co-founder & COO',
    company: 'Yoco',
    location: 'Cape Town, South Africa',
    city: 'Cape Town',
    country: 'South Africa',
    sector: 'Fintech',
    stage: 'Series B',
    status: null,
    description: 'Point-of-sale and business tools for South African SMEs.',
    oneLiner: 'Point-of-sale and business tools for South African SMEs.',
    raised: '$83M',
    cover: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&q=80',
    initials: 'LV',
    href: '#',
  },
  {
    id: 'emmanuel-adebayo',
    name: 'Emmanuel Adebayo',
    role: 'Founder & CEO',
    company: 'Farmcrowdy',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Agritech',
    stage: 'Seed',
    status: null,
    description: 'Digital agriculture platform connecting farmers with sponsors.',
    oneLiner: 'Digital agriculture platform connecting farmers with sponsors.',
    raised: '$7M',
    cover: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    initials: 'EA',
    href: '#',
  },
  {
    id: 'sara-bellow',
    name: 'Sara Bellow',
    role: 'Co-founder',
    company: 'Andela',
    location: 'Lagos / Remote',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'SaaS / B2B',
    stage: 'Series C+',
    status: null,
    description: 'Connecting African engineering talent with global companies.',
    oneLiner: 'Connecting African engineering talent with global companies.',
    raised: '$381M',
    cover: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
    initials: 'SB',
    href: '#',
  },
  {
    id: 'james-okoth',
    name: 'James Okoth',
    role: 'Founder',
    company: 'Chipper Cash',
    location: 'Kampala, Uganda',
    city: 'Kampala',
    country: 'Uganda',
    sector: 'Fintech',
    stage: 'Series C+',
    status: null,
    description: 'Cross-border payments and financial services for Africa.',
    oneLiner: 'Cross-border payments and financial services for Africa.',
    raised: '$300M+',
    cover: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
    initials: 'JO',
    href: '#',
  },
  {
    id: 'aminata-traore',
    name: 'Aminata Traoré',
    role: 'CEO',
    company: 'Flutterwave',
    location: 'Lagos, Nigeria',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Fintech',
    stage: 'Series C+',
    status: null,
    description: 'Payments infrastructure powering global commerce across Africa.',
    oneLiner: 'Payments infrastructure powering global commerce across Africa.',
    raised: '$477M',
    cover: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    initials: 'AT',
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

export default function FoundersPage() {
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
    return FOUNDERS.filter((f) => {
      if (
        q &&
        !`${f.name} ${f.company} ${f.oneLiner} ${f.location} ${f.sector} ${f.role}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      if (stage !== 'All' && f.stage !== stage) return false;
      if (sector !== 'All' && f.sector !== sector) return false;
      if (city !== 'All' && f.city !== city) return false;
      if (raisingOnly && f.status !== 'Raising') return false;
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
    <div className={`fd ${display.variable}`}>
      <div className="fd-ambient" aria-hidden="true" />

      {/* Nav */}
      <nav className={`fd-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="fd-nav-inner">
          <Link href="/" className="fd-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            BB Africa
          </Link>

          <Link href="/" className="fd-logo" aria-label="Home">
            <Image
              src="https://bbafrica.sbs/wp-content/uploads/2026/04/BBA-Logo-White.svg"
              alt="BB Africa"
              width={32}
              height={32}
              priority
            />
          </Link>

          <Link href="/liststartup" className="fd-cta">
            List startup
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="fd-header">
        <div className="fd-header-top">
          <p className="fd-eyebrow">Directory</p>
          <h1 className="fd-title">Founders</h1>
        </div>
        <p className="fd-lede">
          Meet the operators building Africa’s next wave of companies.
        </p>
      </header>

      {/* Controls */}
      <div className="fd-controls">
        <div className="fd-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search founders or companies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search founders"
          />
          {search && (
            <button type="button" className="fd-search-x" onClick={() => setSearch('')} aria-label="Clear">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="button"
          className={`fd-filter-btn ${filtersOpen ? 'is-open' : ''}`}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M6 12h12M9 18h6" />
          </svg>
          Filters
          {activeFilterCount > 0 && <span className="fd-badge">{activeFilterCount}</span>}
        </button>

        <div className="fd-quick">
          <button
            type="button"
            className={`fd-chip ${raisingOnly ? 'is-on' : ''}`}
            onClick={() => setRaisingOnly((v) => !v)}
          >
            Raising
          </button>
          {['Fintech', 'Commerce', 'Logistics', 'Health'].map((s) => (
            <button
              key={s}
              type="button"
              className={`fd-chip ${sector === s ? 'is-on' : ''}`}
              onClick={() => setSector(sector === s ? 'All' : (s as Sector))}
            >
              {s}
            </button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <button type="button" className="fd-clear" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            className="fd-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="fd-panel-inner">
              <div className="fd-field">
                <span className="fd-label">Company stage</span>
                <div className="fd-options">
                  <button
                    type="button"
                    className={`fd-opt ${stage === 'All' ? 'is-on' : ''}`}
                    onClick={() => setStage('All')}
                  >
                    All
                  </button>
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`fd-opt ${stage === s ? 'is-on' : ''}`}
                      onClick={() => setStage(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="fd-field">
                <span className="fd-label">Sector</span>
                <div className="fd-options">
                  <button
                    type="button"
                    className={`fd-opt ${sector === 'All' ? 'is-on' : ''}`}
                    onClick={() => setSector('All')}
                  >
                    All
                  </button>
                  {SECTORS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`fd-opt ${sector === s ? 'is-on' : ''}`}
                      onClick={() => setSector(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="fd-field">
                <span className="fd-label">City</span>
                <div className="fd-options">
                  <button
                    type="button"
                    className={`fd-opt ${city === 'All' ? 'is-on' : ''}`}
                    onClick={() => setCity('All')}
                  >
                    All
                  </button>
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`fd-opt ${city === c ? 'is-on' : ''}`}
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
      <div className="fd-meta">
        <span>
          {filtered.length} {filtered.length === 1 ? 'founder' : 'founders'}
          {activeFilterCount > 0 && ' · filtered'}
        </span>
      </div>

      {/* Grid */}
      <div className="fd-grid">
        {filtered.length === 0 ? (
          <div className="fd-empty">
            <p>No founders match these filters</p>
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map((f, i) => (
            <a
              key={f.id}
              href={f.href}
              className="fd-card"
              style={{ animationDelay: reduce ? '0ms' : `${i * 35}ms` }}
            >
              <div className="fd-card-media">
                <img src={f.cover} alt="" loading="lazy" />
                <div className="fd-card-veil" />
                {f.status === 'Raising' && <span className="fd-raising">Raising</span>}
              </div>

              <div className="fd-card-body">
                <div className="fd-card-row">
                  <span className="fd-sector">{f.sector}</span>
                  <span className="fd-stage">{f.stage}</span>
                </div>

                <h2 className="fd-name">{f.name}</h2>
                <p className="fd-role">
                  {f.role} · {f.company}
                </p>
                <p className="fd-desc">{f.oneLiner}</p>

                <div className="fd-card-foot">
                  <span className="fd-loc">{f.location}</span>
                  {f.raised && (
                    <>
                      <span className="fd-dot" />
                      <span className="fd-raised">{f.raised}</span>
                    </>
                  )}
                </div>
              </div>

              <span className="fd-glow" aria-hidden="true" />
            </a>
          ))
        )}
      </div>

      <footer className="fd-footer">
        <p>
          © {new Date().getFullYear()} Business Bee Africa
          <span className="fd-sep">·</span>
          <Link href="/">Home</Link>
          <span className="fd-sep">·</span>
          <Link href="/startups">Startups</Link>
          <span className="fd-sep">·</span>
          <Link href="/liststartup">List your startup</Link>
        </p>
      </footer>
    </div>
  );
}
