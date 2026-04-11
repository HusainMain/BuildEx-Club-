import { Link } from 'react-router-dom';
import { AuroraOrbs, PerspectiveGrid } from '../components/VengeanceUI';

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
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

      <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-xl mx-auto glass shadow-neon rounded-2xl glass-border">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">BUILD EX</h1>
        <p className="text-lg md:text-xl text-[var(--color-primary)] mb-6 font-semibold">
          Restricted Access Area
        </p>
        <p className="text-gray-300 mb-10 leading-relaxed max-w-md">
          Authentication required. Please prove your identity to access the event management system and digital hub.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            to="/student/login"
            className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3 px-6 rounded-lg font-medium transition-all duration-300 shadow-neon hover:shadow-lg text-center"
          >
            Student Access
          </Link>
          <Link
            to="/admin/login"
            className="flex-1 bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 py-3 px-6 rounded-lg font-medium transition-all duration-300 text-center"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
