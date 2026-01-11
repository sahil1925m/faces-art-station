import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ForensicData } from './types';
import WelcomeStep from './steps/WelcomeStep';
import DemographicsStep from './steps/DemographicsStep';
import StructureStep from './steps/StructureStep';
import FeaturesStep from './steps/FeaturesStep';
import DistinguishingMarksStep from './steps/DistinguishingMarksStep';
import ReviewStep from './steps/ReviewStep';

interface InterviewWizardProps {
    onGenerate: (prompt: string) => Promise<string>;
    isLoading: boolean;
}

const initialData: ForensicData = {
    gender: '',
    ageRange: '',
    faceShape: '',
    build: '',
    hairStyle: '',
    hairColor: '',
    eyeColor: '',
    eyeShape: '',
    distinguishingMarks: ''
};

export default function InterviewWizard({ onGenerate, isLoading: _isLoading }: InterviewWizardProps) {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<ForensicData>(initialData);

    const updateData = (partialData: Partial<ForensicData>) => {
        setData(prev => ({ ...prev, ...partialData }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const constructPrompt = (d: ForensicData) => {
        let prompt = `A forensic sketch of a ${d.gender}, age range ${d.ageRange}. `;
        prompt += `Face shape is ${d.faceShape}, ${d.build} build. `;
        prompt += `${d.hairStyle} ${d.hairColor} hair. `;
        prompt += `${d.eyeShape} ${d.eyeColor} eyes. `;

        if (d.distinguishingMarks) {
            prompt += `Distinctive features: ${d.distinguishingMarks}. `;
        }

        prompt += "High contrast, monochrome pencil drawing style, straight-on view, detailed shading.";
        return prompt;
    };

    const handleFinalGenerate = async () => {
        const finalPrompt = constructPrompt(data);
        await onGenerate(finalPrompt);
    };

    const steps = [
        <WelcomeStep onStart={nextStep} />,
        <DemographicsStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
        <StructureStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
        <FeaturesStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
        <DistinguishingMarksStep data={data} updateData={updateData} onNext={nextStep} onBack={prevStep} />,
        <ReviewStep data={data} updateData={updateData} onNext={handleFinalGenerate} onBack={prevStep} />
    ];

    return (
        <div className="w-full h-full bg-black relative overflow-hidden flex flex-col">
            {/* Background */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 bg-black opacity-30 blur-sm scale-110"
                style={{ backgroundImage: "url('/backgrounds/home-bg.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-0 pointer-events-none" />

            {/* Wizard Content */}
            <div className="relative z-10 w-full h-full flex flex-col">
                {/* Progress Indicator (only after step 0) */}
                {step > 0 && (
                    <div className="w-full h-1 bg-white/10">
                        <motion.div
                            className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
                            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full h-full"
                        >
                            {/* We clone the element to pass props if needed, though we passed them in the array definition */}
                            {steps[step]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
