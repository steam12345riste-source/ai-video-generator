import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full py-6 px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl bg-zinc-950/50 border-b border-white/5"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full" />
          <div className="relative p-2 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-white/10 shadow-xl">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-white">
            NanoGen
          </h1>
          <span className="text-[10px] font-medium tracking-widest text-zinc-500 uppercase">
            Creative Studio
          </span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-6">
        <nav className="flex gap-6 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Gallery</a>
          <a href="#" className="hover:text-white transition-colors">History</a>
          <a href="#" className="hover:text-white transition-colors">Settings</a>
        </nav>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
          <span className="text-xs font-medium text-zinc-400">System Online</span>
        </div>
      </div>
    </motion.header>
  );
};
