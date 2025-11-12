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
    <div className="relative w-full h-full flex-grow flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="w-full max-w-4xl text-center z-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 0.86, 0.39, 0.96] }}
          className="space-y-6"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphism mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-muted-foreground font-medium tracking-wide">
              AI-Powered Forensic Tool
            </span>
          </motion.div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Begin New</span>
            <br />
            <span className="text-gradient animate-shimmer bg-[length:200%_auto]">
              Composite Sketch
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Provide a detailed description of the suspect based on witness testimony. 
            Our advanced AI will generate a professional composite sketch in seconds.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Real-time Generation', 'Advanced AI', 'Database Search'].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-foreground/80"
              >
                {feature}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Input section */}
      <motion.div 
        className="relative w-full max-w-3xl z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 0.86, 0.39, 0.96] }}
      >
        <div className="glass-morphism rounded-2xl p-1 shadow-glow">
          <PromptInputBox 
            onSend={(message) => handleGenerate(message)}
            isLoading={isLoading}
            placeholder="e.g., 'Male, mid-30s, with a square jaw, thin lips, and a prominent scar over the left eyebrow...'"
          />
        </div>
      </motion.div>
    </div>
  );
}