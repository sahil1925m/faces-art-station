import { useState, useCallback } from 'react';
import { Message, InterviewData } from '../types';

// Interview step constants (Matching Master Prompt)
// 1. Intro & Demographics
// 2. Build & Tone
// 3. Face Shape
// 4. Hair
// 5. Eyes
// 6. Center Features (Nose/Mouth)
// 7. Identifiers
// 8. Hand-off
export const INTERVIEW_STEPS = {
    START: 0,           // Gender/Age
    BUILD: 1,           // Build/Complexion
    FACE_SHAPE: 2,      // Shape/Jawline
    HAIR: 3,            // Texture/Style/Receding
    EYES: 4,            // Size/Spacing/Brows
    NOSE_MOUTH: 5,      // Nose/Lips
    IDENTIFIERS: 6,     // Facial hair, scars, glasses
    COMPLETE: 7         // Generation trigger
} as const;

// Professional forensic artist persona messages (Master Prompt Script)
const AI_MESSAGES: Record<number, string> = {
    [INTERVIEW_STEPS.START]: "Hello. I am your forensic sketch assistant. We will create a black-and-white composite. Focus on shapes and shadows. First, what was the suspect's gender and approximate age?",
    [INTERVIEW_STEPS.BUILD]: "Understood. Visualize his build. Was he thin, average, or heavy-set? And was his complexion light, medium, or dark?",
    [INTERVIEW_STEPS.FACE_SHAPE]: "Focus on the outline of the face. Was it Round, Square, Oval, or Long? Did the jawline stand out?",
    [INTERVIEW_STEPS.HAIR]: "Moving to hair. Describe the texture and style. Was it straight, curly, wavy, or bald? Was it receding?",
    [INTERVIEW_STEPS.EYES]: "Now the eyes. Describe their size and spacing. Were they large, small, wide-set, or close-set? What about the eyebrows?",
    [INTERVIEW_STEPS.NOSE_MOUTH]: "Describe the nose. Was it broad, narrow, flat, or hooked? And the mouth—were the lips full or thin?",
    [INTERVIEW_STEPS.IDENTIFIERS]: "Finally, did you see any facial hair, scars, tattoos, deep wrinkles, or glasses?",
    [INTERVIEW_STEPS.COMPLETE]: "Thank you. Generating the sketch now."
};

// Quick reply options per step based on script
const QUICK_REPLIES: Record<number, string[]> = {
    [INTERVIEW_STEPS.START]: ['Male, 30s', 'Female, 30s', 'Male, 40s', 'Male, 50s'],
    [INTERVIEW_STEPS.BUILD]: ['Thin, Light', 'Average, Tan', 'Heavy, Dark'],
    [INTERVIEW_STEPS.FACE_SHAPE]: ['Round', 'Square', 'Oval', 'Long'],
    [INTERVIEW_STEPS.HAIR]: ['Straight', 'Curly', 'Wavy', 'Bald', 'Receding'],
    [INTERVIEW_STEPS.EYES]: ['Large, Wide-set', 'Small, Close-set', 'Thick Brows', 'Thin Brows'],
    [INTERVIEW_STEPS.NOSE_MOUTH]: ['Broad Nose, Full Lips', 'Narrow Nose, Thin Lips', 'Flat Nose', 'Hooked Nose'],
    [INTERVIEW_STEPS.IDENTIFIERS]: ['No', 'Beard', 'Scars', 'Glasses', 'Tattoos'],
    [INTERVIEW_STEPS.COMPLETE]: []
};

interface UseInterviewLogicReturn {
    messages: Message[];
    isTyping: boolean;
    currentStep: number;
    quickReplies: string[];
    processInput: (text: string) => void;
    interviewData: InterviewData;
    currentAiMessage: string;
}

const createMessage = (role: 'user' | 'assistant', content: string): Message => ({
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
});

export const useInterviewLogic = (onComplete: (data: InterviewData) => void): UseInterviewLogicReturn => {
    const [messages, setMessages] = useState<Message[]>([
        createMessage('assistant', AI_MESSAGES[INTERVIEW_STEPS.START])
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [currentStep, setCurrentStep] = useState(INTERVIEW_STEPS.START);
    const [interviewData, setInterviewData] = useState<InterviewData>({});
    const [currentAiMessage, setCurrentAiMessage] = useState(AI_MESSAGES[INTERVIEW_STEPS.START]);

    const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
        setMessages((prev) => [...prev, createMessage(role, content)]);
        if (role === 'assistant') {
            setCurrentAiMessage(content);
        }
    }, []);

    // Parse user input based on current step
    const parseInput = useCallback((text: string, step: number, currentData: InterviewData): InterviewData => {
        const lowerText = text.toLowerCase();
        const newData = { ...currentData };

        switch (step) {
            case INTERVIEW_STEPS.START:
                if (lowerText.includes('male') && !lowerText.includes('female')) newData.gender = 'Male';
                else if (lowerText.includes('female')) newData.gender = 'Female';

                const ageMatch = text.match(/(\\d+)/);
                if (ageMatch) newData.age = ageMatch[1];
                else if (lowerText.includes('20s')) newData.age = '25';
                else if (lowerText.includes('30s')) newData.age = '35';
                else if (lowerText.includes('40s')) newData.age = '45';
                else if (lowerText.includes('50s')) newData.age = '55';
                break;

            case INTERVIEW_STEPS.BUILD:
                // Just storing raw text if standardized categories aren't matched, 
                // but checking for keywords for structured data if helpful
                // For now, let's store broadly.
                break;

            case INTERVIEW_STEPS.FACE_SHAPE:
                if (lowerText.includes('round')) newData.faceShape = 'Round';
                else if (lowerText.includes('square')) newData.faceShape = 'Square';
                else if (lowerText.includes('oval')) newData.faceShape = 'Oval';
                else if (lowerText.includes('long')) newData.faceShape = 'Long';
                break;

            case INTERVIEW_STEPS.HAIR:
                if (lowerText.includes('bald')) newData.hairStyle = 'Bald';
                else if (lowerText.includes('straight')) newData.hairTexture = 'Straight';
                else if (lowerText.includes('curly')) newData.hairTexture = 'Curly';
                else if (lowerText.includes('wavy')) newData.hairTexture = 'Wavy';
                break;

            case INTERVIEW_STEPS.EYES:
                if (lowerText.includes('large')) newData.eyeSize = 'Large';
                if (lowerText.includes('small')) newData.eyeSize = 'Small';
                break;

            case INTERVIEW_STEPS.NOSE_MOUTH:
                if (lowerText.includes('broad')) newData.noseShape = 'Broad';
                if (lowerText.includes('narrow')) newData.noseShape = 'Narrow';
                break;

            case INTERVIEW_STEPS.IDENTIFIERS:
                const features: string[] = [];
                if (lowerText.includes('glasses')) features.push('Glasses');
                if (lowerText.includes('beard')) features.push('Beard');
                if (lowerText.includes('scar')) features.push('Scar');
                if (lowerText.includes('tattoo')) features.push('Tattoo');
                newData.distinctiveFeatures = features.length > 0 ? features : (lowerText.includes('no') ? [] : [text]);
                break;
        }

        // Always append full answer context if needed, but for now we rely on the specific keys we parse
        // Or store raw input for prompt construction later if parsing fails?
        // We often should store the raw input too to be safe.
        // Let's rely on constructing the prompt from the structured data + fallback if feasible.

        return newData;
    }, []);

    const processInput = useCallback(async (text: string) => {
        if (!text.trim()) return;

        addMessage('user', text);
        setIsTyping(true);

        const updatedData = parseInput(text, currentStep, interviewData);
        setInterviewData(updatedData);

        // Simulate thinking time
        await new Promise((resolve) => setTimeout(resolve, 800));

        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);

        const responseText = AI_MESSAGES[nextStep] || '';
        if (responseText) {
            addMessage('assistant', responseText);
        }

        setIsTyping(false);

        if (nextStep === INTERVIEW_STEPS.COMPLETE) {
            setTimeout(() => {
                onComplete(updatedData);
            }, 2000);
        }

    }, [currentStep, interviewData, addMessage, parseInput, onComplete]);

    return {
        messages,
        isTyping,
        currentStep,
        quickReplies: QUICK_REPLIES[currentStep] || [],
        processInput,
        interviewData,
        currentAiMessage,
    };
};
