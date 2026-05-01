import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Lightbulb, Crown, Globe, ArrowRight, ChevronDown,
  Rocket, Wrench, Zap, Target
} from 'lucide-react';
import { AuroraOrbs, PerspectiveGrid, StarField } from '../components/VengeanceUI';
import './ShowroomLanding.css';

/* ─── Fade-up variant ───────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: d },
  }),
};

/* ─── Three Pillars ─────────────────────────────────── */
const PILLARS = [
  {
    id: 'innovation',
    variant: 'innovation',
    tag: 'Pillar 01 — Ideation',
    icon: <Lightbulb size={24} />,
    num: '01',
    title: 'Innovation & Problem-Solving',
    desc: 'Validating ideas, encouraging risk, and cultivating a mindset where execution is valued over perfection. Every concept is stress-tested against reality — because the market doesn\'t grade on a curve.',
  },
  {
    id: 'leadership',
    variant: 'leadership',
    tag: 'Pillar 02 — Ownership',
    icon: <Crown size={24} />,
    num: '02',
    title: 'Leadership through Responsibility',
    desc: 'Developing future founders, strategists, and leaders by simulating real-world business roles and responsibilities. Titles are earned under pressure, not handed out in a classroom.',
  },
  {
    id: 'simulation',
    variant: 'simulation',
    tag: 'Pillar 03 — Execution',
    icon: <Globe size={24} />,
    num: '03',
    title: 'Real-World Simulation',
    desc: 'A campus platform that replicates startup environments — pitching, networking, P&L ownership, and go-to-market execution. We run the full business lifecycle so you\'ve already been there when it matters.',
  },
];

/* ─── Lifecycle Steps ───────────────────────────────── */
const LIFECYCLE = [
  {
    id: 'ideation',
    step: '01',
    icon: <Rocket size={20} />,
    title: 'Ideation',
    subtitle: 'Where raw concepts become validated theses',
    desc: 'Every startup begins with a question no one else is asking. We create a supportive ecosystem where students stress-test assumptions, kill bad ideas fast, and sharpen the ones worth building.',
    color: 'rgba(99,91,255,0.8)',
    glow: 'rgba(99,91,255,0.2)',
  },
  {
    id: 'prototyping',
    step: '02',
    icon: <Wrench size={20} />,
    title: 'Prototyping',
    subtitle: 'Theory ends here. Building begins.',
    desc: 'From business model canvases to actual pitch decks, member portfolios, and simulated product sprints — we move from the whiteboard to the boardroom inside one semester.',
    color: 'rgba(76,215,246,0.8)',
    glow: 'rgba(76,215,246,0.18)',
  },
  {
    id: 'impact',
    step: '03',
    icon: <Target size={20} />,
    title: 'Impact',
    subtitle: 'Talent transformed into tangible results',
    desc: 'Real metrics. Real outcomes. Members leave BuildEx with founder instincts, leadership scars, and a network of peers who have already operated under pressure.',
    color: 'rgba(168,85,247,0.8)',
    glow: 'rgba(168,85,247,0.18)',
  },
];

export default function ShowroomLanding() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const heroY    = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const heroOpac = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <div className="showroom-page" ref={containerRef}>
      {/* ── Ambient layers ── */}
      <PerspectiveGrid />
      <AuroraOrbs />
      <StarField count={110} />

      {/* SVG Grain filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="grainy">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <motion.section
        className="hero-section"
        style={{ y: heroY, opacity: heroOpac }}
        aria-label="BuildEx hero"
      >
        <motion.div className="founders-badge" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="founders-badge-dot" />
          SVIT Vasad · Est. 2024
        </motion.div>

        <motion.div className="hero-logo-peak" variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
          <div className="hero-logo-glow" aria-hidden="true" />
          <h1 className="hero-logo-text" aria-label="BuildEx">&lt;BU/LD.EX/&gt;</h1>
          <p className="hero-founders-tag">First Startup-Focused Student Club at SVIT Vasad</p>
        </motion.div>

        <motion.p className="hero-manifesto" variants={fadeUp} initial="hidden" animate="visible" custom={0.22}>
          We believe students should not just <strong>study business models</strong> —
          they should <strong>build them.</strong> The gap between classroom and execution
          ends here.
        </motion.p>

        <motion.div className="hero-cta-row" variants={fadeUp} initial="hidden" animate="visible" custom={0.34}>
          <Link to="/portal" className="btn-protocol" id="start-building-btn">
            Start Building
            <ArrowRight size={18} className="btn-protocol-arrow" />
          </Link>
          <a href="#mission" className="btn-ghost" id="learn-mission-btn">
            Our Mission
          </a>
        </motion.div>

        <motion.div
          className="hero-scroll-hint"
          style={{ marginTop: 48 }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.52}
        >
          <ChevronDown size={14} style={{ display: 'inline', marginRight: 6 }} />
          Scroll to explore
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════
          MISSION STATEMENT BAND
      ══════════════════════════════════════════ */}
      <div className="section-divider" />
      <motion.section
        id="mission"
        className="mission-band"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Mission statement"
      >
        <p className="mission-eyebrow">// The BuildEx Mission</p>
        <blockquote className="mission-statement">
          THE BUILDEX CLUB was founded to{' '}
          <em>bridge the gap between classroom learning and real-world execution.</em>{' '}
          We believe students should not just study business models —{' '}
          <strong>they should build them.</strong>
        </blockquote>
      </motion.section>
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
            Three <span>Strategic Pillars</span>
          </h2>
          <p className="pillars-subtitle">
            Every BuildEx initiative maps back to one of these three foundations.
          </p>
        </motion.div>

        <div className="pillars-bento">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.id}
              className={`pillar-card pillar-card--${p.variant}`}
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
            >
              <div className="pillar-card-glow" aria-hidden="true" />
              <span className="pillar-number" aria-hidden="true">{p.num}</span>
              <div className="pillar-icon-wrap" aria-hidden="true">{p.icon}</div>
              <p className="pillar-tag">{p.tag}</p>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-desc">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════
          THE BUILDEX LIFECYCLE — Vertical Journey
      ══════════════════════════════════════════ */}
      <section className="lifecycle-section" aria-label="The BuildEx Lifecycle">
        <motion.div
          className="lifecycle-header"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="pillars-eyebrow">// How we operate</p>
          <h2 className="pillars-title">
            The BuildEx <span>Lifecycle</span>
          </h2>
          <p className="pillars-subtitle">
            A three-phase journey from raw idea to real-world impact.
          </p>
        </motion.div>

        <div className="lifecycle-track">
          {LIFECYCLE.map((step, i) => (
            <motion.div
              key={step.id}
              className="lifecycle-step"
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
            >
              {/* Connector line (not last) */}
              {i < LIFECYCLE.length - 1 && (
                <div className="lifecycle-connector" style={{ '--step-color': step.color }} />
              )}

              <div className="lifecycle-node" style={{ '--step-color': step.color, '--step-glow': step.glow }}>
                <span className="lifecycle-node-icon" style={{ color: step.color }}>
                  {step.icon}
                </span>
              </div>

              <div className="lifecycle-content">
                <div className="lifecycle-step-label" style={{ color: step.color }}>
                  Step {step.step}
                </div>
                <h3 className="lifecycle-title">{step.title}</h3>
                <p className="lifecycle-subtitle">{step.subtitle}</p>
                <p className="lifecycle-desc">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════
          MANIFESTO STRIP
      ══════════════════════════════════════════ */}
      <motion.div
        className="manifesto-strip"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="manifesto-quote">
          &ldquo;The founders of tomorrow aren&rsquo;t waiting to graduate —
          they&rsquo;re <em>building right now,</em> in rooms just like this.&rdquo;
        </p>
        <p className="manifesto-attr">— The BuildEx Manifesto</p>
      </motion.div>

      <div className="section-divider" />

      {/* ══════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════ */}
      <section className="bottom-cta-section" aria-label="Join the ecosystem">
        <motion.div
          className="bottom-cta-card"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bottom-cta-icon-wrap" aria-hidden="true">
            <Zap size={28} />
          </div>
          <h2 className="bottom-cta-title">Ready to join the ecosystem?</h2>
          <p className="bottom-cta-subtitle">
            Stop studying the playbook. Start writing your own.
            Your seat at the founder&rsquo;s table is waiting.
          </p>
          <div className="bottom-cta-btns">
            <Link to="/portal" className="btn-protocol" id="join-ecosystem-btn">
              Join the Ecosystem
              <ArrowRight size={18} className="btn-protocol-arrow" />
            </Link>
          </div>
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
