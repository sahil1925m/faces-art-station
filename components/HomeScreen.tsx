import * as React from "react";
// import InterviewWizard from "@/components/interview/InterviewWizard"; // Deprecated
import ChatInterface from "./chat/ChatInterface";

interface HomeScreenProps {
  onGenerate: (prompt: string) => Promise<string>;
  isLoading: boolean;
}

export default function HomeScreen({ onGenerate, isLoading }: HomeScreenProps) {
  return (
    <main className="fixed inset-0 w-full h-full bg-black text-white overflow-hidden">
      {/* Background - you might want to replace this with a real image or a better gradient */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop')", // Cyberpunk/High-tech vibe
          filter: 'blur(8px)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      <div className="relative z-10 w-full h-full flex flex-col">
        <ChatInterface onGenerate={onGenerate} isLoading={isLoading} />
      </div>
    </main>
  );
}