import * as React from 'react';
import { FeatureCategory } from '../types';
import VisualCategory from './visual-library/VisualCategory';
import { visualLibrary } from './visual-library/visuals';
import { motion } from 'framer-motion';

interface RefinementItem {
  category: FeatureCategory;
  featureName: string;
  prompt: string;
}

interface ControlPanelProps {
  onVisualRefine: (refinements: RefinementItem[]) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onVisualRefine, isLoading }) => {
  const [selectedRefinements, setSelectedRefinements] = React.useState<Map<string, RefinementItem>>(new Map());

  const handleSelect = (category: FeatureCategory, featureName: string, prompt: string) => {
    const key = `${category}-${featureName}`;
    setSelectedRefinements(prev => {
      const newMap = new Map(prev);
      if (newMap.has(key)) {
        newMap.delete(key);
      } else {
        newMap.set(key, { category, featureName, prompt });
      }
      return newMap;
    });
  };

  const handleApply = () => {
    if (selectedRefinements.size === 0) return;
    onVisualRefine(Array.from(selectedRefinements.values()));
    setSelectedRefinements(new Map());
  };

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
    <div className="h-full flex flex-col glass-morphism rounded-2xl border border-white/10 overflow-hidden shadow-lg bg-black/60 relative">
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md z-10 flex justify-between items-center">
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

        {/* Selection Counter */}
        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/30">
          {selectedRefinements.size} Selected
        </div>
      </div>

      <motion.div
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {visualLibrary.map((category) => {
          const selectedFeatures = new Set<string>();
          selectedRefinements.forEach((item) => {
            if (item.category === category.id) {
              selectedFeatures.add(item.featureName);
            }
          });

          return (
            <motion.div key={category.id} variants={itemVariants}>
              <VisualCategory
                category={category}
                onSelect={(name, prompt) => handleSelect(category.id, name, prompt)}
                isDisabled={isLoading}
                selectedFeatures={selectedFeatures}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Apply Button Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 z-20">
        <button
          onClick={handleApply}
          disabled={selectedRefinements.size === 0 || isLoading}
          className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span>Apply {selectedRefinements.size} Refinements</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
