export type AppStep = 'PROMPT' | 'SELECT' | 'REFINE';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  imageUrl: string;
  change: string;
}

export type FeatureCategory = 'faceShape' | 'hairStyle' | 'facialHair' | 'eyebrows' | 'eyes' | 'nose' | 'lips' | 'jawline' | 'accessories' | 'expression';

// FIX: Added missing HairStyle and EyebrowStyle types to resolve import errors.
export type HairStyle = 'bald' | 'short' | 'medium' | 'long';
export type EyebrowStyle = 'straight' | 'arched' | 'rounded' | 'angled';

export interface VisualFeature {
    label: string;
    // In a real app, this would be a URL to a pre-rendered example image
    // For this demo, we can use it to generate a placeholder
    preview: string; 
    prompt: string;
}

export interface VisualFeatureCategory {
    id: FeatureCategory;
    name: string;
    features: VisualFeature[];
}

export interface DbMatch {
    subjectId: string;
    score: number;
    imageUrl: string;
}