import React, { useState } from 'react';
import { Download, Share2, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageCardProps {
  imageUrl: string;
  prompt: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, prompt }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const text = "by ExploitZ3r0";
        const fontSize = Math.max(24, img.width * 0.03);
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        const padding = Math.max(20, img.width * 0.02);
        ctx.fillText(text, canvas.width - padding, canvas.height - padding);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nano-gen-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
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
      <div className="aspect-square w-full relative overflow-hidden">
        <motion.img 
          src={imageUrl} 
          alt={prompt} 
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        
        {/* Visual Watermark */}
        <div className="absolute bottom-4 right-4 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="text-white/90 font-bold text-xs tracking-wider drop-shadow-lg bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            by ExploitZ3r0
          </span>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
          <motion.div 
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
                disabled={isDownloading}
                className="flex-1 bg-white text-black py-3 rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/20"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Saving...' : 'Download'}
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
