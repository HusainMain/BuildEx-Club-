import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './ShowroomLanding.css';

export default function ShowroomLanding() {
  const [introState, setIntroState] = useState('pending'); // pending, playing, fading, finished

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem('hasPlayedCinematicIntro');
    
    if (hasPlayed) {
      setIntroState('finished');
    } else {
      setIntroState('playing');
      sessionStorage.setItem('hasPlayedCinematicIntro', 'true');
      
      // Wait exactly 2 seconds for text to resolve
      const fadeTimer = setTimeout(() => {
        setIntroState('fading');
        
        // 700ms cubic-bezier transition duration
        const finishTimer = setTimeout(() => {
          setIntroState('finished');
        }, 700);
        
        return () => clearTimeout(finishTimer);
      }, 2000);
      
      return () => clearTimeout(fadeTimer);
    }
  }, []);

  return (
    <div className={`showroom-wrapper ${introState}`}>
      
      {/* Intro Background Overlay */}
      {(introState === 'playing' || introState === 'fading') && (
        <div className={`intro-overlay ${introState === 'fading' ? 'fade-out' : ''}`} />
      )}

      {/* Video Logo (Animated) */}
      <div className={`brand-video-container ${introState}`}>
        <video 
          className="brand-video"
          src="/Untitled - June 04, 2026 at 00.15.43.mp4"
          autoPlay 
          muted 
          loop 
          playsInline
        />
      </div>

      {/* Main Content (Revealed after intro) */}
      <div className={`main-content ${introState === 'finished' || introState === 'fading' ? 'reveal' : ''}`}>
        
        {/* Header Navigation */}
        <header className="showroom-header">
          <div className="header-logo-spacer" />
          <nav className="header-nav">
            <a href="#top" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
          </nav>
        </header>

        <main id="top">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title metallic-text">
                IDEAS CHANGE MINDS.<br/>EXECUTION CHANGES HISTORY.
              </h1>
              <h2 className="hero-subtitle">
                Welcome to the first-ever student-driven startup ecosystem at SVIT Vasad.
              </h2>
              <p className="hero-desc">
                Almost everyone has envisioned a project or an idea capable of generating a massive social impact. But the real question is: Can you execute it? The reality is that only a select few succeed because proper execution requires structured guidance, dedicated mentorship, and a resilient entrepreneurial mindset. THE BUILDEX CLUB exists to bridge that critical gap.
              </p>
              
              <div className="hero-cta">
                <Link to="/portal" className="btn-primary">
                  Join the Ecosystem
                  <ArrowRight size={20} className="btn-icon" />
                </Link>
              </div>
            </div>
          </section>

          {/* The Blueprint Section */}
          <section id="about" className="blueprint-section">
            <div className="blueprint-header">
              <h3 className="section-label">// THE BLUEPRINT</h3>
              <h2 className="section-title metallic-text">Ecosystem Foundations</h2>
            </div>

            <div className="blueprint-grid">
              <div className="blueprint-card glass-card">
                <span className="pillar-num">01</span>
                <h3 className="pillar-title">Beyond the Textbook</h3>
                <p className="pillar-desc">
                  Shifting campus culture away from passive classroom theory and diving directly into aggressive, real-world execution.
                </p>
              </div>

              <div className="blueprint-card glass-card">
                <span className="pillar-num">02</span>
                <h3 className="pillar-title">Startup & Business Innovation</h3>
                <p className="pillar-desc">
                  Operating as a launchpad and incubator for student entrepreneurship, networking, and strategic business collaboration.
                </p>
              </div>

              <div className="blueprint-card glass-card">
                <span className="pillar-num">03</span>
                <h3 className="pillar-title">Elite Guidance & Mentorship</h3>
                <p className="pillar-desc">
                  Providing the exact technical blueprints, industry mindsets, and leadership skills required to scale solo ideas into powerful business engines.
                </p>
              </div>
            </div>

            <blockquote className="core-mantra glass-card">
              "This isn’t about learning business – this is about building it."
            </blockquote>
          </section>
        </main>
        
        <footer className="showroom-footer">
          <span>&lt;BU/LD.EX/&gt; · SVIT Vasad · {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}
