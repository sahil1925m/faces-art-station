import * as React from 'react';
import { VisualFeature } from '../../types';
import { motion } from 'framer-motion';
import { getFeatureIcon } from './FeatureIcons';

interface FeatureItemProps {
    feature: VisualFeature;
    categoryId: string;
    onSelect: (featureName: string, featurePrompt: string) => void;
    isDisabled: boolean;
    isSelected?: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, categoryId, onSelect, isDisabled, isSelected }) => {
    const handleClick = () => {
        if (!isDisabled) {
            onSelect(feature.label, feature.prompt);
        }
    };

    const IconComponent = getFeatureIcon(categoryId, feature.label);

    return (
        <motion.button
            onClick={handleClick}
            disabled={isDisabled}
            title={feature.label}
            className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isSelected
                ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.4)]'
                : 'border-slate-600/50 bg-slate-800/40 hover:border-cyan-500/70 hover:bg-cyan-500/10 disabled:hover:border-slate-600'
                }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
        >
            {/* Visual Icon */}
            <div className={`w-full aspect-square flex items-center justify-center p-2 rounded-lg transition-colors ${isSelected ? 'text-cyan-300' : 'text-slate-300 group-hover:text-cyan-200'
                }`}>
                {IconComponent ? (
                    <IconComponent className="w-full h-full" />
                ) : (
                    <span className="text-2xl">{feature.label[0]}</span>
                )}
            </div>
            {/* Label */}
            <span className={`text-[10px] font-medium text-center leading-tight transition-colors ${isSelected ? 'text-cyan-200' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                {feature.label}
            </span>
        </motion.button>
    );
};

export default FeatureItem;
