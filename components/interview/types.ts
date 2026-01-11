export interface ForensicData {
    gender: string;
    ageRange: string;
    faceShape: string;
    build: string;
    hairStyle: string;
    hairColor: string;
    eyeColor: string;
    eyeShape: string;
    distinguishingMarks: string;
}

export interface WizardStepProps {
    data: ForensicData;
    updateData: (data: Partial<ForensicData>) => void;
    onNext: () => void;
    onBack?: () => void;
}
