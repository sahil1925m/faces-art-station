import * as React from "react";
import RuixenMoonChat from "@/components/ui/ruixen-moon-chat";

interface HomeScreenProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export default function HomeScreen({ onGenerate, isLoading }: HomeScreenProps) {
  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col">
      {/* Chat Component */}
      <section className="flex justify-center items-start w-full flex-grow">
        <RuixenMoonChat />
      </section>

      {/* Footer */}
      <footer className="text-center text-neutral-500 py-2 mt-10 border-t border-neutral-800 text-sm">
        © {new Date().getFullYear()} F.A.C.E.S Composite System
      </footer>
    </main>
  );
}