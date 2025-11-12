import * as React from 'react';
import { motion } from 'framer-motion';
import { visualLibrary } from './visual-library/visuals';
import VisualCategory from './visual-library/VisualCategory';
import { FeatureCategory } from '../types';

interface ControlPanelProps {
  onVisualRefine: (featureCategory: FeatureCategory, featureName: string, featurePrompt: string) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onVisualRefine, isLoading }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-morphism rounded-2xl p-5 flex flex-col h-full overflow-hidden shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
          <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Visual Library</h2>
          <p className="text-xs text-muted-foreground">Quick feature selection</p>
        </div>
      </div>
      
      {/* Categories */}
      <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {visualLibrary.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <VisualCategory 
              category={category}
              onSelect={(featureName, featurePrompt) => onVisualRefine(category.id, featureName, featurePrompt)}
              isDisabled={isLoading}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Footer info */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Click any feature to apply instantly
        </p>
      </div>
    </motion.div>
  );
};

export default ControlPanel;
