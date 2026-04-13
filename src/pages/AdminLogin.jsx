import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuroraOrbs, PerspectiveGrid } from "../components/VengeanceUI";
import { Zap } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Auth Error Details:", error);
      alert("Error logging in: " + error.message);
    } else {
      navigate("/admin/dashboard");
    }
  };

  const inputCls = "w-full bg-zinc-900/90 border border-purple-500/20 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors placeholder-gray-600";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black">
      <PerspectiveGrid />
      <AuroraOrbs />

      <div className="relative z-10 w-full max-w-md">
        <div className="relative flex flex-col items-center p-8 sm:p-10 glass shadow-neon rounded-3xl glass-border overflow-hidden">

          {/* SVG Grain */}
          <div className="absolute inset-0 opacity-[0.35] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }} />

          {/* Pulsing Logo */}
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-purple-900/40 blur-3xl rounded-full scale-150" />
            <motion.div
              animate={{ boxShadow: ['0 0 20px #635BFF', '0 0 40px #635BFF88', '0 0 20px #635BFF'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-14 h-14 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center"
            >
              <Zap size={28} className="text-white" fill="currentColor" />
            </motion.div>
          </div>

          <h1 className="relative z-10 text-3xl sm:text-4xl font-black text-white/90 tracking-tighter mb-2 text-center">
            &lt;BU/LD.EX/&gt;
          </h1>

          <div className="relative z-10 flex items-center gap-2 mb-8 bg-red-900/20 px-3 py-1.5 rounded-full border border-red-500/20">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className="text-red-400 font-mono text-[11px] uppercase tracking-widest font-bold">Admin Access</span>
          </div>

          <form onSubmit={handleLogin} className="relative z-10 w-full flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="admin@buildex.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.96, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              type="submit"
              className="w-full mt-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3.5 px-4 rounded-xl font-bold transition-colors shadow-neon"
            >
              Authenticate
            </motion.button>
          </form>

          <button
            onClick={() => window.location.replace("/role-selection")}
            className="relative z-10 mt-5 text-sm text-gray-500 hover:text-white transition-colors font-medium"
          >
            ← Return to restricted area
          </button>
        </div>
      </div>
    </div>
  );
}
