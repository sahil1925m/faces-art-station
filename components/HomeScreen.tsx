import * as React from "react";
import { PromptInputBox } from "./PromptInputBox";
import { motion } from "framer-motion";

interface HomeScreenProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export default function HomeScreen({ onGenerate, isLoading }: HomeScreenProps) {
  const handleGenerate = (prompt: string) => {
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };
  
  return (
    <div className="relative w-full h-full flex-grow flex flex-col items-center justify-center bg-[#0F172A] p-4">
       <div className="w-full max-w-3xl text-center z-10 mb-8">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-slate-100 tracking-wide">
            Begin New Composite Sketch
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-400">
            Start by providing a detailed description of the suspect based on witness testimony. The AI will generate an initial composite to begin the refinement process.
          </p>
        </motion.div>
      </div>

      <motion.div 
        className="relative w-full max-w-3xl z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        <PromptInputBox 
            onSend={(message) => handleGenerate(message)}
            isLoading={isLoading}
            placeholder="e.g., 'Male, mid-30s, with a square jaw, thin lips, and a prominent scar over the left eyebrow...'"
        />
      </motion.div>
    </div>
  );
}