import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Lightbulb, Crown, Globe, ArrowRight, ChevronDown
} from 'lucide-react';
import { AuroraOrbs, PerspectiveGrid, StarField } from '../components/VengeanceUI';
import './ShowroomLanding.css';

/* ─── Framer Motion fade-up preset ─────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

/* ─── Pillar data ───────────────────────────────────── */
const PILLARS = [
  {
    id: 'innovation',
    variant: 'innovation',
    tag: 'Pillar 01 — Ideation',
    icon: <Lightbulb size={24} />,
    num: '01',
    title: 'Innovation & Problem Solving',
    desc:
      'We don\'t just brainstorm ideas — we stress-test them. Every concept goes through a founder\'s lens: Does it solve a real problem? Can it survive the market? You\'ll learn to validate before you build.',
  },
  {
    id: 'leadership',
    variant: 'leadership',
    tag: 'Pillar 02 — Ownership',
    icon: <Crown size={24} />,
    num: '02',
    title: 'Leadership through Responsibility',
    desc:
      'Business roles aren\'t titles here — they\'re pressure. You\'ll own decisions, manage failures, and lead teams through ambiguity. The classroom teaches theory; we build the muscle.',
  },
  {
    id: 'simulation',
    variant: 'simulation',
    tag: 'Pillar 03 — Execution',
    icon: <Globe size={24} />,
    num: '03',
    title: 'Real-World Simulation',
    desc:
      'P&L sheets. Go-to-market plans. Pitch decks that actually get scrutinised. We run the full business lifecycle inside the club so that when you step into the real world, you\'ve already been there.',
  },
];

export default function ShowroomLanding() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });

  // Parallax: hero content drifts upward as user scrolls
  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  const heroOpac  = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  return (
    <div className="showroom-page" ref={containerRef}>
      {/* ── Global ambient layers ── */}
      <PerspectiveGrid />
      <AuroraOrbs />
      <StarField count={110} />

      {/* SVG Grain filter definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="grainy">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <motion.section
        className="hero-section"
        style={{ y: heroY, opacity: heroOpac }}
        aria-label="BuildEx hero"
      >
        {/* Founders badge */}
        <motion.div
          className="founders-badge"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <span className="founders-badge-dot" />
          SVIT Vasad · Founders Peak
        </motion.div>

        {/* Logo peak */}
        <motion.div
          className="hero-logo-peak"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          <div className="hero-logo-glow" aria-hidden="true" />
          <h1 className="hero-logo-text" aria-label="BuildEx">&lt;BU/LD.EX/&gt;</h1>
          <p className="hero-founders-tag">est. 2024 · SVIT Vasad</p>
        </motion.div>

        {/* Manifesto */}
        <motion.p
          className="hero-manifesto"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          SVIT Vasad's <strong>first startup-focused student club.</strong>{' '}
          Bridging the gap between <strong>classroom learning</strong> and{' '}
          <strong>real-world execution.</strong>
        </motion.p>

        {/* CTA */}
        <motion.div
          className="hero-cta-row"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.32}
        >
          <Link to="/portal" className="btn-protocol" id="enter-protocol-btn">
            Enter Protocol
            <ArrowRight size={18} className="btn-protocol-arrow" />
          </Link>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="hero-scroll-hint"
          style={{ marginTop: 48 }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
        >
          <ChevronDown size={14} style={{ display: 'inline', marginRight: 6 }} />
          Scroll to explore
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════
          DIVIDER
      ══════════════════════════════════════════ */}
      <div className="section-divider" />

      {/* ══════════════════════════════════════════
          THREE PILLARS — Bento Grid
      ══════════════════════════════════════════ */}
      <section className="pillars-section" aria-label="The three pillars of BuildEx">
        <motion.div
          className="pillars-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="pillars-eyebrow">// What we stand for</p>
          <h2 className="pillars-title">
            Built on <span>Three Pillars</span>
          </h2>
        </motion.div>

        <div className="pillars-bento">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.id}
              className={`pillar-card pillar-card--${p.variant}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
            >
              {/* Hover glow blob */}
              <div className="pillar-card-glow" aria-hidden="true" />
              {/* Big decorative number */}
              <span className="pillar-number" aria-hidden="true">{p.num}</span>

              <div className="pillar-icon-wrap" aria-hidden="true">
                {p.icon}
              </div>
              <p className="pillar-tag">{p.tag}</p>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MANIFESTO STRIP
      ══════════════════════════════════════════ */}
      <div className="section-divider" />
      <motion.div
        className="manifesto-strip"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="manifesto-quote">
          &ldquo;The founders of tomorrow aren't waiting to graduate —
          they're <em>building right now,</em> in rooms just like this.&rdquo;
        </p>
        <p className="manifesto-attr">— The BuildEx Manifesto</p>
      </motion.div>
      <div className="section-divider" />

      {/* ══════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════ */}
      <section className="bottom-cta-section" aria-label="Enter the platform">
        <motion.div
          className="bottom-cta-card"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="bottom-cta-title">Ready to run the protocol?</h2>
          <p className="bottom-cta-subtitle">
            Select your role and step into the BuildEx ecosystem.
            Your seat at the table is waiting.
          </p>
          <Link to="/portal" className="btn-protocol" id="bottom-enter-protocol-btn">
            Enter Protocol
            <ArrowRight size={18} className="btn-protocol-arrow" />
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="showroom-footer">
        <span className="footer-logo">&lt;BU/LD.EX/&gt;</span>
        <span>SVIT Vasad · {new Date().getFullYear()} · All systems nominal</span>
      </footer>
    </div>
  );
}
