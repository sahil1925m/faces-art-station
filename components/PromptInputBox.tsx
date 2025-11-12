import * as React from 'react';
import { ArrowUp, LoaderCircle } from 'lucide-react';

export const PromptInputBox: React.FC<{
    onSend: (message: string) => void;
    isLoading: boolean;
    placeholder: string;
}> = ({ onSend, isLoading, placeholder }) => {
    const [input, setInput] = React.useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };
    
    // Autosize textarea based on content
    React.useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            // Set a max-height to prevent infinite growth
            const maxHeight = 200; 
            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    }, [input]);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 flex items-start gap-3 border border-slate-700 focus-within:border-cyan-500 transition-all duration-300">
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="flex-grow bg-transparent text-slate-200 placeholder-slate-400 focus:outline-none resize-none overflow-y-auto w-full p-2"
                style={{ scrollbarWidth: 'none' }} /* Firefox */
                disabled={isLoading}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 flex-shrink-0 bg-cyan-500 text-slate-900 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                aria-label={isLoading ? "Generating..." : "Send prompt"}
            >
                {isLoading ? (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                ) : (
                    <ArrowUp className="h-5 w-5" />
                )}
            </button>
        </div>
    );
};
