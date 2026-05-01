import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuroraOrbs, PerspectiveGrid } from '../components/VengeanceUI';
import { Zap, ArrowLeft } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: d },
  }),
};

export default function PortalEntry() {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(circle at 50% 30%, rgba(99,91,255,0.08) 0%, #0A0A0A 65%)' }}
    >
      <PerspectiveGrid />
      <AuroraOrbs />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          opacity: 0.25,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Back to showroom */}
      <motion.div
        className="absolute top-6 left-6 z-20"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white/80 transition-colors"
          id="back-to-showroom-link"
        >
          <ArrowLeft size={15} />
          Showroom
        </Link>
      </motion.div>

      <div className="relative z-10 w-full max-w-sm px-6 mx-auto">
        <motion.div
          className="relative flex flex-col items-center text-center p-8 sm:p-10 glass shadow-neon rounded-3xl glass-border overflow-hidden"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.05}
        >
          {/* Frosted SVG Noise Overlay */}
          <div
            className="absolute inset-0 opacity-[0.35] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            }}
          />

          {/* Logo Orb */}
          <motion.div
            className="relative mb-6"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            <div className="absolute inset-0 bg-purple-900/40 blur-3xl rounded-full scale-150" />
            <div className="relative w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-[0_0_30px_var(--color-primary)]">
              <Zap size={32} className="text-white" fill="currentColor" />
            </div>
          </motion.div>

          <motion.h1
            className="relative z-10 text-4xl sm:text-5xl font-black text-white/90 tracking-tighter mb-2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.15}
          >
            &lt;BU/LD.EX/&gt;
          </motion.h1>

          <motion.p
            className="relative z-10 text-[0.65rem] font-mono font-bold uppercase tracking-[0.2em] text-purple-400/50 mb-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.18}
          >
            Protocol Entry
          </motion.p>

          {/* Status pill */}
          <motion.div
            className="relative z-10 flex items-center gap-2 mb-7 bg-purple-900/20 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.22}
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-purple-400 font-mono text-[11px] uppercase tracking-widest font-bold">
              System Online
            </span>
          </motion.div>

          <motion.p
            className="relative z-10 text-gray-400 mb-9 leading-relaxed text-sm font-medium"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.27}
          >
            Identify to enter the club management hub.
          </motion.p>

          {/* Role buttons */}
          <motion.div
            className="relative z-10 flex flex-col gap-3 w-full"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.33}
          >
            <Link
              to="/student/login"
              id="student-access-btn"
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-300 shadow-neon hover:shadow-lg text-center text-sm"
            >
              Student Access
            </Link>
            <Link
              to="/admin/login"
              id="admin-portal-btn"
              className="w-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-300 text-center backdrop-blur-md text-sm"
            >
              Admin Portal
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
