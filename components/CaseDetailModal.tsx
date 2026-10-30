import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, FileText, Calendar, Tag, ScanFace, ShieldAlert,
  AlertTriangle, Minus, Cpu, Fingerprint, User, Database
} from 'lucide-react';
import { SuspectRecord } from '../services/supabaseService';

interface CaseDetailModalProps {
  suspect: SuspectRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

interface MatchData {
  match: boolean;
  confidence_score: number;
  cosine_similarity?: number;
  method?: string;
}

type MatchLevel = 'strong' | 'probable' | 'weak' | 'none';

function getMatchLevel(score: number): MatchLevel {
  if (score >= 78) return 'strong';
  if (score >= 60) return 'probable';
  if (score >= 40) return 'weak';
  return 'none';
}

const MATCH_STYLES: Record<MatchLevel, { label: string; bar: string; text: string; badge: string; glow: string }> = {
  strong:   { label: 'STRONG MATCH',   bar: 'bg-teal-500',   text: 'text-teal-400',   badge: 'bg-teal-950/60 border-teal-600/50 text-teal-300',   glow: 'shadow-teal-500/20' },
  probable: { label: 'PROBABLE MATCH', bar: 'bg-amber-500',  text: 'text-amber-400',  badge: 'bg-amber-950/60 border-amber-600/50 text-amber-300',  glow: 'shadow-amber-500/20' },
  weak:     { label: 'INCONCLUSIVE',   bar: 'bg-orange-500', text: 'text-orange-400', badge: 'bg-orange-950/60 border-orange-600/50 text-orange-300', glow: 'shadow-orange-500/20' },
  none:     { label: 'NO MATCH',       bar: 'bg-red-700',    text: 'text-red-400',    badge: 'bg-red-950/60 border-red-700/50 text-red-400',         glow: 'shadow-red-500/10' },
};

const MATCH_ICONS: Record<MatchLevel, React.ReactNode> = {
  strong:   <ShieldAlert size={13} />,
  probable: <ShieldAlert size={13} />,
  weak:     <AlertTriangle size={13} />,
  none:     <Minus size={13} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  known_offender:     'text-red-400 bg-red-950/40 border-red-700/50',
  missing_person:     'text-amber-400 bg-amber-950/40 border-amber-700/50',
  person_of_interest: 'text-cyan-400 bg-cyan-950/40 border-cyan-700/50',
  generated_sketch:   'text-violet-400 bg-violet-950/40 border-violet-700/50',
};

const CATEGORY_LABELS: Record<string, string> = {
  known_offender:     'Known Offender',
  missing_person:     'Missing Person',
  person_of_interest: 'Person of Interest',
  generated_sketch:   'Generated Sketch',
};

// ── Database Match Panel ──────────────────────────────────────────────────────

const DatabaseMatchPanel: React.FC<{ sketchUrl: string; sketchGender?: string }> = ({ sketchUrl, sketchGender }) => {
  const [state, setState] = useState<'idle' | 'scanning' | 'done' | 'error'>('idle');
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [matchedImageUrl, setMatchedImageUrl] = useState<string | null>(null);

  const runScan = async () => {
    setState('scanning');
    setMatchData(null);
    setMatchedImageUrl(null);

    try {
      // Fetch suspects from Supabase via the service
      const { listSuspects, detectGender } = await import('../services/supabaseService');
      const suspects = await listSuspects();
      const candidates = suspects.filter(s => s.image_url && !s.name.startsWith('[SKETCH]'));

      if (candidates.length === 0) {
        setState('error');
        return;
      }

      // Use the provided gender from the record if valid, otherwise auto-detect
      const finalSketchGender = (sketchGender && sketchGender !== 'unknown')
        ? sketchGender
        : await detectGender(sketchUrl);
      
      console.log(`[CaseModal] Sketch gender used for scan: ${finalSketchGender}`);

      let bestScore = -1;
      let bestData: MatchData | null = null;
      let bestImageUrl: string | null = null;

      for (const suspect of candidates) {
        // Skip obvious mismatches if both genders are known
        const suspectGender = suspect.gender ?? 'unknown';
        if (
          finalSketchGender !== 'unknown' &&
          suspectGender !== 'unknown' &&
          finalSketchGender !== suspectGender
        ) {
          continue;
        }

        try {
          const res = await fetch('http://localhost:8000/api/compare-faces', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sketch_url: sketchUrl,
              real_image_url: suspect.image_url,
              sketch_gender: finalSketchGender !== 'unknown' ? finalSketchGender : undefined,
            }),
          });
          if (!res.ok) continue;
          const data: MatchData = await res.json();
          if (data.confidence_score > bestScore) {
            bestScore = data.confidence_score;
            bestData = data;
            bestImageUrl = suspect.image_url;
          }
        } catch { /* skip failed comparisons */ }
      }

      setMatchData(bestData);
      setMatchedImageUrl(bestImageUrl);
      setState('done');
    } catch {
      setState('error');
    }
  };

  if (state === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
        <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
          <Database size={24} className="text-slate-600" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Database Match</p>
          <p className="text-[11px] text-slate-600 font-mono">Run a biometric scan to find the closest match</p>
        </div>
        <button
          onClick={runScan}
          className="flex items-center gap-2 bg-cyan-700/20 hover:bg-cyan-700/30 text-cyan-300 border border-cyan-700/50 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
        >
          <ScanFace size={13} />
          Run Biometric Scan
        </button>
      </div>
    );
  }

  if (state === 'scanning') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-t-cyan-500 border-transparent"
          />
          <Fingerprint size={22} className="absolute inset-0 m-auto text-cyan-500 animate-pulse" />
        </div>
        <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest animate-pulse">Scanning database...</p>
        <p className="text-[11px] text-slate-600 font-mono">Comparing CLIP embeddings</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
        <AlertTriangle size={28} className="text-red-500/60" />
        <p className="text-xs font-mono text-slate-500">No candidates found or backend unavailable.</p>
        <button onClick={runScan} className="text-[11px] text-cyan-600 hover:text-cyan-400 font-mono underline underline-offset-2">Retry</button>
      </div>
    );
  }

  // Done state
  const level = matchData ? getMatchLevel(matchData.confidence_score) : 'none';
  const styles = MATCH_STYLES[level];

  return (
    <div className="space-y-3">
      {/* Matched image */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950 aspect-[4/3]">
        {matchedImageUrl ? (
          <img src={matchedImageUrl} alt="Best DB Match" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700"><User size={40} /></div>
        )}
        {/* Scanline overlay */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.012)_2px,rgba(255,255,255,0.012)_4px)] pointer-events-none" />
        <span className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 bg-slate-950/80 px-1.5 py-0.5 rounded">BEST CANDIDATE</span>
      </div>

      {/* Score section */}
      <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 space-y-2">
        <div className="flex items-end justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Similarity Score</span>
          <span className={`text-xl font-bold font-mono ${styles.text}`}>
            {matchData ? matchData.confidence_score.toFixed(1) : '—'}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${matchData?.confidence_score ?? 0}%` }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className={`h-full ${styles.bar}`}
          />
        </div>
        <div className="flex text-[9px] font-mono text-slate-700 justify-between">
          <span>No match</span>
          <span>Inconclusive</span>
          <span>Strong</span>
        </div>
      </div>

      {/* Verdict */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border px-2.5 py-1 rounded-md ${styles.badge}`}>
          {MATCH_ICONS[level]}
          {styles.label}
        </span>
        {matchData?.method && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
            <Cpu size={10} />
            {matchData.method}
          </span>
        )}
      </div>

      <button
        onClick={runScan}
        className="w-full text-[11px] font-mono text-slate-600 hover:text-slate-400 transition-colors underline underline-offset-2"
      >
        Re-run scan
      </button>
    </div>
  );
};

// ── Main Modal ────────────────────────────────────────────────────────────────

const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ suspect, isOpen, onClose }) => {
  if (!suspect) return null;

  const category = suspect.category ?? 'person_of_interest';
  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const categoryColor = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.person_of_interest;
  const createdDate = new Date(suspect.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const createdTime = new Date(suspect.created_at).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
              />
            </Dialog.Overlay>

            {/* Card */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: '-50%', y: 'calc(-50% + 24px)' }}
                animate={{ opacity: 1, scale: 1,    x: '-50%', y: '-50%' }}
                exit={{   opacity: 0, scale: 0.96,  x: '-50%', y: 'calc(-50% + 24px)' }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-4xl focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(15,20,32,0.95) 0%, rgba(10,14,24,0.97) 100%)',
                  border: '1px solid rgba(71, 85, 105, 0.4)',
                  borderRadius: '16px',
                  boxShadow: '0 0 0 1px rgba(34,211,238,0.05), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(34,211,238,0.04)',
                  backdropFilter: 'blur(24px)',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60"
                  style={{ background: 'rgba(15,23,42,0.6)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <FileText size={15} className="text-cyan-400" />
                    </div>
                    <div>
                      <Dialog.Title className="text-sm font-bold text-slate-100 font-mono tracking-wide">
                        CASE FILE — SUBJECT RECORD
                      </Dialog.Title>
                      <p className="text-[10px] text-slate-600 font-mono mt-0.5">ID: {suspect.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all">
                      <X size={15} />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Body: 3-column grid on larger screens */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1.2fr] gap-6">

                  {/* Column 1 — Sketch / Subject Photo */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Subject Image</p>
                    <div className="relative rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950 aspect-[3/4]"
                      style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
                      {suspect.image_url ? (
                        <img src={suspect.image_url} alt={suspect.name} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-700">
                          <User size={48} />
                        </div>
                      )}
                      {/* Corner brackets */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500/60 rounded-tl" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500/60 rounded-tr" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500/60 rounded-bl" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500/60 rounded-br" />
                    </div>
                    {/* Category badge */}
                    <div className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-widest border px-2.5 py-1.5 rounded-lg w-full justify-center ${categoryColor}`}>
                      <Tag size={10} />
                      {categoryLabel}
                    </div>
                  </div>

                  {/* Column 2 — Case Info */}
                  <div className="space-y-5">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Case Details</p>

                    {/* Subject name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Subject Name</label>
                      <p className="text-lg font-bold text-slate-100 leading-tight">{suspect.name}</p>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-800/60" />

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
                        <FileText size={10} />
                        Notes / Description
                      </label>
                      <div className="bg-slate-900/50 border border-slate-800/60 rounded-lg p-3 min-h-[80px]"
                        style={{ backdropFilter: 'blur(8px)' }}>
                        {suspect.description ? (
                          <p className="text-sm text-slate-300 leading-relaxed">{suspect.description}</p>
                        ) : (
                          <p className="text-xs text-slate-600 italic font-mono">No description provided.</p>
                        )}
                      </div>
                    </div>

                    {/* Metadata grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                          <Calendar size={10} />
                          Created
                        </div>
                        <p className="text-xs font-mono text-slate-300">{createdDate}</p>
                        <p className="text-[10px] font-mono text-slate-600">{createdTime}</p>
                      </div>
                      <div className="bg-slate-900/40 border border-slate-800/50 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                          <Tag size={10} />
                          Category
                        </div>
                        <p className={`text-xs font-mono font-semibold ${categoryColor.split(' ')[0]}`}>{categoryLabel}</p>
                      </div>
                    </div>

                    {/* Record ID */}
                    <div className="bg-slate-900/30 border border-slate-800/40 rounded-lg p-3">
                      <label className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Record ID</label>
                      <p className="text-[11px] font-mono text-slate-500 mt-1 break-all">{suspect.id}</p>
                    </div>
                  </div>

                  {/* Column 3 — Database Match */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Database size={10} />
                      Database Match
                    </p>
                    {suspect.image_url ? (
                      <DatabaseMatchPanel sketchUrl={suspect.image_url} sketchGender={suspect.gender} />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <AlertTriangle size={24} className="text-slate-700" />
                        <p className="text-xs font-mono text-slate-600 text-center">No image available for comparison.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-800/50 flex items-center justify-between"
                  style={{ background: 'rgba(15,23,42,0.4)' }}>
                  <p className="text-[10px] font-mono text-slate-700">
                    ⚠ Forensic data is sensitive. Verify all matches with qualified personnel.
                  </p>
                  <Dialog.Close asChild>
                    <button className="text-xs font-mono text-slate-500 hover:text-slate-300 border border-slate-700/50 hover:border-slate-600 px-3 py-1.5 rounded-md transition-all">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default CaseDetailModal;
