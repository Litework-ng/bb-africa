'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Inter_Tight } from 'next/font/google';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './insights.css';

const display = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

/* ------------------------------------------------------------------ */
/* Types & data                                                       */
/* ------------------------------------------------------------------ */

type ResourceType = 'Interview' | 'Podcast' | 'Report' | 'Event' | 'Blog' | 'Press';

interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  excerpt: string;
  meta: string;
  date: string;
  href: string;
  cover: string;
  featured?: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: 'r1',
    type: 'Interview',
    title: 'How Lagos founders close their first institutional round',
    excerpt:
      'Three operators on what changed between their angel cheques and the term sheet that actually closed.',
    meta: '28 min read',
    date: 'Oct 2026',
    href: '#',
    cover:
      'https://images.unsplash.com/photo-1719314073622-9399d167725b?w=800&auto=format&fit=crop&q=60',
    featured: true,
  },
  {
    id: 'r2',
    type: 'Podcast',
    title: 'Cheque size is a signal — not the strategy',
    excerpt: 'A partner at a Dakar-based fund on pace, conviction, and saying no early.',
    meta: 'Ep. 42 · 34 min',
    date: 'Oct 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&q=80',
  },
  {
    id: 'r3',
    type: 'Report',
    title: 'State of African seed · H2 2026',
    excerpt: 'Cheque sizes, sectors, and where capital is actually landing this half.',
    meta: '48 pages',
    date: 'Sep 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
  },
  {
    id: 'r4',
    type: 'Event',
    title: 'BB Africa Capital Night · Nairobi',
    excerpt: 'Founders and investors, one room, no pitch theatre.',
    meta: 'Nov 14 · Nairobi',
    date: 'Upcoming',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&q=80',
  },
  {
    id: 'r5',
    type: 'Blog',
    title: 'Hiring your first ten in a multi-city team',
    excerpt: 'What breaks first when the second office opens — and what to protect.',
    meta: '12 min read',
    date: 'Sep 2026',
    href: '#',
    cover:
      'https://images.unsplash.com/photo-1739298061709-cfc57e6b620e?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'r6',
    type: 'Press',
    title: 'BB Africa in TechCabal: mapping the next wave',
    excerpt: 'Coverage of the directory launch and the operators behind it.',
    meta: 'TechCabal',
    date: 'Aug 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&q=80',
  },
  {
    id: 'r7',
    type: 'Interview',
    title: 'Building distribution in informal retail',
    excerpt: 'Wasoko’s operators on density, trust, and why the last mile is still the product.',
    meta: '22 min read',
    date: 'Sep 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
  },
  {
    id: 'r8',
    type: 'Podcast',
    title: 'Why we still underwrite conviction first',
    excerpt: 'A Series A partner on term sheets, board seats, and walking away from “hot” deals.',
    meta: 'Ep. 41 · 41 min',
    date: 'Sep 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
  },
  {
    id: 'r9',
    type: 'Report',
    title: 'Talent density in African tech · 2026',
    excerpt: 'Where engineering talent is concentrating — and what that means for founders hiring.',
    meta: '32 pages',
    date: 'Aug 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  },
  {
    id: 'r10',
    type: 'Event',
    title: 'African Tech Tour · Cape Town stop',
    excerpt: 'Founders, operators and capital in one afternoon. Limited seats.',
    meta: 'Dec 3 · Cape Town',
    date: 'Upcoming',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  },
  {
    id: 'r11',
    type: 'Blog',
    title: 'What “raising” actually signals in 2026',
    excerpt: 'A short field note on language, process, and how investors read public status.',
    meta: '8 min read',
    date: 'Oct 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
  {
    id: 'r12',
    type: 'Press',
    title: 'How BB Africa is indexing the ecosystem',
    excerpt: 'Profile of the directory and the operators building it.',
    meta: 'TechCrunch',
    date: 'Jul 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1504711434719-2267c5b0b0b0?w=800&q=80',
  },
  {
    id: 'r13',
    type: 'Interview',
    title: 'From seed to Series B without leaving the continent',
    excerpt: 'A founder’s path through local capital, regional expansion, and board composition.',
    meta: '31 min read',
    date: 'Aug 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  },
  {
    id: 'r14',
    type: 'Podcast',
    title: 'Operators only: what we track weekly',
    excerpt: 'Three operators on the metrics that actually move the business.',
    meta: 'Ep. 40 · 29 min',
    date: 'Aug 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
  },
  {
    id: 'r15',
    type: 'Report',
    title: 'Climate tech capital in Africa · map',
    excerpt: 'Where climate dollars are going, and which stages still look underfunded.',
    meta: '36 pages',
    date: 'Jul 2026',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
  },
  {
    id: 'r16',
    type: 'Event',
    title: 'Founder dinner · Lagos',
    excerpt: 'Closed room. No decks. Real conversation.',
    meta: 'Nov 28 · Lagos',
    date: 'Upcoming',
    href: '#',
    cover: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
];

const TYPES: ResourceType[] = [
  'Interview',
  'Podcast',
  'Report',
  'Event',
  'Blog',
  'Press',
];

const TYPE_META: Record<
  ResourceType,
  { label: string; short: string }
> = {
  Interview: { label: 'Interviews', short: 'Interview' },
  Podcast: { label: 'Podcasts', short: 'Podcast' },
  Report: { label: 'Reports', short: 'Report' },
  Event: { label: 'Events', short: 'Event' },
  Blog: { label: 'Blog', short: 'Blog' },
  Press: { label: 'Press', short: 'Press' },
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function InsightsPage() {
  const reduce = useReducedMotion();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<ResourceType | 'All'>('All');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      if (type !== 'All' && r.type !== type) return false;
      if (q && !`${r.title} ${r.excerpt} ${r.type} ${r.meta}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [search, type]);

  const featured = useMemo(() => {
    if (type !== 'All' || search.trim()) return null;
    return RESOURCES.find((r) => r.featured) ?? null;
  }, [type, search]);

  const list = useMemo(() => {
    if (featured) return filtered.filter((r) => r.id !== featured.id);
    return filtered;
  }, [filtered, featured]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: RESOURCES.length };
    TYPES.forEach((t) => {
      map[t] = RESOURCES.filter((r) => r.type === t).length;
    });
    return map;
  }, []);

  const clear = useCallback(() => {
    setType('All');
    setSearch('');
  }, []);

  return (
    <div className={`in ${display.variable}`}>
      <div className="in-ambient" aria-hidden="true" />

      {/* Nav */}
      <nav className={`in-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="in-nav-inner">
          <Link href="/" className="in-back">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            BB Africa
          </Link>

          <Link href="/" className="in-logo" aria-label="Home">
            <Image
              src="https://bbafrica.sbs/wp-content/uploads/2026/04/BBA-Logo-White.svg"
              alt="BB Africa"
              width={32}
              height={32}
              priority
            />
          </Link>

          <Link href="/liststartup" className="in-cta">
            List startup
          </Link>
        </div>
      </nav>

      {/* Header */}
      <header className="in-header">
        <div className="in-header-top">
          <p className="in-eyebrow">Resource centre</p>
          <h1 className="in-title">Insights</h1>
        </div>
        <p className="in-lede">
          Interviews, reports, sessions and field notes — the reading and listening
          that keep founders and investors sharp.
        </p>
      </header>

      {/* Category rail + search */}
      <div className="in-controls">
        <div className="in-cats" role="tablist" aria-label="Resource type">
          <button
            type="button"
            role="tab"
            aria-selected={type === 'All'}
            className={`in-cat ${type === 'All' ? 'is-on' : ''}`}
            onClick={() => setType('All')}
          >
            All
            <span className="in-cat-n">{counts.All}</span>
          </button>
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={type === t}
              className={`in-cat ${type === t ? 'is-on' : ''}`}
              onClick={() => setType(t)}
            >
              {TYPE_META[t].label}
              <span className="in-cat-n">{counts[t]}</span>
            </button>
          ))}
        </div>

        <div className="in-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search insights…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search insights"
          />
          {search && (
            <button type="button" className="in-search-x" onClick={() => setSearch('')} aria-label="Clear">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="in-meta">
        <span>
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          {type !== 'All' && ` · ${TYPE_META[type].label}`}
          {search.trim() && ' · search'}
        </span>
        {(type !== 'All' || search.trim()) && (
          <button type="button" className="in-clear" onClick={clear}>
            Clear
          </button>
        )}
      </div>

      {/* Stage */}
      <div className="in-stage">
        {filtered.length === 0 ? (
          <div className="in-empty">
            <p>No insights match</p>
            <button type="button" onClick={clear}>
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured lead (only on All, no search) */}
            {featured && (
              <a href={featured.href} className="in-lead">
                <div className="in-lead-media">
                  <img src={featured.cover} alt="" />
                  <div className="in-lead-veil" />
                  <span className="in-type in-type-on">{featured.type}</span>
                </div>
                <div className="in-lead-body">
                  <div className="in-lead-meta">
                    <span className="in-meta-text">{featured.meta}</span>
                    <span className="in-dot" />
                    <span className="in-meta-text">{featured.date}</span>
                  </div>
                  <h2 className="in-lead-title">{featured.title}</h2>
                  <p className="in-lead-excerpt">{featured.excerpt}</p>
                  <span className="in-lead-cta">
                    Read story
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </a>
            )}

            {/* Grid */}
            <div className="in-grid">
              {list.map((r, i) => (
                <a
                  key={r.id}
                  href={r.href}
                  className="in-card"
                  style={{ animationDelay: reduce ? '0ms' : `${i * 30}ms` }}
                >
                  <div className="in-card-media">
                    <img src={r.cover} alt="" loading="lazy" />
                    <div className="in-card-veil" />
                    <span className="in-type in-type-on">{r.type}</span>
                  </div>
                  <div className="in-card-body">
                    <div className="in-card-meta">
                      <span>{r.meta}</span>
                      <span className="in-dot" />
                      <span>{r.date}</span>
                    </div>
                    <h3 className="in-card-title">{r.title}</h3>
                    <p className="in-card-excerpt">{r.excerpt}</p>
                  </div>
                  <span className="in-glow" aria-hidden="true" />
                </a>
              ))}
            </div>
          </>
        )}
      </div>

      <footer className="in-footer">
        <p>
          © {new Date().getFullYear()} Business Bee Africa
          <span className="in-sep">·</span>
          <Link href="/">Home</Link>
          <span className="in-sep">·</span>
          <Link href="/startups">Startups</Link>
          <span className="in-sep">·</span>
          <Link href="/founders">Founders</Link>
          <span className="in-sep">·</span>
          <Link href="/investors">Investors</Link>
        </p>
      </footer>
    </div>
  );
}
