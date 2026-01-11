import React from 'react';
import { WizardStepProps } from '../types';
import { Button } from '@/components/ui/button';
import { Fingerprint } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function DistinguishingMarksStep({ data, updateData, onNext, onBack }: WizardStepProps) {
    return (
        <div className="max-w-3xl mx-auto w-full min-h-full flex flex-col p-6 pb-24">
            <div className="flex-1 space-y-8 flex flex-col justify-center">
                {/* Header */}
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <Fingerprint className="w-8 h-8 text-blue-400" />
                        Distinguishing Marks
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        Did anything specific stand out? (Scars, tattoos, glasses, facial hair, specific expression?)
                    </p>
                </div>

                <div className="w-full">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-1">
                        <Textarea
                            value={data.distinguishingMarks || ''}
                            onChange={(e) => updateData({ distinguishingMarks: e.target.value })}
                            placeholder="e.g., Vertical scar over left eyebrow, wire-rimmed glasses, thick mustache, looking very angry..."
                            className="min-h-[200px] bg-transparent border-none text-xl p-6 text-white placeholder:text-neutral-600 focus-visible:ring-0 resize-none"
                            style={{ fontSize: '1.25rem' }}
                        />
                    </div>
                    <p className="text-sm text-neutral-500 mt-3 text-center">
                        This field is optional but helps add unique character to the composite.
                    </p>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-auto">
                <Button variant="ghost" onClick={onBack} className="text-neutral-400 hover:text-white">
                    Back
                </Button>
                <Button
                    onClick={onNext}
                    className="bg-blue-600 text-white px-8 py-6 text-lg rounded-full transition-all hover:bg-blue-500 shadow-lg shadow-blue-600/20"
                >
                    Review & Generate
                </Button>
            </div>
        </div>
    );
}
