import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasProps {
  currentImage: string;
  isLoading: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ currentImage, isLoading }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-morphism rounded-2xl flex items-center justify-center h-full p-6 relative overflow-hidden shadow-lg"
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50" />
      
      <div className="aspect-square w-full max-w-[800px] h-auto max-h-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.23, 0.86, 0.39, 0.96] }}
            className="absolute inset-0 rounded-xl overflow-hidden"
          >
            <img
              src={currentImage}
              alt="Current Composite"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
            {/* Image border glow */}
            <div className="absolute inset-0 border-2 border-primary/20 rounded-xl pointer-events-none" />
          </motion.div>
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 glass-morphism rounded-xl flex items-center justify-center z-20"
          >
              <div className="flex flex-col items-center gap-6">
                {/* Animated loading spinner */}
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/30 rounded-full" />
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse" />
                </div>
                
                {/* Loading text */}
                <div className="text-center space-y-2">
                  <p className="text-foreground font-semibold text-lg">Refining Image</p>
                  <p className="text-muted-foreground text-sm">AI processing in progress...</p>
                </div>
                
                {/* Progress indicator */}
                <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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