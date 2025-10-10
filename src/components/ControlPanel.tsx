import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sparkles } from "lucide-react";

interface ControlPanelProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  onGenerate: () => void;
}

export const ControlPanel = ({ description, onDescriptionChange, onGenerate }: ControlPanelProps) => {
  return (
    <div className="h-full bg-gradient-panel border-r border-panel-border p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Control Hub</h2>
          <p className="text-sm text-muted-foreground">Generate and refine composite</p>
        </div>

        {/* Initial Input */}
        <div className="space-y-3">
          <Label htmlFor="witness-description" className="text-foreground">Witness Description</Label>
          <Textarea
            id="witness-description"
            placeholder="Enter detailed witness description here... (e.g., 'Male, approximately 30 years old, short dark hair, medium build, clean-shaven')"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="min-h-[120px] bg-input border-border text-foreground resize-none focus:ring-2 focus:ring-accent transition-smooth"
          />
          <Button 
            onClick={onGenerate}
            className="w-full bg-gradient-accent text-primary-foreground hover:shadow-glow transition-smooth font-semibold"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Initial Composite
          </Button>
        </div>

        {/* Refinement Tools */}
        <div className="space-y-6 pt-4 border-t border-panel-border">
          <h3 className="text-sm font-semibold text-foreground">Refinement Tools</h3>
          
          {/* Global Adjustments */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Age</Label>
              <Slider
                defaultValue={[30]}
                max={80}
                min={18}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-foreground">Build (Weight)</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>
          </div>

          {/* Facial Structure */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Facial Structure</h4>
            
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Jawline Width</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-foreground">Chin Shape</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-foreground">Forehead Height</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>
          </div>

          {/* Eye Features */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Eye Features</h4>
            
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Eye Size</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-foreground">Eye Spacing</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>
          </div>

          {/* Nose Features */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nose Features</h4>
            
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Nose Width</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-foreground">Nose Length</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>
          </div>

          {/* Mouth Features */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mouth Features</h4>
            
            <div className="space-y-2">
              <Label className="text-sm text-foreground">Lip Thickness</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-foreground">Mouth Width</Label>
              <Slider
                defaultValue={[50]}
                max={100}
                min={0}
                step={1}
                className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-glow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
