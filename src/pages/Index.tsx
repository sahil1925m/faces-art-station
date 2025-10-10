import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Shield, Clock, Database, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-panel-border">
        <div className="absolute inset-0 bg-gradient-panel opacity-50" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Next-Generation Forensic Technology</span>
            </div>
            
            <h1 className="text-6xl font-bold text-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              F.A.C.E.S.
            </h1>
            <p className="text-3xl text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Forensic AI Composite Evolution System
            </p>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Transform witness descriptions into photorealistic composites instantly with AI-powered technology. 
              Built for law enforcement professionals who demand accuracy, speed, and reliability.
            </p>
            
            <div className="flex gap-4 justify-center pt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/composite">
                <Button size="lg" className="bg-gradient-accent text-primary-foreground hover:shadow-glow transition-smooth font-semibold px-8 text-lg h-14">
                  Launch Composite Tool
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted h-14 px-8 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Why F.A.C.E.S.?</h2>
          <p className="text-xl text-muted-foreground">Professional-grade tools designed for critical investigations</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-panel border-panel-border hover:border-accent/50 transition-smooth hover-scale group">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-smooth">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Instant Generation</h3>
            <p className="text-muted-foreground">
              Transform witness descriptions into detailed composites in seconds, not hours. No artistic skills required.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-panel border-panel-border hover:border-accent/50 transition-smooth hover-scale group">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-smooth">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Precision Control</h3>
            <p className="text-muted-foreground">
              Fine-tune every facial feature with intuitive sliders. Adjust age, structure, and distinctive features in real-time.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-panel border-panel-border hover:border-accent/50 transition-smooth hover-scale group">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-smooth">
              <Clock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Version History</h3>
            <p className="text-muted-foreground">
              Never lose progress. Instantly revert to previous versions or compare multiple iterations side-by-side.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-panel border-panel-border hover:border-accent/50 transition-smooth hover-scale group">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-smooth">
              <Database className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Database Integration</h3>
            <p className="text-muted-foreground">
              Seamlessly connect with existing law enforcement databases for automated facial recognition matching.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-panel border-panel-border hover:border-accent/50 transition-smooth hover-scale group">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-smooth">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Variations</h3>
            <p className="text-muted-foreground">
              Generate multiple variations instantly to help witnesses identify the most accurate representation.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-panel border-panel-border hover:border-accent/50 transition-smooth hover-scale group">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-smooth">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Collaborative Workflow</h3>
            <p className="text-muted-foreground">
              Work with witnesses in real-time, making adjustments based on immediate feedback for higher accuracy.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-panel-border bg-gradient-panel py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Simple. Powerful. Professional.</h2>
            <p className="text-xl text-muted-foreground">From description to composite in three steps</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex gap-6 items-start animate-fade-in">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Enter Description</h3>
                <p className="text-lg text-muted-foreground">
                  Input witness testimony or detailed descriptions. Use natural language—our AI understands context and nuance.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Refine & Adjust</h3>
                <p className="text-lg text-muted-foreground">
                  Use precision sliders to adjust facial features in real-time. See changes instantly as you dial in the perfect match.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-accent text-primary-foreground flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Export & Share</h3>
                <p className="text-lg text-muted-foreground">
                  Export high-resolution images for distribution, database matching, or media release. Case-ready quality, every time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
            <Card className="relative p-12 bg-gradient-panel border-accent/50">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Ready to Transform Your Investigations?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join law enforcement agencies using F.A.C.E.S. to solve cases faster and more accurately.
              </p>
              <Link to="/composite">
                <Button size="lg" className="bg-gradient-accent text-primary-foreground hover:shadow-glow transition-smooth font-semibold px-12 text-lg h-14">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-panel-border py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2025 F.A.C.E.S. - Forensic AI Composite Evolution System. Built for Law Enforcement Professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
