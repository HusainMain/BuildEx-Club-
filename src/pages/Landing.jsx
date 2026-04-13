import { Link } from 'react-router-dom';
import { AuroraOrbs, PerspectiveGrid } from '../components/VengeanceUI';
import { Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black">
      <PerspectiveGrid />
      <AuroraOrbs />
      
      {/* Autoplaying Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-auto min-w-full min-h-full max-w-none opacity-30 object-cover z-0"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-screen-with-moving-lines-and-dots-31558-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to ensure readability and Tech-Noir aesthetic */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-base)]/50 to-[var(--color-surface-base)] z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md px-6 mx-auto">
        <div className="relative flex flex-col items-center text-center p-8 sm:p-10 glass shadow-neon rounded-3xl glass-border overflow-hidden">
          
          {/* Frosted SVG Noise Overlay */}
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

          {/* Logo Orb */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-purple-900/40 blur-3xl rounded-full scale-150" />
            <div className="relative w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-[0_0_30px_var(--color-primary)]">
               <Zap size={32} className="text-white" fill="currentColor" />
            </div>
          </div>

          <h1 className="relative z-10 text-4xl sm:text-5xl font-black text-white/90 tracking-tighter mb-3">
            &lt;BU/LD.EX/&gt;
          </h1>
          
          <div className="relative z-10 flex items-center gap-2 mb-6 bg-purple-900/20 px-3 py-1.5 rounded-full border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
               <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
             </span>
             <span className="text-purple-400 font-mono text-[11px] uppercase tracking-widest font-bold">System Online</span>
          </div>

          <p className="relative z-10 text-gray-400 mb-10 leading-relaxed max-w-sm text-sm sm:text-base font-medium">
            Identify to enter the club management hub.
          </p>
          
          <div className="relative z-10 flex flex-col gap-3 w-full">
            <Link
              to="/student/login"
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-300 shadow-neon hover:shadow-lg text-center"
            >
              Student Access
            </Link>
            <Link
              to="/admin/login"
              className="w-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white py-3.5 px-6 rounded-xl font-bold transition-all duration-300 text-center backdrop-blur-md"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
