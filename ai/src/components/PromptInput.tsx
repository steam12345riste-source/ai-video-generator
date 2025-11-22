import React, { useState } from 'react';
import { Wand2, Loader2, Image as ImageIcon, Video, Sparkles, Clock, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PromptInputProps {
  onGenerate: (prompt: string, mode: 'image' | 'video', duration?: string, withAudio?: boolean, aspectRatio?: string) => void;
  isGenerating: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isGenerating }) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [duration, setDuration] = useState<string>('4');
  const [withAudio, setWithAudio] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(
        prompt, 
        mode, 
        mode === 'video' ? duration : undefined, 
        mode === 'video' ? withAudio : undefined,
        mode === 'video' ? aspectRatio : undefined
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
        {/* Mode Toggle */}
        <div className="p-1 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 flex gap-1 shadow-lg shadow-black/20">
          {(['image', 'video'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                mode === m ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode === m && (
                <motion.div
                  layoutId="activeMode"
                  className="absolute inset-0 bg-white rounded-full shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {m === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Video Controls */}
        <AnimatePresence mode="popLayout">
          {mode === 'video' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: -20 }}
              className="flex gap-4 flex-wrap justify-center"
            >
              {/* Duration Selector */}
              <div className="p-1 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 flex gap-1 shadow-lg shadow-black/20">
                {['4', '8', '12'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 ${
                      duration === d ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {duration === d && (
                      <motion.div
                        layoutId="activeDuration"
                        className="absolute inset-0 bg-amber-400 rounded-full shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {d}s
                    </span>
                  </button>
                ))}
              </div>

              {/* Aspect Ratio Selector */}
              <div className="p-1 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 flex gap-1 shadow-lg shadow-black/20">
                {[
                  { id: '16:9', icon: Monitor, label: 'Landscape' },
                  { id: '9:16', icon: Smartphone, label: 'Portrait' }
                ].map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => setAspectRatio(ratio.id as any)}
                    className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      aspectRatio === ratio.id ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {aspectRatio === ratio.id && (
                      <motion.div
                        layoutId="activeRatio"
                        className="absolute inset-0 bg-amber-400 rounded-full shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <ratio.icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{ratio.label}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Audio Toggle */}
              <button
                type="button"
                onClick={() => setWithAudio(!withAudio)}
                className={`p-1 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/5 flex gap-1 shadow-lg shadow-black/20 px-4 py-2.5 items-center transition-all duration-300 ${
                  withAudio ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {withAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="relative group"
        initial={false}
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-orange-600/30 rounded-2xl blur-xl opacity-0 transition duration-500 ${isFocused ? 'opacity-100' : 'group-hover:opacity-50'}`} />
        
        <div className={`relative flex flex-col md:flex-row items-stretch bg-zinc-900/90 backdrop-blur-xl rounded-2xl border transition-colors duration-300 shadow-2xl ${isFocused ? 'border-white/20' : 'border-white/10'}`}>
          <div className="flex-1 relative">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={`Describe the ${mode} you want to create...`}
              className="w-full h-full bg-transparent text-white placeholder-zinc-500 pl-14 pr-6 py-6 outline-none text-lg font-light"
              disabled={isGenerating}
            />
          </div>
          
          <div className="p-2">
            <button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="w-full md:w-auto h-full px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.form>

      {/* Helper Text */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-zinc-500 text-sm"
      >
        Try: <span className="text-zinc-300 cursor-pointer hover:text-amber-400 transition-colors" onClick={() => setPrompt("A futuristic city with flying cars at sunset, cyberpunk style")}>"A futuristic city with flying cars at sunset..."</span>
      </motion.p>
    </div>
  );
};
