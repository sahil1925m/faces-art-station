import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSpeechReturn {
    // Text-to-Speech
    speak: (text: string) => void;
    stopSpeaking: () => void;
    isSpeaking: boolean;

    // Speech-to-Text
    startListening: () => void;
    stopListening: () => void;
    isListening: boolean;
    transcript: string;
    resetTranscript: () => void;

    // Capabilities
    ttsSupported: boolean;
    sttSupported: boolean;
}

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    onstart: (() => void) | null;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

export const useSpeech = (): UseSpeechReturn => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    // REMOVED: utteranceRef for browser TTS
    // ADDED: audioRef to track the HTMLAudioElement for backend TTS
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Checks
    // We assume TTS is supported via backend now, so we don't check window.speechSynthesis
    const ttsSupported = true;
    const sttSupported = typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    // Initialize Speech Recognition
    useEffect(() => {
        if (!sttSupported) return;

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionAPI();

        const recognition = recognitionRef.current;
        recognition.continuous = false; // Single utterance mode
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            setTranscript(finalTranscript || interimTranscript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onstart = () => {
            setIsListening(true);
        };

        return () => {
            if (recognition) {
                recognition.abort();
            }
        };
    }, [sttSupported]);

    // Text-to-Speech: Speak text using ONLY Backend (ElevenLabs)
    const speak = useCallback(async (text: string) => {
        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        try {
            const formData = new FormData();
            formData.append('text', text);

            const response = await fetch('http://localhost:8000/api/tts', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                console.error("Backend TTS failed with status:", response.status);
                // We do NOT fallback to browser TTS as requested
                return;
            }

            const data = await response.json();
            const audioSrc = data.audio;

            if (audioSrc) {
                const audio = new Audio(audioSrc);
                audioRef.current = audio; // Store ref to control it later

                audio.onplay = () => setIsSpeaking(true);
                audio.onended = () => {
                    setIsSpeaking(false);
                    audioRef.current = null;
                };
                audio.onerror = (e) => {
                    console.error("Audio playback error", e);
                    setIsSpeaking(false);
                };

                await audio.play();
            }
        } catch (error) {
            console.error("Failed to play TTS:", error);
            setIsSpeaking(false);
        }
    }, []);

    // Stop speaking
    const stopSpeaking = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setIsSpeaking(false);
    }, []);

    // Start listening
    const startListening = useCallback(() => {
        if (!sttSupported || !recognitionRef.current) {
            console.warn('Speech-to-Text not supported in this browser');
            return;
        }

        // Stop any ongoing speech before listening
        stopSpeaking();

        setTranscript('');
        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error('Failed to start speech recognition:', error);
        }
    }, [sttSupported, stopSpeaking]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    // Reset transcript
    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        // TTS
        speak,
        stopSpeaking,
        isSpeaking,

        // STT
        startListening,
        stopListening,
        isListening,
        transcript,
        resetTranscript,

        // Capabilities
        ttsSupported,
        sttSupported,
    };
};
