import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center pointer-events-none"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="flex items-center gap-2 mb-4"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
          style={{
            background: "rgba(76,215,246,0.15)",
            border: "2px solid rgba(76,215,246,0.5)",
          }}
        >
          <Zap size={28} style={{ color: "var(--color-cyan)" }} />
        </div>
      </motion.div>
      <h2 className="text-2xl font-bold tracking-widest text-white uppercase flex items-center gap-2">
        <span className="text-[var(--color-primary)]">Build</span> Ex
      </h2>
      <div className="mt-8 flex gap-2">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
          className="w-2 h-2 rounded-full bg-[var(--color-cyan)]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-white"
        />
      </div>
    </motion.div>
  );
}
