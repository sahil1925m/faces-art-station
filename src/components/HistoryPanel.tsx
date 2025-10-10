import { Clock } from "lucide-react";
import compositeFace from "@/assets/composite-face-placeholder.jpg";

export const HistoryPanel = () => {
  const versions = [
    { id: 1, timestamp: "10:45 AM", label: "Initial" },
    { id: 2, timestamp: "10:52 AM", label: "Refined" },
    { id: 3, timestamp: "11:03 AM", label: "Current" },
  ];

  return (
    <div className="w-80 h-full bg-gradient-panel border-l border-panel-border p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            <h2 className="text-lg font-semibold text-foreground">Version History</h2>
          </div>
          <p className="text-sm text-muted-foreground">Click to revert to previous versions</p>
        </div>

        {/* Version List */}
        <div className="space-y-3">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={`group relative rounded-lg border transition-smooth cursor-pointer ${
                index === versions.length - 1
                  ? "border-accent bg-accent/10 shadow-glow"
                  : "border-border hover:border-accent/50 hover:bg-muted/50"
              }`}
            >
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{version.label}</span>
                  <span className="text-xs text-muted-foreground">{version.timestamp}</span>
                </div>
                <img
                  src={compositeFace}
                  alt={`Version ${version.id}`}
                  className="w-full aspect-square object-cover rounded border border-border"
                />
              </div>
              {index === versions.length - 1 && (
                <div className="absolute -top-2 -right-2 px-2 py-1 bg-accent text-primary-foreground text-xs font-bold rounded-full">
                  ACTIVE
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Database Section */}
        <div className="pt-4 border-t border-panel-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Database Matches</h3>
          <div className="text-center py-8 px-4 rounded-lg border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No database integration configured</p>
          </div>
        </div>
      </div>
    </div>
  );
};
