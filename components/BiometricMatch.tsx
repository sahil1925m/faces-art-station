import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanFace, Fingerprint, X, ShieldAlert, AlertTriangle, Minus, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

interface BiometricMatchProps {
  sketchUrl: string;
  realImageUrl: string;
}

type MatchLevel = 'strong' | 'probable' | 'weak' | 'none';

function getMatchLevel(score: number): MatchLevel {
  if (score >= 78) return 'strong';
  if (score >= 60) return 'probable';
  if (score >= 40) return 'weak';
  return 'none';
}

const MATCH_STYLES: Record<MatchLevel, { label: string; bar: string; text: string; badge: string }> = {
  strong:   { label: 'STRONG MATCH',      bar: 'bg-teal-500',   text: 'text-teal-400',  badge: 'bg-teal-950/60 border-teal-700/60 text-teal-300' },
  probable: { label: 'PROBABLE MATCH',    bar: 'bg-amber-500',  text: 'text-amber-400', badge: 'bg-amber-950/60 border-amber-700/60 text-amber-300' },
  weak:     { label: 'INCONCLUSIVE',      bar: 'bg-orange-600', text: 'text-orange-400', badge: 'bg-orange-950/60 border-orange-800/60 text-orange-400' },
  none:     { label: 'NO MATCH',          bar: 'bg-red-700',    text: 'text-red-400',   badge: 'bg-red-950/60 border-red-800/60 text-red-400' },
};

const MATCH_ICONS: Record<MatchLevel, React.ReactNode> = {
  strong:   <ShieldAlert size={16} />,
  probable: <ShieldAlert size={16} />,
  weak:     <AlertTriangle size={16} />,
  none:     <Minus size={16} />,
};

export const BiometricMatch: React.FC<BiometricMatchProps> = ({ sketchUrl, realImageUrl }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<{
    match: boolean;
    confidence_score: number;
    cosine_similarity?: number;
    method?: string;
  } | null>(null);

  const handleScan = async () => {
    if (!sketchUrl || !realImageUrl) {
      toast.error('Both sketch and database images are required for comparison.');
      return;
    }
    setIsScanning(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:8000/api/compare-faces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sketch_url: sketchUrl, real_image_url: realImageUrl }),
      });
      if (!response.ok) throw new Error(`Server returned status: ${response.status}`);
      const data = await response.json();
      // Small delay so scan animation is visible
      await new Promise(r => setTimeout(r, 1200));
      setResult(data);
      setShowModal(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to connect to the forensic comparison engine.');
    } finally {
      setIsScanning(false);
    }
  };

  const level = result ? getMatchLevel(result.confidence_score) : 'none';
  const styles = MATCH_STYLES[level];

  return (
    <>
      {/* Trigger */}
      <div>
        {isScanning ? (
          <div className="relative rounded-lg border border-slate-700 bg-slate-900/80 p-4 overflow-hidden flex items-center gap-3 min-h-[56px]">
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
              animate={{ left: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            />
            <Fingerprint size={20} className="text-cyan-400 animate-pulse flex-shrink-0" />
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest animate-pulse">
              Comparing via CLIP embeddings...
            </span>
          </div>
        ) : (
          <button
            onClick={handleScan}
            className="flex items-center gap-2 w-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 px-4 py-2.5 rounded-md text-xs font-mono border border-slate-600 hover:border-cyan-700/60 transition-all group"
          >
            <ScanFace size={15} className="text-cyan-500 group-hover:text-cyan-300 flex-shrink-0" />
            <span className="uppercase tracking-wider">Run Biometric Scan</span>
          </button>
        )}
      </div>

      {/* Results Modal */}
      <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <AnimatePresence>
          {showModal && result && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.97, x: '-50%', y: '-48%' }}
                  animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.97, x: '-50%', y: '-48%' }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="fixed left-1/2 top-1/2 w-[92vw] max-w-2xl bg-[#0D1117] border border-slate-700/80 shadow-2xl shadow-black/60 rounded-xl z-50 focus:outline-none overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert size={18} className="text-cyan-500" />
                      <Dialog.Title className="text-sm font-bold tracking-[0.15em] text-slate-100 uppercase font-mono">
                        Biometric Analysis Report
                      </Dialog.Title>
                    </div>
                    <Dialog.Close asChild>
                      <button className="text-slate-500 hover:text-white hover:bg-slate-800 p-1.5 rounded transition-colors">
                        <X size={16} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Images side-by-side — FIXED: fixed height, no overflow */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'SUBJECT (SKETCH)', src: sketchUrl, tag: 'QUERY' },
                        { label: 'DATABASE RECORD', src: realImageUrl, tag: 'CANDIDATE' },
                      ].map(({ label, src, tag }) => (
                        <div key={tag} className="space-y-1.5">
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">{label}</p>
                          <div className="relative h-44 rounded-lg border border-slate-700/80 overflow-hidden bg-slate-950">
                            <img src={src} alt={label} className="w-full h-full object-contain" />
                            {/* scanline overlay */}
                            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.015)_2px,rgba(255,255,255,0.015)_4px)] pointer-events-none" />
                            <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-slate-600 bg-slate-950/70 px-1.5 py-0.5 rounded">
                              {tag}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Score Bar */}
                    <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-4 space-y-2.5">
                      <div className="flex items-end justify-between">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Similarity Score</span>
                        <span className={`text-2xl font-bold font-mono ${styles.text}`}>
                          {result.confidence_score.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence_score}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
                          className={`h-full ${styles.bar}`}
                        />
                      </div>
                      {/* Threshold markers */}
                      <div className="flex text-[9px] font-mono text-slate-700 justify-between">
                        <span>No match</span>
                        <span className="ml-[35%]">Inconclusive</span>
                        <span>Strong</span>
                      </div>
                    </div>

                    {/* Verdict + metadata row */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className={`inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider border px-3 py-1.5 rounded ${styles.badge}`}>
                        {MATCH_ICONS[level]}
                        {styles.label}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
                        <Cpu size={11} />
                        <span>{result.method ?? 'clip-vit-base-patch32'}</span>
                        {result.cosine_similarity !== undefined && (
                          <span className="text-slate-700">· cos={result.cosine_similarity.toFixed(3)}</span>
                        )}
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[10px] text-slate-700 font-mono border-t border-slate-800 pt-3 leading-relaxed">
                      ⚠ Cross-domain matching (2D pencil sketch → photograph) requires human expert verification. CLIP semantic similarity is indicative only.
                    </p>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </>
  );
};
