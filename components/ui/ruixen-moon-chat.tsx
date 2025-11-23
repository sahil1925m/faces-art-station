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
import { motion, AnimatePresence } from "framer-motion";

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
      minHeight: 52,
      maxHeight: 200,
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
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
        {/* Full Screen Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_moon_2.png')",
          }}
        />

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full w-full max-w-5xl mx-auto px-4 md:px-6">

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-6"
                >
                  <div className="space-y-2">
                    <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                      F.A.C.E.S
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100/80 font-light tracking-wide">
                      Forensic Artificial Composite Engine System
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md max-w-md"
                  >
                    <p className="text-neutral-200 leading-relaxed">
                      Describe the suspect's facial features, age, and other identifying details to generate a high-fidelity forensic sketch.
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex w-full",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] md:max-w-[70%] rounded-2xl p-5 shadow-lg backdrop-blur-sm",
                        msg.role === "user"
                          ? "bg-blue-600/90 text-white rounded-br-none"
                          : "bg-neutral-900/80 border border-white/10 text-neutral-100 rounded-bl-none"
                      )}
                    >
                      <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      {msg.imageUrl && (
                        <motion.div
                          initial={{ opacity: 0, filter: "blur(10px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          transition={{ duration: 0.8 }}
                          className="mt-4 overflow-hidden rounded-xl border border-white/10"
                        >
                          <img
                            src={msg.imageUrl}
                            alt="Generated sketch"
                            className="w-full h-auto object-cover"
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-neutral-900/80 border border-white/10 text-neutral-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-3 backdrop-blur-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                    <p className="text-sm font-medium text-blue-200">Generating forensic composite...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {/* Input Area */}
          <div className="w-full pb-8 pt-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/5"
            >
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Describe the suspect (e.g., 'Male, 40s, square jaw, scar on left cheek')..."
                disabled={isLoading}
                className={cn(
                  "w-full px-5 py-4 resize-none border-none",
                  "bg-transparent text-white text-base",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-neutral-400/70 min-h-[52px]",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                style={{ overflow: "hidden" }}
              />

              {/* Footer Buttons */}
              <div className="flex items-center justify-between px-4 pb-3 pt-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300",
                    message.trim() && !isLoading
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                      : "bg-white/10 text-neutral-500 cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowUpIcon className="w-5 h-5" />
                  )}
                  <span className="font-medium">Generate</span>
                </Button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <AnimatePresence>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center flex-wrap gap-3 mt-6"
                >
                  <QuickAction
                    icon={<CircleUserRound className="w-4 h-4" />}
                    label="Male, 30s"
                    onClick={() => setMessage("Male, approximately 30 years old, ")}
                    delay={0.1}
                  />
                  <QuickAction
                    icon={<CircleUserRound className="w-4 h-4" />}
                    label="Female, 20s"
                    onClick={() => setMessage("Female, approximately 20 years old, ")}
                    delay={0.2}
                  />
                  <QuickAction
                    icon={<ImageIcon className="w-4 h-4" />}
                    label="Facial Features"
                    onClick={() => setMessage("Detailed facial features: ")}
                    delay={0.3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
  delay?: number;
}

function QuickAction({ icon, label, onClick, delay = 0 }: QuickActionProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-neutral-300 backdrop-blur-md transition-colors hover:text-white"
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}

export default RuixenMoonChat;
export type { Message };
