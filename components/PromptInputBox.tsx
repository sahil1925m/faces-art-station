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
        <div className="relative bg-black/60 backdrop-blur-md rounded-xl border border-border/50 focus-within:border-primary transition-all duration-300">
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className="w-full px-4 py-3 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none resize-none overflow-y-auto min-h-[48px]"
                style={{ scrollbarWidth: 'none' }}
                disabled={isLoading}
            />
            <div className="flex items-center justify-end p-3 pt-0">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                    aria-label={isLoading ? "Generating..." : "Send prompt"}
                >
                    {isLoading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                        <ArrowUp className="h-4 w-4" />
                    )}
                </button>
            </div>
        </div>
    );
};
