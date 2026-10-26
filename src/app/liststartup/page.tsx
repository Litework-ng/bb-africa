'use client';

import Image from 'next/image';
import Link from 'next/link';
import './list.css';

export default function ListStartupPage() {
  return (
    <div className="list-page">
  <div className="list-inner">
        <nav className="list-nav" aria-label="Page navigation">
          <Link href="/" className="list-back">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            <span>Back to BB Africa</span>
          </Link>
          <Link href="/" className="list-brand" aria-label="BB Africa home">
            <Image
              src="https://bbafrica.sbs/wp-content/uploads/2026/04/BBA-Logo-White.svg"
              alt="BB Africa"
              width={40}
              height={40}
              priority
            />
          </Link>
        </nav>

    {/* Header */}
    <header className="list-header">
      <p className="list-eyebrow">Directory</p>
      <h1 className="list-title">List your startup</h1>
      <p className="list-lede">
        Add your company to the BB Africa directory. We review every submission —
        clear, accurate profiles get published first.
      </p>
    </header>

    <form
      className="list-form"
      onSubmit={(e) => {
        e.preventDefault();
        // handle submit
      }}
    >
      {/* —— Company basics —— */}
      <section className="list-section">
        <h2 className="list-section-title">Company</h2>

        <div className="list-row">
          <div className="list-field list-field-grow">
            <label htmlFor="company-name" className="list-label">
              Company name <span className="req">*</span>
            </label>
            <input
              id="company-name"
              name="name"
              type="text"
              required
              placeholder="e.g. Paystack"
              className="list-input"
            />
          </div>
          <div className="list-field">
            <label htmlFor="company-website" className="list-label">
              Website <span className="req">*</span>
            </label>
            <input
              id="company-website"
              name="website"
              type="url"
              required
              placeholder="https://"
              className="list-input"
            />
          </div>
        </div>

        <div className="list-field">
          <label htmlFor="company-tagline" className="list-label">
            One-liner <span className="req">*</span>
          </label>
          <input
            id="company-tagline"
            name="tagline"
            type="text"
            required
            maxLength={120}
            placeholder="Modern payments infrastructure for African businesses."
            className="list-input"
          />
          <p className="list-hint">Max 120 characters. Shows on cards.</p>
        </div>

        <div className="list-field">
          <label htmlFor="company-desc" className="list-label">
            Description <span className="req">*</span>
          </label>
          <textarea
            id="company-desc"
            name="description"
            required
            rows={4}
            placeholder="What you build, who you serve, and why it matters on the continent."
            className="list-textarea"
          />
        </div>

        <div className="list-row">
          <div className="list-field">
            <label htmlFor="company-location" className="list-label">
              HQ location <span className="req">*</span>
            </label>
            <input
              id="company-location"
              name="location"
              type="text"
              required
              placeholder="Lagos, Nigeria"
              className="list-input"
            />
          </div>
          <div className="list-field">
            <label htmlFor="company-founded" className="list-label">
              Founded
            </label>
            <input
              id="company-founded"
              name="founded"
              type="number"
              min={1990}
              max={2030}
              placeholder="2015"
              className="list-input"
            />
          </div>
        </div>
      </section>

      {/* —— Category & stage —— */}
      <section className="list-section">
        <h2 className="list-section-title">Category & stage</h2>

        <div className="list-row">
          <div className="list-field">
            <label htmlFor="company-sector" className="list-label">
              Sector <span className="req">*</span>
            </label>
            <select id="company-sector" name="sector" required className="list-select">
              <option value="">Select sector</option>
              <option value="fintech">Fintech</option>
              <option value="commerce">Commerce</option>
              <option value="health">Health</option>
              <option value="logistics">Logistics</option>
              <option value="agritech">Agritech</option>
              <option value="edtech">Edtech</option>
              <option value="climate">Climate</option>
              <option value="saas">SaaS / B2B</option>
              <option value="media">Media</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="list-field">
            <label htmlFor="company-stage" className="list-label">
              Stage <span className="req">*</span>
            </label>
            <select id="company-stage" name="stage" required className="list-select">
              <option value="">Select stage</option>
              <option value="pre-seed">Pre-seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b">Series B</option>
              <option value="series-c+">Series C+</option>
              <option value="growth">Growth</option>
              <option value="bootstrapped">Bootstrapped</option>
            </select>
          </div>
        </div>

        <div className="list-field">
          <span className="list-label">Status</span>
          <div className="list-chips" role="group" aria-label="Fundraising status">
            <label className="list-chip">
              <input type="radio" name="status" value="raising" />
              <span>Raising</span>
            </label>
            <label className="list-chip">
              <input type="radio" name="status" value="not-raising" defaultChecked />
              <span>Not raising</span>
            </label>
            <label className="list-chip">
              <input type="radio" name="status" value="stealth" />
              <span>Stealth</span>
            </label>
          </div>
        </div>
      </section>

      {/* —— Optional metrics —— */}
      <section className="list-section">
        <h2 className="list-section-title">
          Metrics <span className="list-optional">optional</span>
        </h2>
        <p className="list-section-note">
          Shown on spotlight cards when available (e.g. Raised · Stage).
        </p>

        <div className="list-row">
          <div className="list-field">
            <label htmlFor="metric-raised" className="list-label">
              Total raised
            </label>
            <input
              id="metric-raised"
              name="raised"
              type="text"
              placeholder="$12M"
              className="list-input"
            />
          </div>
          <div className="list-field">
            <label htmlFor="metric-team" className="list-label">
              Team size
            </label>
            <input
              id="metric-team"
              name="teamSize"
              type="text"
              placeholder="25–40"
              className="list-input"
            />
          </div>
        </div>
      </section>

      {/* —— Media —— */}
      <section className="list-section">
        <h2 className="list-section-title">Media</h2>

        <div className="list-row list-row-media">
          <div className="list-field">
            <label className="list-label">
              Logo <span className="req">*</span>
            </label>
            <div className="list-upload">
              <input
                id="company-logo"
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                required
                className="list-file"
              />
              <label htmlFor="company-logo" className="list-upload-box">
                <span className="list-upload-icon">↑</span>
                <span className="list-upload-text">PNG, JPG, SVG or WebP</span>
                <span className="list-upload-sub">Square, min 400×400</span>
              </label>
            </div>
          </div>
          <div className="list-field">
            <label className="list-label">Cover image</label>
            <div className="list-upload">
              <input
                id="company-cover"
                name="cover"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="list-file"
              />
              <label htmlFor="company-cover" className="list-upload-box">
                <span className="list-upload-icon">↑</span>
                <span className="list-upload-text">Landscape preferred</span>
                <span className="list-upload-sub">Min 1200×675</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* —— Contact —— */}
      <section className="list-section">
        <h2 className="list-section-title">Contact</h2>
        <p className="list-section-note">
          Used only for review. Not shown on the public profile unless you choose.
        </p>

        <div className="list-row">
          <div className="list-field">
            <label htmlFor="contact-name" className="list-label">
              Your name <span className="req">*</span>
            </label>
            <input
              id="contact-name"
              name="contactName"
              type="text"
              required
              placeholder="Full name"
              className="list-input"
            />
          </div>
          <div className="list-field">
            <label htmlFor="contact-role" className="list-label">
              Role
            </label>
            <input
              id="contact-role"
              name="contactRole"
              type="text"
              placeholder="Founder / CEO"
              className="list-input"
            />
          </div>
        </div>

        <div className="list-row">
          <div className="list-field list-field-grow">
            <label htmlFor="contact-email" className="list-label">
              Work email <span className="req">*</span>
            </label>
            <input
              id="contact-email"
              name="contactEmail"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
              className="list-input"
            />
          </div>
          <div className="list-field">
            <label htmlFor="contact-twitter" className="list-label">
              X / Twitter
            </label>
            <input
              id="contact-twitter"
              name="twitter"
              type="text"
              placeholder="@handle"
              className="list-input"
            />
          </div>
        </div>
      </section>

      {/* —— Submit —— */}
      <div className="list-footer">
        <p className="list-footer-note">
          By submitting you confirm the information is accurate and you have the right to list this company.
        </p>
        <div className="list-actions">
          <button type="button" className="btn btn-ghost">
            Save draft
          </button>
          <button type="submit" className="btn btn-primary list-submit">
            Submit for review
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
  );
}