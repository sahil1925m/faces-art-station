import React, { useState } from 'react';
import { WizardStepProps } from '../types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Paintbrush, Loader2 } from 'lucide-react';


export default function ReviewStep({ data, onNext, onBack }: WizardStepProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        await onNext(); // trigger generation
        setIsGenerating(false);
    }

    const SummaryItem = ({ label, value }: { label: string, value: string }) => (
        <div className="flex flex-col space-y-1">
            <span className="text-xs uppercase tracking-wider text-neutral-500">{label}</span>
            <span className="text-white font-medium text-lg border-b border-white/10 pb-1">{value || 'Not specified'}</span>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto w-full min-h-full flex flex-col p-6 pb-24">
            <div className="flex-1 space-y-8 flex flex-col my-auto">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                        Review Summary
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        Please review the details before generating the initial composite.
                    </p>
                </div>

                {/* Summary Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm grid md:grid-cols-2 gap-x-12 gap-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />

                    <SummaryItem label="Gender" value={data.gender} />
                    <SummaryItem label="Age Range" value={data.ageRange} />
                    <SummaryItem label="Face Shape" value={data.faceShape} />
                    <SummaryItem label="Build" value={data.build} />
                    <SummaryItem label="Hair Style" value={data.hairStyle} />
                    <SummaryItem label="Hair Color" value={data.hairColor} />
                    <SummaryItem label="Eye Color" value={data.eyeColor} />
                    <SummaryItem label="Eye Shape" value={data.eyeShape} />

                    <div className="md:col-span-2 mt-2">
                        <span className="text-xs uppercase tracking-wider text-neutral-500">Distinguishing Marks</span>
                        <p className="text-white/90 bg-black/20 p-4 rounded-lg mt-2 min-h-[80px] italic">
                            "{data.distinguishingMarks || 'None provided'}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-auto">
                <Button variant="ghost" onClick={onBack} disabled={isGenerating} className="text-neutral-400 hover:text-white">
                    Back
                </Button>
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-green-600 hover:bg-green-500 text-white px-10 py-6 text-xl rounded-full shadow-lg shadow-green-900/30 transition-all duration-300 group"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 w-6 h-6 animate-spin" /> Generating...
                        </>
                    ) : (
                        <>
                            Generate Initial Composite
                            <Paintbrush className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
