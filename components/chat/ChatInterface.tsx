import * as React from 'react';
import { useInterviewLogic, INTERVIEW_STEPS } from '../../hooks/useInterviewLogic';
import { useSpeech } from '../../hooks/useSpeech';
import { MessageBubble } from './MessageBubble';
import { QuickReplies } from './QuickReplies';
import { InterviewData } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInterfaceProps {
    onGenerate: (prompt: string, interviewData?: InterviewData) => void;
    isLoading?: boolean;
    onBack?: () => void;
}

// Construct prompt from interview data for image generation
// Construct prompt from interview data for image generation (Master Prompt Logic)
const constructPrompt = (data: InterviewData): string => {
    // defaults
    const age = data.age || '30s';
    const gender = data.gender || 'person';
    const faceShape = data.faceShape ? `${data.faceShape} face` : 'distinctive face';
    const hairTexture = data.hairTexture || data.hairStyle || 'styled';
    const eyeSize = data.eyeSize || 'focused';
    const noseShape = data.noseShape || 'defined';

    // Identifiers
    let distinctiveMarks = '';
    if (data.distinctiveFeatures && data.distinctiveFeatures.length > 0) {
        distinctiveMarks = data.distinctiveFeatures.join(', ');
    }

    // Specific Format:
    // "A professional forensic police sketch of a [age] [gender], [faceShape] face, [hairTexture] hair, [eyeSize] eyes, [noseShape] nose. [distinctiveMarks]. High contrast, monochrome pencil drawing on paper texture, rough sketching style, detailed shading, noir atmosphere. Black and white."

    let prompt = `A professional forensic police sketch of a ${age} ${gender}, ${faceShape}, ${hairTexture} hair, ${eyeSize} eyes, ${noseShape} nose.`;

    if (distinctiveMarks) {
        prompt += ` ${distinctiveMarks}.`;
    }

    prompt += " 2D flat line art, clean contour drawing, minimal shading, high contrast, monochrome, white background, technical illustration style. No photorealism, no 3D shading, no grey gradients.";

    return prompt;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onGenerate, isLoading = false, onBack }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = React.useState('');

    // Speech hooks
    const {
        speak,
        stopSpeaking,
        isSpeaking,
        startListening,
        stopListening,
        isListening,
        transcript,
        resetTranscript,
        ttsSupported,
        sttSupported,
    } = useSpeech();

    const handleComplete = React.useCallback((data: InterviewData) => {
        const prompt = constructPrompt(data);
        console.log('Generated prompt:', prompt);
        console.log('Interview data:', data);
        onGenerate(prompt, data);  // pass full data so App.tsx can store gender
    }, [onGenerate]);

    const { messages, isTyping, quickReplies, processInput, currentStep, currentAiMessage } = useInterviewLogic(handleComplete);

    // Auto-speak AI messages
    React.useEffect(() => {
        if (currentAiMessage && ttsSupported && !isLoading) {
            // Small delay to let the UI update first
            const timer = setTimeout(() => speak(currentAiMessage), 100);
            return () => clearTimeout(timer);
        }
    }, [currentAiMessage, speak, ttsSupported, isLoading]);

    // Update input with transcript when listening
    React.useEffect(() => {
        if (transcript) {
            setInputValue(transcript);
        }
    }, [transcript]);

    // Auto-scroll to bottom
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isTyping]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || currentStep >= INTERVIEW_STEPS.COMPLETE) return;

        stopSpeaking();
        stopListening();
        processInput(inputValue);
        setInputValue('');
        resetTranscript();
    };

    const handleQuickReply = (text: string) => {
        stopSpeaking();
        processInput(text);
    };

    const handleVoiceToggle = () => {
        if (isListening) {
            stopListening();
            // Submit after stopping if there's content
            if (transcript.trim()) {
                setTimeout(() => {
                    processInput(transcript);
                    setInputValue('');
                    resetTranscript();
                }, 300);
            }
        } else {
            stopSpeaking();
            startListening();
        }
    };

    const isComplete = currentStep >= INTERVIEW_STEPS.COMPLETE;

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto relative">
            {/* Header Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex items-center justify-between pointer-events-none">
                {/* Back Button */}
                <div className="pointer-events-auto">
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 shadow-lg hover:bg-white/10 transition-all text-white/70 hover:text-white"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-xs font-mono uppercase tracking-wider hidden sm:inline">Home</span>
                        </button>
                    )}
                </div>

                {/* Mute/Unmute TTS */}
                {ttsSupported && (
                    <button
                        onClick={isSpeaking ? stopSpeaking : () => speak(currentAiMessage)}
                        className="bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-lg pointer-events-auto hover:bg-white/10 transition-all"
                        title={isSpeaking ? "Mute" : "Replay"}
                    >
                        {isSpeaking ? (
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 md:px-20 pt-24 pb-32 scroll-smooth custom-scrollbar"
            >
                <div className="max-w-3xl mx-auto space-y-6">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl rounded-tl-none px-5 py-4 border border-white/10 flex gap-1.5 shadow-lg">
                                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
                <div className="max-w-3xl mx-auto w-full">
                    {!isComplete && <QuickReplies options={quickReplies} onSelect={handleQuickReply} />}

                    <motion.form
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60"></div>
                        <div className="relative flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pl-6 shadow-2xl ring-1 ring-white/5 focus-within:ring-indigo-500/50 transition-all">
                            {/* Voice Input Button */}
                            {sttSupported && !isComplete && (
                                <button
                                    type="button"
                                    onClick={handleVoiceToggle}
                                    className={`p-3 rounded-xl transition-all ${isListening
                                        ? 'bg-red-600 hover:bg-red-500 animate-pulse'
                                        : 'bg-white/10 hover:bg-white/20'
                                        }`}
                                    title={isListening ? "Stop listening" : "Voice input"}
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                            )}

                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={
                                    isComplete ? "Interview complete. Generating..."
                                        : isListening ? "Listening..."
                                            : isLoading ? "Generating sketch..."
                                                : "Describe or use voice..."
                                }
                                disabled={isLoading || isComplete}
                                className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-white/40 text-lg py-2"
                                autoFocus
                            />

                            {/* Listening Indicator */}
                            <AnimatePresence>
                                {isListening && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-1 px-3"
                                    >
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span className="w-2 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                                        <span className="w-2 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                                        <span className="w-2 h-3 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '50ms' }} />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={(!inputValue.trim() && !isListening) || isLoading || isComplete}
                                className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
