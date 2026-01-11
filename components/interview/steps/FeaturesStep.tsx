import React from 'react';
import { WizardStepProps } from '../types';
import { Button } from '@/components/ui/button';
import { Eye, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';


// Simple Select wrapper component if not available, or use native select for speed
function SimpleSelect({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: string[], placeholder: string }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
        >
            <option value="" disabled className="bg-neutral-900 text-neutral-500">{placeholder}</option>
            {options.map(opt => (
                <option key={opt} value={opt} className="bg-neutral-900 text-white">{opt}</option>
            ))}
        </select>
    )
}

export default function FeaturesStep({ data, updateData, onNext, onBack }: WizardStepProps) {
    const hairStyles = ['Bald', 'Short / Buzz Cut', 'Short / Styled', 'Medium Length', 'Long / Straight', 'Long / Wavy', 'Curly / Afro'];
    const hairColors = ['Black', 'Dark Brown', 'Light Brown', 'Blond', 'Red / Ginger', 'Grey / White', 'Salt & Pepper'];
    const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Grey'];
    const eyeShapes = ['Almond', 'Round', 'Narrow', 'Hooded', 'Deep Set'];

    const isValid = data.hairStyle && data.eyeColor && data.hairColor && data.eyeShape;

    // Auto-advance when all features are selected
    React.useEffect(() => {
        if (data.hairStyle && data.eyeColor && data.hairColor && data.eyeShape) {
            const timer = setTimeout(() => {
                onNext();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [data.hairStyle, data.eyeColor, data.hairColor, data.eyeShape, onNext]);

    return (
        <div className="max-w-4xl mx-auto w-full min-h-full flex flex-col p-6 pb-24">
            <div className="flex-1 space-y-12 flex flex-col justify-center">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <Eye className="w-8 h-8 text-blue-400" />
                        Key Features
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        Let's detail the hair and eye characteristics.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    {/* Hair Section */}
                    <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 text-blue-300 font-semibold uppercase tracking-wider">
                            <Scissors className="w-5 h-5" />
                            <h3>Hair Characteristics</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Hair Style</label>
                            <SimpleSelect
                                value={data.hairStyle}
                                onChange={(val) => updateData({ hairStyle: val })}
                                options={hairStyles}
                                placeholder="Select Hair Style"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Hair Color</label>
                            <SimpleSelect
                                value={data.hairColor}
                                onChange={(val) => updateData({ hairColor: val })}
                                options={hairColors}
                                placeholder="Select Hair Color"
                            />
                        </div>
                    </div>

                    {/* Eyes Section */}
                    <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3 text-blue-300 font-semibold uppercase tracking-wider">
                            <Eye className="w-5 h-5" />
                            <h3>Eye Characteristics</h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Eye Color</label>
                            <SimpleSelect
                                value={data.eyeColor}
                                onChange={(val) => updateData({ eyeColor: val })}
                                options={eyeColors}
                                placeholder="Select Eye Color"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Eye Shape</label>
                            <SimpleSelect
                                value={data.eyeShape}
                                onChange={(val) => updateData({ eyeShape: val })}
                                options={eyeShapes}
                                placeholder="Select Eye Shape"
                            />
                        </div>
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
                    Next: Distinguishing Marks
                </Button>
            </div>
        </div>
    );
}
