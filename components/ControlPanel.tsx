import * as React from 'react';
import { FeatureCategory } from '../types';
import VisualCategory from './visual-library/VisualCategory';
import { visualLibrary } from './visual-library/visuals';
import { motion } from 'framer-motion';

interface ControlPanelProps {
  onVisualRefine: (category: FeatureCategory, featureName: string, prompt: string) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onVisualRefine, isLoading }) => {

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="h-full flex flex-col glass-morphism rounded-2xl border border-white/10 overflow-hidden shadow-lg bg-black/60">
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary shadow-glow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white tracking-tight">Visual Library</h2>
            <p className="text-xs text-white/60 font-medium">Select features to refine</p>
          </div>
        </div>
      </div>

      <motion.div
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {visualLibrary.map((category) => (
          <motion.div key={category.id} variants={itemVariants}>
            <VisualCategory
              category={category}
              onSelect={(name, prompt) => onVisualRefine(category.id, name, prompt)}
              isDisabled={isLoading}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="p-3 border-t border-white/10 bg-white/5 text-center">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
          F.A.C.E.S. Forensic System v1.0
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;
