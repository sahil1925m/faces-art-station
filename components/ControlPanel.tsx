import * as React from 'react';
import { visualLibrary } from './visual-library/visuals';
import VisualCategory from './visual-library/VisualCategory';
import { FeatureCategory } from '../types';

interface ControlPanelProps {
  onVisualRefine: (featureCategory: FeatureCategory, featureName: string, featurePrompt: string) => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onVisualRefine, isLoading }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 flex flex-col h-full overflow-y-auto">
      <h2 className="text-lg font-bold text-cyan-400 border-b border-slate-700 pb-2 mb-4">Visual Library</h2>
      <div className="flex flex-col gap-2">
        {visualLibrary.map(category => (
          <VisualCategory 
            key={category.id}
            category={category}
            onSelect={(featureName, featurePrompt) => onVisualRefine(category.id, featureName, featurePrompt)}
            isDisabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default ControlPanel;
