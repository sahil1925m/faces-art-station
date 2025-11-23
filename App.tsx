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
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const [step, setStep] = React.useState<'PROMPT' | 'REFINE'>('PROMPT');
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState<string>('');
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [initialPrompt, setInitialPrompt] = React.useState('');
  const [caseNumber, setCaseNumber] = React.useState('');
  const [isSearchingDb, setIsSearchingDb] = React.useState(false);
  const [dbMatches, setDbMatches] = React.useState<DbMatch[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = React.useState(false);


  const handleGenerateInitialComposite = React.useCallback(async (prompt: string) => {
    setIsLoading(true);
    setInitialPrompt(prompt);
    const toastId = toast.loading("Generating initial composite sketch...");
    try {
      const imageUrl = await mockApiService.generateInitialComposite(prompt);
      setCurrentImage(imageUrl);
      const newHistoryEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        imageUrl,
        change: 'Initial Composite Generated',
      };
      setHistory([newHistoryEntry]);
      setStep('REFINE');
      toast.success("Initial composite generated!", { id: toastId });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate composite. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      const newImageUrl = await mockApiService.refineFeature(currentImage, featureCategory, featurePrompt);
      // Append timestamp to force browser to reload image if URL is the same
      const separator = newImageUrl.includes('?') ? '&' : '?';
      const imageUrlWithCacheBust = `${newImageUrl}${separator}t=${Date.now()}`;
      setCurrentImage(imageUrlWithCacheBust);

      const newHistoryEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        imageUrl: imageUrlWithCacheBust,
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
  }, [currentImage]);


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
    setStep('PROMPT');
    setCurrentImage('');
    setHistory([]);
    setInitialPrompt('');
    setCaseNumber('');
    setDbMatches([]);
    setIsSearchModalOpen(false);
  };

  const renderContent = () => {
    switch (step) {
      case 'PROMPT':
        return <HomeScreen onGenerate={handleGenerateInitialComposite} isLoading={isLoading} />;
      case 'REFINE':
        return (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-4 h-full overflow-hidden relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Panel: Controls */}
            <div className="h-full overflow-hidden">
              <ControlPanel
                onVisualRefine={(cat, name, prompt) => handleRefinement(cat, `Set ${name}`, prompt)}
                isLoading={isLoading}
              />
            </div>

            {/* Center Panel: Canvas & Prompt */}
            <div className="flex flex-col gap-4 h-full overflow-hidden">
              <div className="flex-1 min-h-0">
                <Canvas
                  currentImage={currentImage}
                  isLoading={isLoading}
                />
              </div>
              <div className="flex-shrink-0">
                <RefinementPrompt
                  onRefine={(prompt) => handleRefinement('inferred', prompt, prompt)}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Right Panel: History */}
            <div className="h-full overflow-hidden">
              <HistoryPanel history={history} onSelectHistory={handleHistorySelect} />
            </div>
          </motion.div>
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
        <Header
          onReset={resetToPrompt}
          showControls={step === 'REFINE'}
          onExport={handleExportToPdf}
          caseNumber={caseNumber}
          onCaseNumberChange={setCaseNumber}
          onSearch={handleDatabaseSearch}
          isSearchEnabled={!!currentImage && !isLoading && !isSearchingDb}
        />
      </div>
      <main className="flex-grow flex flex-col p-4 pt-0 overflow-hidden relative z-10">
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