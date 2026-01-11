import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
    onStart: () => void;
}

export default function WelcomeStep({ onStart }: WelcomeStepProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
            >
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
                    F.A.C.E.S.
                </h1>
                <p className="text-lg md:text-xl text-blue-200/80 font-light tracking-widest uppercase">
                    Forensic Artificial Composite Engine System
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl"
            >
                <p className="text-neutral-300 leading-relaxed text-lg">
                    Welcome to the <strong>Guided Forensic Interview</strong> used to create facial composites.
                    We will walk through a structured process to reconstruct the subject's appearance step-by-step.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
            >
                <Button
                    onClick={onStart}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-6 text-xl rounded-full shadow-lg shadow-blue-900/50 hover:shadow-blue-500/50 transition-all duration-300 group"
                >
                    Start Interview
                    <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
            </motion.div>
        </div>
    );
}
