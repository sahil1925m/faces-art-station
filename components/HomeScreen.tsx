import * as React from "react";
import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";

interface HomeScreenProps {
  onGenerate?: (prompt: string) => Promise<string>;
  isLoading: boolean;
}

export default function HomeScreen({ onGenerate, isLoading }: HomeScreenProps) {
  return (
    <main className="min-h-screen w-full bg-black text-white">
      <RuixenMoonChat onGenerate={onGenerate} isLoading={isLoading} />
    </main>
  );
}