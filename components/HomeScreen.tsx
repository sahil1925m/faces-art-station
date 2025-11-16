import * as React from "react";
import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";
import { mockApiService } from "../services/mockApiService";

interface HomeScreenProps {
  onGenerate?: (prompt: string) => Promise<string>;
  isLoading: boolean;
}

export default function HomeScreen({ isLoading }: HomeScreenProps) {
  const handleGenerate = React.useCallback(async (prompt: string): Promise<string> => {
    try {
      const imageUrl = await mockApiService.generateInitialComposite(prompt);
      return imageUrl;
    } catch (error) {
      console.error("Generation error:", error);
      throw error;
    }
  }, []);

  return (
    <main className="min-h-screen w-full bg-black text-white">
      <RuixenMoonChat onGenerate={handleGenerate} isLoading={isLoading} />
    </main>
  );
}