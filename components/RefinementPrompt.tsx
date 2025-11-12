import * as React from 'react';
import { motion } from 'framer-motion';
import RefinementSlider from './RefinementSlider';

interface RefinementPromptProps {
  onRefine: (prompt: string) => void;
  isLoading: boolean;
}

const DEFAULT_AGE = 35;
const DEFAULT_BUILD_VALUE = 75; // Represents a neutral or average build on a scale

const RefinementPrompt: React.FC<RefinementPromptProps> = ({ onRefine, isLoading }) => {
  const [prompt, setPrompt] = React.useState('');
  const [age, setAge] = React.useState(DEFAULT_AGE);
  const [build, setBuild] = React.useState(DEFAULT_BUILD_VALUE);

  const handleRefineClick = () => {
    if (isLoading) return;

    const refinementParts: string[] = [];
    const textPrompt = prompt.trim();

    if (textPrompt) {
        refinementParts.push(textPrompt);
    }

    if (age !== DEFAULT_AGE) {
        refinementParts.push(`make the person appear to be around ${age} years old`);
    }

    if (build !== DEFAULT_BUILD_VALUE) {
        let buildDesc = '';
        if (build < 65) buildDesc = 'a thinner, more slender facial structure';
        else if (build > 85) buildDesc = 'a heavier, fuller facial structure';
        
        if (buildDesc) {
            refinementParts.push(`adjust the face to have ${buildDesc}`);
        }
    }
    
    const combinedPrompt = refinementParts.join(', ');

    if (combinedPrompt) {
      onRefine(combinedPrompt);
      // Reset state after submission
      setPrompt('');
      setAge(DEFAULT_AGE);
      setBuild(DEFAULT_BUILD_VALUE);
    }
  };

  const hasChanges = prompt.trim().length > 0 || age !== DEFAULT_AGE || build !== DEFAULT_BUILD_VALUE;

  return (
    <div className="bg-[#1E293B] border border-slate-700/50 rounded-lg p-4 flex flex-col gap-4">
       <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe specific marks, expressions, or other adjustments..."
        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow disabled:bg-slate-800"
        disabled={isLoading}
        rows={2}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <RefinementSlider 
            label="Perceived Age"
            min={18}
            max={80}
            step={1}
            value={age}
            onChange={setAge}
            units=" yrs"
            disabled={isLoading}
          />
          <RefinementSlider 
            label="Perceived Build"
            min={50} // Represents 'Thin'
            max={100} // Represents 'Heavy'
            step={1}
            value={build}
            onChange={setBuild}
            disabled={isLoading}
          />
      </div>
       <motion.button
        onClick={handleRefineClick}
        disabled={isLoading || !hasChanges}
        className="w-full mt-2 px-5 py-2.5 bg-cyan-500 text-slate-900 font-bold rounded-md hover:bg-cyan-400 transition-all duration-200 disabled:bg-slate-600 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Applying...
          </>
        ) : 'Apply Refinements'}
      </motion.button>
    </div>
  );
};

export default RefinementPrompt;
