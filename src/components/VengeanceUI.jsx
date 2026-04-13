import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════╗
   AURORA ORBS
   Fixed ambient glow orbs — Cyan (top-left) + Violet (bottom-right)
╚══════════════════════════════════════════════════════ */
export function AuroraOrbs({ scannerActive = false }) {
  const cyanTarget = scannerActive
    ? { scale: 1.4, background: 'radial-gradient(circle, rgba(99,91,255,0.35) 0%, rgba(124,58,237,0.15) 50%, transparent 70%)' }
    : { scale: 1.2 };
  const violetTarget = scannerActive
    ? { scale: 1.5, background: 'radial-gradient(circle, rgba(124,58,237,0.4) 0%, rgba(99,91,255,0.18) 50%, transparent 70%)' }
    : { scale: 1.2 };
  const scannerTransition = { duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' };

  return (
    <>
      <motion.div 
        className="aurora-orb-cyan" 
        aria-hidden="true" 
        animate={cyanTarget}
        transition={scannerActive ? scannerTransition : { duration: 0.6 }}
        whileTap={{ scale: 1.4, filter: 'brightness(1.5)' }}
      />
      <motion.div 
        className="aurora-orb-violet" 
        aria-hidden="true" 
        animate={violetTarget}
        transition={scannerActive ? { ...scannerTransition, duration: 2.2 } : { duration: 0.6 }}
        whileTap={{ scale: 1.4, filter: 'brightness(1.5)' }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════╗
   MAGNETIC WRAPPER
   Applies a subtle mouse-tracking pull on primary buttons
╚══════════════════════════════════════════════════════ */
export function MagneticWrapper({ children, strength = 12, className = '' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.max(rect.width, rect.height);
    const factor = Math.max(0, 1 - dist / maxDist);
    setPos({ x: dx * factor * (strength / 10), y: dy * factor * (strength / 10) });
  };

  const handleMouseLeave = () => {
    setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
      className={className}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════╗
   PERSPECTIVE GRID
   Drop this inside any page's root div as a sibling
╚══════════════════════════════════════════════════════ */
export function PerspectiveGrid() {
  return <div className="perspective-grid" aria-hidden="true" />;
}

/* ═══════════════════════════════════════════════════════╗
   BORDER BEAM CARD WRAPPER
   Wraps a card child with the animated conic border beam
╚══════════════════════════════════════════════════════ */
export function BorderBeamCard({ children, variant = 'cyan', className = '' }) {
  return (
    <div className={`border-beam-card border-beam-${variant} ${className}`}>
      {children}
    </div>
  );
}
