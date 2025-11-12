import * as React from 'react';
import { VisualFeature } from '../../types';
import { motion } from 'framer-motion';

interface FeatureItemProps {
    feature: VisualFeature;
    onSelect: (featureName: string, featurePrompt: string) => void;
    isDisabled: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, onSelect, isDisabled }) => {
    const handleClick = () => {
        if (!isDisabled) {
            onSelect(feature.label, feature.prompt);
        }
    };
    return (
        <motion.button
            onClick={handleClick}
            disabled={isDisabled}
            title={feature.label}
            className="group flex flex-col items-center gap-2 p-2 rounded-md border-2 border-slate-600 bg-slate-700/50 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
        >
            {/* Placeholder for visual example */}
            <div className="w-full aspect-square bg-slate-600 rounded-sm flex items-center justify-center">
                <span className="text-slate-500 text-xs text-center">{feature.label}</span>
            </div>
        </motion.button>
    );
};

export default FeatureItem;