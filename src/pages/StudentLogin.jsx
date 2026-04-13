import { supabase } from "../lib/supabase";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AuroraOrbs, PerspectiveGrid } from "../components/VengeanceUI";

export default function StudentLogin() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/student/dashboard`,
      },
    });
    if (error) console.error("Error logging in:", error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black">
      <PerspectiveGrid />
      <AuroraOrbs />

      <div className="relative z-10 w-full max-w-md">
        <div className="relative flex flex-col items-center text-center p-8 sm:p-10 glass shadow-neon rounded-3xl glass-border overflow-hidden">

          {/* SVG Grain */}
          <div className="absolute inset-0 opacity-[0.35] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }} />

          {/* Pulsing Logo */}
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-purple-900/40 blur-3xl rounded-full scale-150" />
            <motion.div
              animate={{ boxShadow: ['0 0 20px #635BFF', '0 0 40px #635BFF', '0 0 20px #635BFF'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center"
            >
              <Zap size={28} className="text-white" fill="currentColor" />
            </motion.div>
          </div>

          <h1 className="relative z-10 text-3xl sm:text-4xl font-black text-white/90 tracking-tighter mb-2">
            &lt;BU/LD.EX/&gt;
          </h1>

          <div className="relative z-10 flex items-center gap-2 mb-6 bg-purple-900/20 px-3 py-1.5 rounded-full border border-purple-500/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-purple-400 font-mono text-[11px] uppercase tracking-widest font-bold">Student Portal</span>
          </div>

          <p className="relative z-10 text-gray-400 mb-8 text-sm leading-relaxed">
            Sign in with your university Google account to access the hub.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="relative z-10 w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 px-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => window.location.replace("/role-selection")}
            className="relative z-10 mt-5 text-sm text-gray-500 hover:text-[var(--color-primary)] transition-colors font-medium"
          >
            ← Return to hub
          </button>
        </div>
      </div>
    </div>
  );
}
