import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { PromptInput } from '../components/PromptInput';
import { ImageCard } from '../components/ImageCard';
import { VideoCard } from '../components/VideoCard';
import { generateImage } from '../api/image';
import { generateVideo, pollVideoStatus } from '../api/video';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneratedItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
}

export const GeneratorPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleGenerate = async (prompt: string, mode: 'image' | 'video', duration?: string, withAudio?: boolean, aspectRatio?: string) => {
    setIsGenerating(true);
    setError(null);
    setGenerationStatus(mode === 'image' ? 'Creating masterpiece...' : 'Initializing video engine...');

    try {
      if (mode === 'image') {
        const imageUrl = await generateImage(prompt);
        const newItem: GeneratedItem = {
          id: Date.now().toString(),
          type: 'image',
          url: imageUrl,
          prompt,
          timestamp: Date.now(),
        };
        setItems(prev => [newItem, ...prev]);
        setIsGenerating(false);
      } else {
        const task = await generateVideo(prompt, duration, withAudio, aspectRatio);
        setGenerationStatus('Video task submitted. Processing...');
        
        const taskId = task.task_id;
        let attempts = 0;
        const maxAttempts = 120;

        pollIntervalRef.current = setInterval(async () => {
          try {
            attempts++;
            const statusData = await pollVideoStatus(taskId);
            
            if (statusData.status === 'completed' && statusData.data && statusData.data[0]) {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              
              const newItem: GeneratedItem = {
                id: Date.now().toString(),
                type: 'video',
                url: statusData.data[0].url,
                prompt,
                timestamp: Date.now(),
              };
              setItems(prev => [newItem, ...prev]);
              setIsGenerating(false);
              setGenerationStatus('');
            } else if (statusData.status === 'failed') {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              throw new Error(statusData.error?.message || 'Video generation failed');
            } else {
              setGenerationStatus(`Rendering video... (${statusData.status})`);
            }

            if (attempts >= maxAttempts) {
              if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
              throw new Error('Video generation timed out');
            }
          } catch (err: any) {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            // Handle user cancellation gracefully
            if (err.message && err.message.includes('USER_CANCELLED_HIGH_COST_REQUEST')) {
              setError("Generation cancelled");
            } else {
              setError(err.message || "Failed to check video status");
            }
            setIsGenerating(false);
          }
        }, 5000);
      }
    } catch (err: any) {
      // Handle user cancellation gracefully
      if (err.message && err.message.includes('USER_CANCELLED_HIGH_COST_REQUEST')) {
        setError("Generation cancelled");
      } else {
        setError(err.message || `Failed to generate ${mode}. Please try again.`);
      }
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-noise text-zinc-100 selection:bg-amber-500/30 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/5 blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-16 w-full space-y-20">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-balance">
              Turn imagination into <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-500">reality</span>
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Powered by Nano Banana & Sora-2. Create stunning visuals in seconds with our advanced AI engine.
            </p>
            
            <div className="pt-8">
              <PromptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
              
              <AnimatePresence>
                {isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8 flex items-center justify-center gap-3 text-amber-400 bg-amber-500/5 py-3 px-6 rounded-full w-fit mx-auto border border-amber-500/10 backdrop-blur-sm"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium tracking-wide text-sm">{generationStatus}</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-400 text-sm max-w-md mx-auto backdrop-blur-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Results Section */}
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h3 className="text-2xl font-semibold flex items-center gap-3 text-zinc-200">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Recent Creations
              </h3>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-zinc-500">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-32 text-center border border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]"
                >
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/5">
                    <Sparkles className="w-8 h-8 text-zinc-600" />
                  </div>
                  <h4 className="text-xl font-medium text-zinc-300">Your canvas is empty</h4>
                  <p className="text-zinc-500 text-sm mt-2 max-w-xs mx-auto">
                    Enter a prompt above to start creating your first masterpiece
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {items.map((item) => (
                    <React.Fragment key={item.id}>
                      {item.type === 'video' ? (
                        <VideoCard 
                          videoUrl={item.url} 
                          prompt={item.prompt} 
                        />
                      ) : (
                        <ImageCard 
                          imageUrl={item.url} 
                          prompt={item.prompt} 
                        />
                      )}
                    </React.Fragment>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};
