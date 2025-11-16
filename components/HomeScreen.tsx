import * as React from "react";
import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "react-hot-toast";

interface HomeScreenProps {
  onGenerate?: (prompt: string) => Promise<string>;
  isLoading: boolean;
}

export default function HomeScreen({ isLoading }: HomeScreenProps) {
  const handleGenerate = React.useCallback(async (prompt: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-composite', {
        body: { prompt }
      });

      if (error) throw error;
      
      if (!data?.imageUrl) {
        throw new Error("No image returned from generation");
      }

      return data.imageUrl;
    } catch (error) {
      console.error("Generation error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate sketch";
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  return (
    <main className="min-h-screen w-full bg-black text-white">
      <RuixenMoonChat onGenerate={handleGenerate} isLoading={isLoading} />
    </main>
  );
}