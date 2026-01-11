import * as React from 'react';
import { HistoryEntry, FeatureCategory, DbMatch } from './types';
import { mockApiService } from './services/mockApiService';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import ControlPanel from './components/ControlPanel';
import Canvas from './components/Canvas';
import HistoryPanel from './components/HistoryPanel';
import { Toaster, toast } from 'react-hot-toast';
import RefinementPrompt from './components/RefinementPrompt';
import jsPDF from 'jspdf';
import DatabaseMatchModal from './components/DatabaseMatchModal';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from './components/DashboardLayout';
import ResizableSplitPane from './components/ResizableSplitPane';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/chat/ChatInterface'; // Use ChatInterface for the interview part

const App: React.FC = () => {
  // 'LANDING' -> 'INTERVIEW' (ChatInterface) -> 'DASHBOARD' (Canvas/Refine)
  const [view, setView] = React.useState<'LANDING' | 'INTERVIEW' | 'DASHBOARD'>('LANDING');

  // Existing state
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState<string>('');
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [initialPrompt, setInitialPrompt] = React.useState('');
  const [currentPrompt, setCurrentPrompt] = React.useState('');
  const [seed, setSeed] = React.useState<number>(0);
  const [caseNumber, setCaseNumber] = React.useState('');
  const [isSearchingDb, setIsSearchingDb] = React.useState(false);
  const [dbMatches, setDbMatches] = React.useState<DbMatch[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);

  // Called when "Start Interview" is clicked on Landing Page
  const startInterview = () => {
    setView('INTERVIEW');
  };

  // Called when Chat Interface completes interview
  const handleGenerateInitialComposite = React.useCallback(async (prompt: string) => {
    setIsLoading(true);
    setInitialPrompt(prompt);
    setCurrentPrompt(prompt);

    const newSeed = Math.floor(Math.random() * 1000000);
    setSeed(newSeed);

    const toastId = toast.loading("Generating initial composite sketch...");
    try {
      // Switch view immediately or after generation? 
      // Let's generate first then switch, or show loading state.
      // Since we want to show result on dashboard, we switch to DASHBOARD but keep loading state if possible,
      // OR we wait for generation. 
      // Existing logic waits. Let's switch view to DASHBOARD immediately so user sees the skeleton UI?
      // Actually, better to stay on chat until generated or show a transition.
      // Let's follow existing logic: call API, then switch.

      const imageUrl = await mockApiService.generateInitialComposite(prompt, newSeed);
      setCurrentImage(imageUrl);
      const newHistoryEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        imageUrl,
        change: 'Initial Composite Generated',
      };
      setHistory([newHistoryEntry]);

      setView('DASHBOARD'); // Switch to main dashboard

      toast.success("Initial composite generated!", { id: toastId });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate composite. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBatchRefinement = React.useCallback(async (
    refinements: { category: FeatureCategory; featureName: string; prompt: string }[]
  ) => {
    if (refinements.length === 0) return;

    setIsLoading(true);
    const description = `Applied ${refinements.length} refinements: ${refinements.map(r => r.featureName).join(', ')}`;
    const toastId = toast.loading(`Applying ${refinements.length} refinements...`);

    try {
      // Combine prompts
      const combinedRefinementPrompt = refinements.map(r => r.prompt).join(', ');
      const category = refinements.length === 1 ? refinements[0].category : 'inferred';

      const { imageUrl: newImageUrl, updatedPrompt } = await mockApiService.refineFeature(
        currentImage,
        currentPrompt,
        seed,
        category,
        combinedRefinementPrompt
      );

      setCurrentImage(newImageUrl);
      setCurrentPrompt(updatedPrompt);

      const newHistoryEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        imageUrl: newImageUrl,
        change: description,
      };
      setHistory(prev => [newHistoryEntry, ...prev]);
      toast.success("Refinements complete!", { id: toastId });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Refinement failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }, [currentPrompt, seed, currentImage]);

  const handleRefinement = React.useCallback(async (
    featureCategory: FeatureCategory | 'inferred',
    changeDescription: string,
    featurePrompt: string
  ) => {
    if (changeDescription.trim().length === 0) {
      toast.error("Please enter a description to apply refinements.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading(`Applying refinement: ${changeDescription}...`);
    try {
      const { imageUrl: newImageUrl, updatedPrompt } = await mockApiService.refineFeature(
        currentImage,
        currentPrompt,
        seed,
        featureCategory,
        featurePrompt
      );

      setCurrentImage(newImageUrl);
      setCurrentPrompt(updatedPrompt);

      const newHistoryEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        imageUrl: newImageUrl,
        change: changeDescription,
      };
      setHistory(prev => [newHistoryEntry, ...prev]);
      toast.success("Refinement complete!", { id: toastId });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Refinement failed. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }, [currentPrompt, seed, currentImage]);

  const handleHistorySelect = React.useCallback((entry: HistoryEntry) => {
    if (isLoading) return;
    setCurrentImage(entry.imageUrl);
    toast.success("Restored state from history.");
  }, [isLoading]);

  const handleExportToPdf = async () => {
    if (!currentImage) {
      toast.error("No image to export.");
      return;
    }
    const toastId = toast.loading("Generating PDF report...");

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;

      // Background
      doc.setFillColor("#000000");
      doc.rect(0, 0, pageWidth, pageHeight, 'F');


      // Title
      doc.setFontSize(22);
      doc.setTextColor('#6366f1'); // Indigo
      doc.text("F.A.C.E.S. Forensic Report", margin, margin + 5);

      // Case Info
      doc.setFontSize(12);
      doc.setTextColor('#e2e8f0'); // Slate 200
      doc.text(`Case Number: ${caseNumber || 'N/A'}`, margin, margin + 20);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, margin + 27);

      // Image
      const img = new Image();
      img.src = currentImage;
      img.crossOrigin = 'Anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const imgProps = doc.getImageProperties(img.src);
      const imgWidth = 100;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      doc.addImage(img, 'JPEG', (pageWidth - imgWidth) / 2, margin + 35, imgWidth, imgHeight);

      let yPos = margin + 35 + imgHeight + 15;

      // Witness Description
      doc.setFontSize(14);
      doc.setTextColor('#6366f1');
      doc.text("Witness Description (Initial Prompt)", margin, yPos);
      yPos += 7;
      doc.setFontSize(10);
      doc.setTextColor('#f8fafc');
      const splitDescription = doc.splitTextToSize(initialPrompt, pageWidth - margin * 2);
      doc.text(splitDescription, margin, yPos);
      yPos += (splitDescription.length * 4) + 10;

      // Refinement History
      doc.setFontSize(14);
      doc.setTextColor('#6366f1');
      doc.text("Refinement History", margin, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setTextColor('#f8fafc');
      [...history].reverse().forEach(entry => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          doc.setFillColor("#000000");
          doc.rect(0, 0, pageWidth, pageHeight, 'F');
          yPos = margin;
        }
        const line = `${entry.timestamp} - ${entry.change}`;
        const splitLine = doc.splitTextToSize(line, pageWidth - margin * 2);
        doc.text(splitLine, margin, yPos);
        yPos += (splitLine.length * 4) + 2;
      });

      doc.save(`FACES_Report_${caseNumber || 'Untitled'}.pdf`);
      toast.success("Report exported successfully!", { id: toastId });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Could not generate PDF report.", { id: toastId });
    }
  };

  const handleDatabaseSearch = async () => {
    if (!currentImage) {
      toast.error("No image to search.");
      return;
    }
    setIsSearchingDb(true);
    setIsSearchModalOpen(true);
    setDbMatches([]);
    try {
      const matches = await mockApiService.searchDatabase(currentImage);
      setDbMatches(matches);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Database search failed.";
      toast.error(errorMessage);
      setIsSearchModalOpen(false); // Close modal on error
    } finally {
      setIsSearchingDb(false);
    }
  };


  const resetToPrompt = () => {
    setView('LANDING'); // Go back to landing page? Or Interview? let's go to Landing for full reset.
    // Or maybe just back to interview? 
    // "Reset" usually implies starting similar workflow. Let's go to INTERVIEW.
    // But if we want 'Home', maybe LANDING is better. 
    // Let's stick to Landing for "New Case".
    setView('LANDING');
    setCurrentImage('');
    setHistory([]);
    setInitialPrompt('');
    setCaseNumber('');
    setDbMatches([]);
    setIsSearchModalOpen(false);
  };

  const [mobileTab, setMobileTab] = React.useState<'VIEW' | 'EDIT' | 'HISTORY'>('VIEW');

  const renderContent = () => {
    switch (view) {
      case 'LANDING':
        return <LandingPage onStart={startInterview} />;
      case 'INTERVIEW':
        return (
          <div className="h-full w-full flex items-center justify-center p-4">
            <ChatInterface onGenerate={handleGenerateInitialComposite} isLoading={isLoading} />
          </div>
        );
      case 'DASHBOARD':
        return (
          <div className="h-full flex flex-col overflow-hidden relative z-10">
            {/* Desktop Layout (lg+) */}
            <div className="hidden lg:block h-full">
              <DashboardLayout
                leftSidebar={
                  <ControlPanel
                    onVisualRefine={handleBatchRefinement}
                    isLoading={isLoading}
                  />
                }
                centerPanel={
                  <>
                    <ResizableSplitPane
                      initialTopHeight="70%"
                      top={
                        <div className="w-full h-full pb-2">
                          <Canvas
                            currentImage={currentImage}
                            isLoading={isLoading}
                          />
                        </div>
                      }
                      bottom={
                        <div className="w-full h-full pt-2 overflow-y-auto custom-scrollbar">
                          <RefinementPrompt
                            onRefine={(prompt) => handleRefinement('inferred', prompt, prompt)}
                            isLoading={isLoading}
                          />
                        </div>
                      }
                    />
                  </>
                }
                rightSidebar={
                  <HistoryPanel history={history} onSelectHistory={handleHistorySelect} />
                }
              />
            </div>

            {/* Mobile Layout (< lg) */}
            <div className="lg:hidden flex-1 flex flex-col min-h-0 overflow-hidden relative">
              <div className="flex-1 overflow-hidden p-1">
                <AnimatePresence mode="wait">
                  {mobileTab === 'VIEW' && (
                    <motion.div
                      key="view"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full flex flex-col gap-2"
                    >
                      <div className="flex-1 min-h-0">
                        <Canvas currentImage={currentImage} isLoading={isLoading} />
                      </div>
                      <div className="flex-shrink-0">
                        <RefinementPrompt
                          onRefine={(prompt) => handleRefinement('inferred', prompt, prompt)}
                          isLoading={isLoading}
                        />
                      </div>
                    </motion.div>
                  )}

                  {mobileTab === 'EDIT' && (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <ControlPanel
                        onVisualRefine={handleBatchRefinement}
                        isLoading={isLoading}
                      />
                    </motion.div>
                  )}

                  {mobileTab === 'HISTORY' && (
                    <motion.div
                      key="history"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <HistoryPanel history={history} onSelectHistory={handleHistorySelect} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Bottom Navigation */}
              <div className="flex-shrink-0 mt-2 bg-black/80 backdrop-blur-md border-t border-white/10 p-2 rounded-t-2xl">
                <div className="flex justify-around items-center">
                  <button
                    onClick={() => setMobileTab('EDIT')}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${mobileTab === 'EDIT' ? 'text-primary bg-white/10' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span className="text-[10px] font-medium">Controls</span>
                  </button>

                  <button
                    onClick={() => setMobileTab('VIEW')}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${mobileTab === 'VIEW' ? 'text-primary bg-white/10' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] font-medium">Canvas</span>
                  </button>

                  <button
                    onClick={() => setMobileTab('HISTORY')}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${mobileTab === 'HISTORY' ? 'text-primary bg-white/10' : 'text-white/50 hover:text-white/80'}`}
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-medium">History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground h-screen flex flex-col antialiased overflow-hidden relative">
      {/* Background Glow Effect */}
      <div className="fixed inset-0 pointer-events-none bg-glow-blue z-0" />

      <Toaster position="top-center" toastOptions={{
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))'
        },
      }} />
      <div className="relative z-10 w-full">
        {/* Only show header in Dashboard/Interview modes if desired, but kept for all for now or maybe hide on Landing */}
        {view !== 'LANDING' && (
          <Header
            onReset={resetToPrompt}
            showControls={view === 'DASHBOARD'}
            onExport={handleExportToPdf}
            caseNumber={caseNumber}
            onCaseNumberChange={setCaseNumber}
            onSearch={handleDatabaseSearch}
            isSearchEnabled={!!currentImage && !isLoading && !isSearchingDb}
          />
        )}
      </div>
      <main className={`flex-grow flex flex-col ${view !== 'LANDING' ? 'p-4 pt-0' : ''} overflow-hidden relative z-10`}>
        {renderContent()}
      </main>
      {isSearchModalOpen && (
        <DatabaseMatchModal
          matches={dbMatches}
          isSearching={isSearchingDb}
          onClose={() => setIsSearchModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;