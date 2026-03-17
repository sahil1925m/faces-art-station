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
            className={`group flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${isSelected
                ? 'border-[#3B82F6] bg-[#3B82F6]/10 shadow-[0_4px_12px_rgba(59,130,246,0.15)]'
                : 'border-slate-600/30 bg-slate-800/40 hover:border-[#93C5FD]/50 hover:bg-slate-800/60 disabled:hover:border-slate-600/30'
                }`}
            whileHover={{
                scale: 1.02,
                y: -2,
                boxShadow: "0 8px 16px rgba(0,0,0,0.2)"
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Visual Icon */}
            <div className={`w-full aspect-square flex items-center justify-center p-2 rounded-lg transition-colors duration-200 ${isSelected ? 'text-[#3B82F6]' : 'text-slate-100 group-hover:text-[#93C5FD]'
                }`}>
                {IconComponent ? (
                    <IconComponent className="w-full h-full transition-[stroke] duration-200" />
                ) : (
                    <span className="text-2xl font-bold">{feature.label[0]}</span>
                )}
            </div>
            {/* Label */}
            <span className={`text-[10px] font-semibold text-center leading-tight transition-colors duration-200 px-1 ${isSelected ? 'text-[#3B82F6]' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                {feature.label}
            </span>
        </motion.button>
    );
};

export default FeatureItem;
