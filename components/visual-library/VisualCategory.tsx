import * as React from 'react';
import { VisualFeatureCategory } from '../../types';
import FeatureItem from './FeatureItem';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualCategoryProps {
    category: VisualFeatureCategory;
    onSelect: (featureName: string, featurePrompt: string) => void;
    isDisabled: boolean;
    selectedFeatures?: Set<string>;
}

const VisualCategory: React.FC<VisualCategoryProps> = ({ category, onSelect, isDisabled, selectedFeatures }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    const variants = {
        open: { opacity: 1, height: 'auto', marginTop: '12px' },
        collapsed: { opacity: 0, height: 0, marginTop: '0px' },
    };

    return (
        <div className="bg-card/40 border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/30">
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-3 text-left font-medium text-white hover:bg-white/5 transition-colors"
                whileTap={{ scale: 0.99 }}
            >
                <span className="text-sm tracking-wide">{category.name}</span>
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`w-4 h-4 text-white/60`}
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
            </motion.button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={variants}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="px-3 pb-3 grid grid-cols-3 gap-2">
                            {category.features.map(feature => (
                                <FeatureItem
                                    key={feature.label}
                                    feature={feature}
                                    onSelect={onSelect}
                                    isDisabled={isDisabled}
                                    isSelected={selectedFeatures?.has(feature.label)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VisualCategory;