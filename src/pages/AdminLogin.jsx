import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuroraOrbs } from '../components/VengeanceUI';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Auth Error Details:", error);
      console.log("Auth Error Message:", error.message);
      alert("Error logging in: " + error.message);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <AuroraOrbs />
      <div className="glass shadow-neon rounded-2xl glass-border p-8 max-w-md w-full flex flex-col items-center hover:border-[var(--color-primary)]/50 transition-colors">
        <h2 className="text-3xl font-bold mb-2">Admin Portal</h2>
        <p className="text-gray-400 mb-8 text-center">Authorized personnel only.</p>
        
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-surface-highest)] border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder="admin@buildex.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--color-surface-highest)] border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <motion.button
            whileTap={{ scale: 0.92, transition: { type: "spring", stiffness: 400, damping: 10 } }}
            type="submit"
            className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-3 px-4 rounded-lg font-medium transition-colors shadow-neon"
          >
            Authenticate
          </motion.button>
        </form>
        <button onClick={() => window.history.back()} className="mt-6 text-sm text-gray-500 hover:text-white transition-colors">
          Return to restricted area
        </button>
      </div>
    </div>
  );
}
