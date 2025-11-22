import React, { useState, useRef } from 'react';
import { Download, Maximize2, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoCardProps {
  videoUrl: string;
  prompt: string;
}

export const VideoCard: React.FC<VideoCardProps> = ({ videoUrl, prompt }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `nano-gen-video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-3xl overflow-hidden bg-zinc-900 shadow-2xl"
    >
      <div className="aspect-video w-full relative overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          loop
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Play/Pause Overlay Button */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100 bg-black/20 backdrop-blur-[2px]'}`}
          onClick={togglePlay}
        >
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors shadow-2xl"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </motion.button>
        </div>

        {/* Visual Watermark */}
        <div className="absolute bottom-4 right-4 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="text-white/90 font-bold text-xs tracking-wider drop-shadow-lg bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            by ExploitZ3r0
          </span>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 pointer-events-none">
          <motion.div 
            className="pointer-events-auto"
            initial={{ y: 20, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white text-sm font-medium line-clamp-2 mb-4 leading-relaxed">
              {prompt}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleDownload}
                className="flex-1 bg-white text-black py-3 rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="p-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
