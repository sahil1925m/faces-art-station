import React from 'react';

import { WizardStepProps } from '../types';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DemographicsStep({ data, updateData, onNext, onBack }: WizardStepProps) {
    const genders = ['Male', 'Female', 'Non-Binary'];
    const ageRanges = ['Child', 'Teens', '20s', '30s', '40s', '50s', '60s', '70s+'];

    const isValid = data.gender && data.ageRange;

    // Auto-advance when both are selected
    React.useEffect(() => {
        if (data.gender && data.ageRange) {
            const timer = setTimeout(() => {
                onNext();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data.gender, data.ageRange, onNext]);

    return (
        <div className="max-w-4xl mx-auto w-full min-h-full flex flex-col p-6">
            <div className="flex-1 space-y-8 flex flex-col justify-center my-4">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <Users className="w-8 h-8 text-blue-400" />
                        Demographics
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        Let's start with the basics. What was the suspect's perceived gender and approximate age range?
                    </p>
                </div>

                {/* Gender Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-blue-300 uppercase tracking-wider block text-center">
                        Perceived Gender
                    </label>
                    <div className="flex flex-wrap justify-center gap-4">
                        {genders.map((g) => (
                            <button
                                key={g}
                                onClick={() => updateData({ gender: g })}
                                className={cn(
                                    "px-8 py-4 rounded-xl border-2 transition-all duration-200 text-lg font-medium min-w-[140px]",
                                    data.gender === g
                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                                        : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:border-white/30"
                                )}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Age Selection */}
                <div className="space-y-6">
                    <label className="text-sm font-semibold text-blue-300 uppercase tracking-wider block text-center">
                        Approximate Age
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                        {ageRanges.map((age) => (
                            <button
                                key={age}
                                onClick={() => updateData({ ageRange: age })}
                                className={cn(
                                    "py-3 rounded-lg border transition-all duration-200 font-medium",
                                    data.ageRange === age
                                        ? "bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                        : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {age}
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
                    Next: Structure
                </Button>
            </div>
        </div>
    );
}
