import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasProps {
  currentImage: string;
  isLoading: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ currentImage, isLoading }) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!canvasRef.current) return;

    if (!document.fullscreenElement) {
      canvasRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <motion.div
      ref={canvasRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-morphism rounded-2xl flex items-center justify-center h-full p-8 relative overflow-hidden shadow-2xl border border-white/10 bg-black/40"
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />

      {/* Grid overlay for forensic feel */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Fullscreen Button */}
      {currentImage && !isLoading && (
        <motion.button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-30 p-2 rounded-lg bg-black/50 hover:bg-black/70 border border-white/20 hover:border-primary/50 transition-all duration-200 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5 text-white group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </motion.button>
      )}

      <div className="aspect-square w-full max-w-[800px] h-auto max-h-full relative z-10 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.23, 0.86, 0.39, 0.96] }}
            className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
          >
            <img
              src={currentImage}
              alt="Current Composite"
              className="w-full h-full object-contain bg-black/50"
            />
            {/* Image border glow */}
            <div className="absolute inset-0 border border-primary/20 rounded-2xl pointer-events-none group-hover:border-primary/40 transition-colors duration-500" />

            {/* Corner accents */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-lg opacity-50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-lg opacity-50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-lg opacity-50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-lg opacity-50" />
          </motion.div>
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-2xl flex items-center justify-center z-20 border border-white/10"
          >
            <div className="flex flex-col items-center gap-8 p-8 rounded-3xl bg-black/40 border border-white/5 shadow-2xl">
              {/* Animated loading spinner */}
              <div className="relative">
                <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-pulse" />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                  <svg className="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
              </div>

              {/* Loading text */}
              <div className="text-center space-y-2">
                <p className="text-white font-bold text-xl tracking-wide">Refining Composite</p>
                <p className="text-blue-200/70 text-sm font-medium">AI processing facial features...</p>
              </div>

              {/* Progress indicator */}
              <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Canvas;