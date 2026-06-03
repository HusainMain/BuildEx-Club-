import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuroraOrbs, PerspectiveGrid, StarField } from '../components/VengeanceUI';
import './ShowroomLanding.css';

/* ─── Asset paths (Vite serves /public/** at root) ──────── */
const VIDEO_SRC = '/Untitled - June 04, 2026 at 00.15.43-nobg.mp4';
const LOGO_SRC  = '/buildex-logo.png';

/* ─── Pillar data ─────────────────────────────────────────  */
const PILLARS = [
  {
    id: 'textbook',
    num: '01',
    title: 'Beyond the Textbook',
    desc: 'Shifting campus culture away from passive classroom theory and diving directly into aggressive, real-world execution.',
    accent: '#4CD7F6',
    offset: 0,
  },
  {
    id: 'innovation',
    num: '02',
    title: 'Startup & Business Innovation',
    desc: 'Operating as a launchpad and incubator for student entrepreneurship, networking, and strategic business collaboration.',
    accent: '#635BFF',
    offset: 28,
  },
  {
    id: 'mentorship',
    num: '03',
    title: 'Elite Guidance & Mentorship',
    desc: 'Providing the exact technical blueprints, industry mindsets, and leadership skills required to scale solo ideas into powerful business engines.',
    accent: '#A855F7',
    offset: 56,
  },
];

/* ─── Ambient layers — always rendered ───────────────────── */
function AmbientCanvas() {
  return (
    <>
      <PerspectiveGrid />
      <AuroraOrbs />
      <StarField count={130} />
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="sl-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
    </>
  );
}

export default function ShowroomLanding() {
  return (
    <div className="sl-root">
      {/* Ambient depth — rendered regardless of phase */}
      <AmbientCanvas />

      {/* ════════════════════════════════════════════════
          MAIN SITE
      ════════════════════════════════════════════════ */}
      <motion.div
        className="sl-site"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Sticky Header ──────────────────────── */}
        <header className="sl-header" id="top">
          {/* Text-based futuristic logo */}
          <span className="sl-text-logo">BUILDEX</span>
          <nav className="sl-nav" aria-label="Primary navigation">
            <a href="#top"   className="sl-nav-link">Home</a>
            <a href="#about" className="sl-nav-link">About</a>
          </nav>
        </header>

          <main>
            {/* ════════════════════════════════════
                HERO — ASYMMETRIC EDITORIAL LAYOUT
            ════════════════════════════════════ */}
            <section className="sl-hero" aria-labelledby="hero-h1">
              <div className="hero-grid">

                {/* Left: giant manifesto heading */}
                <div className="hero-editorial">
                  <p className="sl-eyebrow">
                    <span className="eyebrow-line" />
                    SVIT Vasad &nbsp;·&nbsp; Est. 2024
                  </p>

                  <h1
                    className="hero-manifesto"
                    id="hero-h1"
                    aria-label="Ideas change minds. Execution changes history."
                  >
                    <span className="manifesto-word hero-word--xl metallic-gradient">IDEAS</span>
                    <span className="manifesto-bridge">CHANGE&nbsp;MINDS.</span>
                    <span className="manifesto-word hero-word--xl hero-word--offset metallic-gradient">EXECUTION</span>
                    <span className="manifesto-bridge hero-bridge--right">CHANGES&nbsp;HISTORY.</span>
                  </h1>
                </div>

                {/* Right: sub-heading + body + CTA */}
                <div className="hero-meta">
                  <div className="hero-meta-inner">
                    <h2 className="sl-hero-sub">
                      Welcome to the first-ever student-driven startup ecosystem at SVIT Vasad.
                    </h2>

                    <div className="hero-body-frame">
                      <p className="sl-hero-body">
                        Almost everyone has envisioned a project or an idea capable of generating
                        massive social impact. But the real question is:{' '}
                        <strong>Can you execute it?</strong> Proper execution requires structured
                        guidance, dedicated mentorship, and a resilient entrepreneurial mindset.{' '}
                        <strong>THE BUILDEX CLUB</strong> exists to bridge that critical gap.
                      </p>
                    </div>

                    <Link to="/portal" className="sl-cta" id="join-ecosystem-btn">
                      <span className="sl-cta-text">Join the Ecosystem</span>
                      <ArrowUpRight size={18} className="sl-cta-icon" aria-hidden="true" />
                      <span className="sl-cta-pulse" aria-hidden="true" />
                    </Link>
                  </div>

                  <p className="hero-coord">22.5726°N / 73.1856°E — Vadodara District</p>
                </div>
              </div>

              <motion.a
                href="#about"
                className="sl-scroll-hint"
                aria-label="Scroll to Blueprint"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
              >
                <span className="hint-bar" />
                <span>scroll</span>
              </motion.a>
            </section>

            {/* ════════════════════════════════════
                BLUEPRINT / ABOUT
            ════════════════════════════════════ */}
            <section id="about" className="sl-blueprint" aria-labelledby="blueprint-h2">

              <div className="blueprint-label-row">
                <span className="sl-section-label">// THE BLUEPRINT</span>
                <span className="section-rule" aria-hidden="true" />
              </div>

              <h2 className="sl-section-title metallic-gradient" id="blueprint-h2">
                Ecosystem<br />Foundations
              </h2>

              <p className="sl-section-sub">
                Every BuildEx initiative maps back to three strategic pillars — each engineered
                to push execution beyond the classroom.
              </p>

              <div className="blueprint-grid">
                {PILLARS.map((p, i) => (
                  <motion.div
                    key={p.id}
                    className="blueprint-card"
                    style={{ '--accent': p.accent, '--card-offset': `${p.offset}px` }}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.18 }}
                  >
                    <div className="bc-glass">
                      <span className="bc-num">{p.num}</span>
                      <div className="bc-accent-bar" aria-hidden="true" />
                      <h3 className="bc-title">{p.title}</h3>
                      <p  className="bc-desc">{p.desc}</p>
                    </div>
                    <div className="bc-glow" aria-hidden="true" />
                  </motion.div>
                ))}
              </div>

              <motion.blockquote
                className="sl-mantra"
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              >
                <div className="mantra-mark left">"</div>
                <p>
                  This isn&rsquo;t about learning business&nbsp;&mdash; this is about{' '}
                  <em>building it.</em>
                </p>
                <div className="mantra-mark right">"</div>
                <div className="mantra-glow" aria-hidden="true" />
              </motion.blockquote>

            </section>
          </main>

          <footer className="sl-footer">
            <span className="sl-footer-logo">BUILDEX</span>
            <span className="sl-footer-copy">
              SVIT Vasad &nbsp;·&nbsp; {new Date().getFullYear()} &nbsp;·&nbsp; All systems nominal
            </span>
          </footer>
        </motion.div>
    </div>
  );
}
