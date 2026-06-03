import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { AuroraOrbs, PerspectiveGrid, StarField } from '../components/VengeanceUI';
import './ShowroomLanding.css';

/* ─── Pillar data ─────────────────────────────────────── */
const PILLARS = [
  {
    id: 'textbook',
    num: '01',
    title: 'Beyond the Textbook',
    desc: 'Shifting campus culture away from passive classroom theory and diving directly into aggressive, real-world execution.',
    accent: '#4CD7F6',
  },
  {
    id: 'innovation',
    num: '02',
    title: 'Startup & Business Innovation',
    desc: 'Operating as a launchpad and incubator for student entrepreneurship, networking, and strategic business collaboration.',
    accent: '#635BFF',
  },
  {
    id: 'mentorship',
    num: '03',
    title: 'Elite Guidance & Mentorship',
    desc: 'Providing the exact technical blueprints, industry mindsets, and leadership skills required to scale solo ideas into powerful business engines.',
    accent: '#A855F7',
  },
];

/* ─── Video duration helper (ms) ────────────────────────
   We listen to the video's "ended" event so the wait time
   is always the actual video length, not a hard-coded value.
   As a safety net the 2 s fallback fires if metadata fails.
─────────────────────────────────────────────────────────── */
const FALLBACK_WAIT_MS = 2000; // 2 s fallback

export default function ShowroomLanding() {
  // 'pending' → 'playing' → 'fading' → 'finished'
  const [introState, setIntroState] = useState('pending');
  const videoRef = useRef(null);
  const fallbackRef = useRef(null);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('hasPlayedCinematicIntro');

    if (hasPlayed) {
      setIntroState('finished');
      return;
    }

    // Mark as played immediately so navigation doesn't re-trigger
    sessionStorage.setItem('hasPlayedCinematicIntro', 'true');
    setIntroState('playing');

    const startFade = () => {
      if (fallbackRef.current) clearTimeout(fallbackRef.current);
      setIntroState('fading');
      setTimeout(() => setIntroState('finished'), 800); // matches CSS transition
    };

    // Primary: fire when video naturally ends
    const vid = videoRef.current;
    if (vid) {
      vid.addEventListener('ended', startFade, { once: true });
      // Fallback: if the video loops / never fires "ended", use metadata length
      vid.addEventListener('loadedmetadata', () => {
        const durationMs = vid.duration * 1000 || FALLBACK_WAIT_MS;
        fallbackRef.current = setTimeout(startFade, durationMs + 200);
      }, { once: true });
      // Second fallback: if metadata never loads
      fallbackRef.current = setTimeout(startFade, FALLBACK_WAIT_MS + 5000);
    }

    return () => {
      if (vid) vid.removeEventListener('ended', startFade);
      if (fallbackRef.current) clearTimeout(fallbackRef.current);
    };
  }, []);

  const introActive = introState === 'playing' || introState === 'fading';
  const contentReady = introState === 'finished' || introState === 'fading';

  return (
    <div className="showroom-wrapper">

      {/* ── Always-present ambient depth layers ── */}
      <PerspectiveGrid />
      <AuroraOrbs />
      <StarField count={130} />

      {/* SVG Grain filter ── keeps texture consistent with the rest of the site */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="sl-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* ════════════════════════════════════════════
          PHASE 1 — CINEMATIC INTRO OVERLAY
      ════════════════════════════════════════════ */}
      <div className={`intro-overlay ${introActive ? 'is-active' : ''} ${introState === 'fading' ? 'is-fading' : ''}`} aria-hidden="true" />

      {/* Centered video container — fades OUT in place */}
      <div className={`intro-video-wrap ${introActive ? 'is-visible' : ''} ${introState === 'fading' ? 'is-fading' : ''}`}>
        <video
          ref={videoRef}
          className="intro-video"
          src="/Untitled - June 04, 2026 at 00.15.43.mp4"
          autoPlay
          muted
          playsInline
          /* Remove "loop" so the "ended" event fires naturally */
        />
      </div>

      {/* ════════════════════════════════════════════
          PHASE 2 & 3 — MAIN CONTENT
      ════════════════════════════════════════════ */}
      <div className={`showroom-content ${contentReady ? 'is-revealed' : ''}`}>

        {/* ── Header ── */}
        <header className="sl-header" id="top">
          <div className="sl-logo" aria-label="BuildEx">
            &lt;BU/LD.EX/&gt;
          </div>
          <nav className="sl-nav" aria-label="Primary navigation">
            <a href="#top" className="sl-nav-link">Home</a>
            <a href="#about" className="sl-nav-link">About</a>
          </nav>
        </header>

        <main>

          {/* ════════════════════════════
              HERO SECTION
          ════════════════════════════ */}
          <section className="sl-hero" aria-labelledby="hero-heading">

            <p className="sl-eyebrow">SVIT Vasad &nbsp;·&nbsp; Est. 2024</p>

            <h1 className="sl-hero-title metallic-gradient" id="hero-heading">
              Ideas Change Minds.<br className="hero-br" />
              Execution Changes History.
            </h1>

            <h2 className="sl-hero-sub">
              Welcome to the first-ever student-driven startup ecosystem at SVIT Vasad.
            </h2>

            <p className="sl-hero-body">
              Almost everyone has envisioned a project or an idea capable of generating a massive
              social impact. But the real question is: <strong>Can you execute it?</strong> The reality
              is that only a select few succeed because proper execution requires structured guidance,
              dedicated mentorship, and a resilient entrepreneurial mindset.{' '}
              <strong>THE BUILDEX CLUB</strong> exists to bridge that critical gap.
            </p>

            <div className="sl-hero-cta-row">
              <Link to="/portal" className="sl-btn-primary" id="join-ecosystem-btn">
                Join the Ecosystem
                <ArrowRight size={18} className="sl-btn-arrow" />
              </Link>
            </div>

            <a href="#about" className="sl-scroll-hint" aria-label="Scroll down to learn more">
              <ChevronDown size={16} />
              Scroll to explore
            </a>
          </section>

          {/* ════════════════════════════
              BLUEPRINT / ABOUT SECTION
          ════════════════════════════ */}
          <section id="about" className="sl-blueprint" aria-labelledby="blueprint-heading">

            <div className="sl-section-label">// THE BLUEPRINT</div>
            <h2 className="sl-section-title metallic-gradient" id="blueprint-heading">
              Ecosystem Foundations
            </h2>
            <p className="sl-section-sub">
              Every BuildEx initiative maps back to one of three strategic pillars — each designed
              to push execution further than the classroom ever could.
            </p>

            <div className="blueprint-grid">
              {PILLARS.map((p) => (
                <div
                  key={p.id}
                  className="blueprint-card"
                  style={{ '--accent': p.accent }}
                >
                  <div className="bc-inner">
                    <span className="bc-num">{p.num}</span>
                    <div className="bc-accent-line" />
                    <h3 className="bc-title">{p.title}</h3>
                    <p className="bc-desc">{p.desc}</p>
                  </div>
                  <div className="bc-glow" aria-hidden="true" />
                </div>
              ))}
            </div>

            {/* Core Mantra blockquote */}
            <blockquote className="sl-mantra">
              <div className="mantra-marks">"</div>
              <p>This isn&rsquo;t about learning business&nbsp;&mdash; this is about building it.</p>
              <div className="mantra-marks right">"</div>
            </blockquote>

          </section>

        </main>

        {/* ── Footer ── */}
        <footer className="sl-footer">
          <span className="sl-footer-logo">&lt;BU/LD.EX/&gt;</span>
          <span className="sl-footer-copy">SVIT Vasad &nbsp;·&nbsp; {new Date().getFullYear()} &nbsp;·&nbsp; All systems nominal</span>
        </footer>

      </div>
    </div>
  );
}
