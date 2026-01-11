import React from 'react';
import { WizardStepProps } from '../types';
import { Button } from '@/components/ui/button';
import { UserSquare2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StructureStep({ data, updateData, onNext, onBack }: WizardStepProps) {
    const faceShapes = [
        { id: 'Oval', label: 'Oval' },
        { id: 'Round', label: 'Round' },
        { id: 'Square', label: 'Square' },
        { id: 'Heart', label: 'Heart' },
        { id: 'Long', label: 'Long' },
        { id: 'Diamond', label: 'Diamond' },
    ];

    const builds = ['Thin', 'Average', 'Athletic', 'Heavy'];

    const isValid = data.faceShape && data.build;

    // Auto-advance when both are selected
    React.useEffect(() => {
        if (data.faceShape && data.build) {
            const timer = setTimeout(() => {
                onNext();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data.faceShape, data.build, onNext]);

    return (
        <div className="max-w-4xl mx-auto w-full min-h-full flex flex-col p-6 pb-24">
            <div className="flex-1 space-y-12 flex flex-col justify-center">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <UserSquare2 className="w-8 h-8 text-blue-400" />
                        Facial Structure
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        How would you describe their general face shape and physical build?
                    </p>
                </div>

                {/* Face Shape */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-blue-300 uppercase tracking-wider block text-center">
                        Face Shape
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                        {faceShapes.map((shape) => (
                            <button
                                key={shape.id}
                                onClick={() => updateData({ faceShape: shape.id })}
                                className={cn(
                                    "p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col items-center gap-2 transition-all duration-200 hover:bg-white/10",
                                    data.faceShape === shape.id
                                        ? "ring-2 ring-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                        : "opacity-70 hover:opacity-100"
                                )}
                            >
                                {/* Visual placeholder for face shape icons - using div shapes */}
                                <div className={cn(
                                    "w-12 h-16 border-2 mb-2",
                                    shape.id === 'Oval' && "rounded-[40%]",
                                    shape.id === 'Round' && "rounded-full w-14 h-14",
                                    shape.id === 'Square' && "rounded-lg w-14 h-14",
                                    shape.id === 'Long' && "rounded-[30%] h-20 w-10",
                                    shape.id === 'Diamond' && "rotate-45 rounded-sm w-12 h-12 my-2",
                                    data.faceShape === shape.id ? "border-blue-400 bg-blue-400/20" : "border-neutral-500"
                                )} />
                                <span className="text-sm font-medium text-white">{shape.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Build Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-blue-300 uppercase tracking-wider block text-center">
                        General Build
                    </label>
                    <div className="flex flex-wrap justify-center gap-3">
                        {builds.map((build) => (
                            <button
                                key={build}
                                onClick={() => updateData({ build: build })}
                                className={cn(
                                    "px-6 py-3 rounded-lg border transition-all duration-200 font-medium",
                                    data.build === build
                                        ? "bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {build}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-auto">
                <Button variant="ghost" onClick={onBack} className="text-neutral-400 hover:text-white">
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    disabled={!isValid}
                    className={cn(
                        "bg-blue-600 text-white px-8 py-6 text-lg rounded-full transition-all",
                        !isValid && "opacity-50 cursor-not-allowed bg-neutral-800"
                    )}
                >
                    Next: Features
                </Button>
            </div>
        </div>
    );
}
