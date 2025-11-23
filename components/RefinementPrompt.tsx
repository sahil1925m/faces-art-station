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
  const [prevAge, setPrevAge] = React.useState(DEFAULT_AGE);
  const [prevBuild, setPrevBuild] = React.useState(DEFAULT_BUILD_VALUE);

  // Debounce timer ref
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Auto-apply refinements when sliders change
  React.useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only apply if values actually changed from previous values
    const ageChanged = age !== prevAge;
    const buildChanged = build !== prevBuild;

    if ((ageChanged || buildChanged) && !isLoading) {
      // Debounce the refinement call by 800ms to avoid too many API calls
      debounceTimerRef.current = setTimeout(() => {
        const refinementParts: string[] = [];

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
          setPrevAge(age);
          setPrevBuild(build);
        }
      }, 800);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [age, build, isLoading, onRefine, prevAge, prevBuild]);

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
      setPrevAge(DEFAULT_AGE);
      setPrevBuild(DEFAULT_BUILD_VALUE);
    }
  };

  const hasChanges = prompt.trim().length > 0 || age !== DEFAULT_AGE || build !== DEFAULT_BUILD_VALUE;

  return (
    <div className="glass-morphism rounded-2xl p-5 flex flex-col gap-5 border border-white/5 shadow-lg">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe specific marks, expressions, or other adjustments..."
          className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all disabled:opacity-50 resize-none"
          disabled={isLoading}
          rows={3}
        />
        <div className="absolute bottom-3 right-3">
          <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-black/10 rounded-xl p-4 border border-white/5">
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
        className="w-full py-3 px-6 gradient-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 relative overflow-hidden group"
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Applying Refinements...</span>
          </>
        ) : (
          <>
            <span>Apply Refinements</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default RefinementPrompt;
