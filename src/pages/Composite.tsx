import { useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { FaceCanvas } from "@/components/FaceCanvas";
import { HistoryPanel } from "@/components/HistoryPanel";
import { toast } from "sonner";

const Index = () => {
  const [description, setDescription] = useState("");

  const handleGenerate = () => {
    if (!description.trim()) {
      toast.error("Please enter a witness description");
      return;
    }
    toast.success("Generating composite from description...", {
      description: "This may take a few moments",
    });
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* Left Panel: Control Hub */}
      <div className="w-96">
        <ControlPanel
          description={description}
          onDescriptionChange={setDescription}
          onGenerate={handleGenerate}
        />
      </div>

      {/* Center Panel: Face Canvas */}
      <FaceCanvas />

      {/* Right Panel: History & Intelligence */}
      <HistoryPanel />
    </div>
  );
};

export default Index;
