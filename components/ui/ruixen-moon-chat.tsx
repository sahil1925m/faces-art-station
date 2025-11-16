import React, { useState, useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

interface RuixenMoonChatProps {
  onGenerate?: (prompt: string) => Promise<string>;
  isLoading?: boolean;
}

export interface RuixenMoonChatRef {
  addAssistantMessage: (content: string, imageUrl?: string) => void;
}

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

const RuixenMoonChat = forwardRef<RuixenMoonChatRef, RuixenMoonChatProps>(
  ({ onGenerate, isLoading = false }, ref) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
      minHeight: 48,
      maxHeight: 150,
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      addAssistantMessage: (content: string, imageUrl?: string) => {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content,
          imageUrl,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      },
    }));

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
      if (!message.trim() || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: message.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      const promptText = message.trim();
      setMessage("");
      adjustHeight(true);

      if (onGenerate) {
        try {
          const imageUrl = await onGenerate(promptText);
          const assistantMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Here's the forensic composite sketch based on your description:",
            imageUrl,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
          const errorMessage: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, I encountered an error generating the sketch. Please try again.",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <div
        className="relative w-full h-screen bg-cover bg-center flex flex-col items-center"
        style={{
          backgroundImage:
            "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_moon_2.png')",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Messages or Welcome Screen */}
        <div className="flex-1 w-full flex flex-col items-center overflow-y-auto px-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-semibold text-white drop-shadow-sm">
                  F.A.C.E.S Composite System
                </h1>
                <p className="mt-2 text-neutral-200">
                  Describe the suspect to generate a forensic sketch
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-3xl py-8 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-800 text-white"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Generated sketch"
                        className="mt-3 rounded-lg max-w-full"
                      />
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-neutral-800 text-white">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <p className="text-sm">Generating forensic sketch...</p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Box Section */}
        <div className="w-full max-w-3xl mb-[20vh]">
          <div className="relative bg-black/60 backdrop-blur-md rounded-xl border border-neutral-700">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Describe the suspect's appearance..."
              disabled={isLoading}
              className={cn(
                "w-full px-4 py-3 resize-none border-none",
                "bg-transparent text-white text-sm",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-neutral-400 min-h-[48px]",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              style={{ overflow: "hidden" }}
            />

            {/* Footer Buttons */}
            <div className="flex items-center justify-between p-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-neutral-700"
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                    message.trim() && !isLoading
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUpIcon className="w-4 h-4" />
                  )}
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions - Only show when no messages */}
          {messages.length === 0 && (
            <div className="flex items-center justify-center flex-wrap gap-3 mt-6">
              <QuickAction
                icon={<CircleUserRound className="w-4 h-4" />}
                label="Male, 30s"
                onClick={() => setMessage("Male, approximately 30 years old, ")}
              />
              <QuickAction
                icon={<CircleUserRound className="w-4 h-4" />}
                label="Female, 20s"
                onClick={() => setMessage("Female, approximately 20 years old, ")}
              />
              <QuickAction
                icon={<ImageIcon className="w-4 h-4" />}
                label="Facial Features"
                onClick={() => setMessage("Detailed facial features: ")}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

RuixenMoonChat.displayName = "RuixenMoonChat";

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border-neutral-700 bg-black/50 text-neutral-300 hover:text-white hover:bg-neutral-700"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}

export default RuixenMoonChat;
export type { Message };
