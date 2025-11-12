import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasProps {
  currentImage: string;
  isLoading: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ currentImage, isLoading }) => {
  return (
    <div className="bg-[#1E293B] rounded-lg flex items-center justify-center h-full p-4 relative overflow-hidden border border-slate-700/50">
      <div className="aspect-square w-full max-w-[800px] h-auto max-h-full relative">
        <AnimatePresence>
          <motion.img
            key={currentImage}
            src={currentImage}
            alt="Current Composite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </AnimatePresence>
        
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-4">
                 <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-slate-300 font-medium">Refining Image...</span>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;