import { Button } from "@/components/ui/button";
import { Download, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import compositeFace from "@/assets/composite-face-placeholder.jpg";

export const FaceCanvas = () => {
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Top Action Bar */}
      <div className="border-b border-panel-border p-4 bg-gradient-panel">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            F.A.C.E.S. <span className="text-accent">AI Composite System</span>
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
              <ZoomIn className="h-4 w-4 mr-2" />
              Zoom In
            </Button>
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
              <ZoomOut className="h-4 w-4 mr-2" />
              Zoom Out
            </Button>
            <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
          <img
            src={compositeFace}
            alt="AI Generated Composite"
            className="relative w-[600px] h-[600px] rounded-lg shadow-2xl object-cover border-2 border-accent/50 transition-smooth hover:border-accent"
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-panel-border p-4 bg-gradient-panel">
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Variations
          </Button>
          <Button className="bg-gradient-accent text-primary-foreground hover:shadow-glow transition-smooth font-semibold px-8">
            <Download className="h-4 w-4 mr-2" />
            Export Final Image
          </Button>
        </div>
      </div>
    </div>
  );
};
