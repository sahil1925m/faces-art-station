import * as React from 'react';
import { motion } from 'framer-motion';

interface QuickRepliesProps {
    options: string[];
    onSelect: (option: string) => void;
}

export const QuickReplies: React.FC<QuickRepliesProps> = ({ options, onSelect }) => {
    if (options.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2.5 mb-4 px-1">
            {options.map((option, index) => (
                <motion.button
                    key={option}
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(option)}
                    className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-gray-200 text-xs md:text-sm font-medium transition-all shadow-sm hover:border-indigo-500/50 hover:shadow-indigo-500/20"
                >
                    {option}
                </motion.button>
            ))}
        </div>
    );
};
