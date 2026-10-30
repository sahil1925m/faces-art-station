import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Loader2, Mars, Venus, CircleDashed } from 'lucide-react';
import toast from 'react-hot-toast';
import { createSuspect } from '../services/supabaseService';

type Gender = 'male' | 'female' | 'unknown';

const GENDER_ICON: Record<Gender, React.ReactNode> = {
  male:    <Mars size={13} className="text-blue-400" />,
  female:  <Venus size={13} className="text-pink-400" />,
  unknown: <CircleDashed size={13} className="text-slate-500" />,
};

const GENDER_STYLE: Record<Gender, string> = {
  male:    'text-blue-300 border-blue-700/50 bg-blue-950/30',
  female:  'text-pink-300 border-pink-700/50 bg-pink-950/30',
  unknown: 'text-slate-400 border-slate-700/50 bg-slate-800/30',
};

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male',    label: 'Male'    },
  { value: 'female',  label: 'Female'  },
  { value: 'unknown', label: 'Unknown' },
];

interface SaveSketchDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  sketchUrl: string | null;
  defaultCaseNumber?: string;
  /** Gender detected from the witness interview */
  sketchGender?: Gender;
}

export const SaveSketchDialog: React.FC<SaveSketchDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  sketchUrl, 
  defaultCaseNumber,
  sketchGender: initialGender = 'unknown',
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<Gender>(initialGender);

  useEffect(() => {
    if (isOpen) {
      setName(defaultCaseNumber ? `Case ${defaultCaseNumber} - Sketch` : 'Generated Sketch');
      setDescription('AI Generated composite sketch from witness testimony.');
      setGender(initialGender);
    }
  }, [isOpen, defaultCaseNumber, initialGender]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Case/Subject name is required.'); return; }
    if (!sketchUrl)   { toast.error('No sketch to save.'); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch(sketchUrl);
      const blob = await res.blob();
      const file = new File([blob], `sketch_${Date.now()}.jpg`, { type: 'image/jpeg' });

      await createSuspect(
        `[SKETCH] ${name.trim()}`, 
        description.trim(), 
        file, 
        'person_of_interest',
        gender,   // ← gender now persisted to DB
      );
      
      toast.success(`Sketch saved to Case History ✓ (${gender})`);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save sketch: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            {/* Modal */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: '-50%', y: 'calc(-50% + 20px)' }}
                animate={{ opacity: 1, scale: 1,    x: '-50%', y: '-50%' }}
                exit={{   opacity: 0, scale: 0.95,  x: '-50%', y: 'calc(-50% + 20px)' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(10,14,24,0.97) 0%, rgba(7,10,18,0.98) 100%)',
                  border: '1px solid rgba(71,85,105,0.45)',
                  borderRadius: '16px',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,211,238,0.04)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Save size={16} className="text-cyan-400" />
                    </div>
                    <div>
                      <Dialog.Title className="text-sm font-bold tracking-widest text-slate-100 font-mono uppercase">
                        Save to Case History
                      </Dialog.Title>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-mono tracking-wider">FORENSIC RECORD CREATION</p>
                    </div>
                  </div>
                  <Dialog.Close className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800/80 rounded-lg border border-transparent hover:border-slate-700/60 transition-all">
                    <X size={15} />
                  </Dialog.Close>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Sketch preview + fields side by side */}
                  <div className="flex gap-4">
                    {/* Preview */}
                    <div className="w-1/3 flex-shrink-0">
                      <div className="w-full aspect-square bg-slate-900/80 border border-slate-800/60 rounded-xl overflow-hidden flex items-center justify-center relative">
                        {sketchUrl ? (
                          <img src={sketchUrl} alt="Sketch preview" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-slate-600 text-xs text-center px-2">No Sketch</span>
                        )}
                        {/* Gender badge on image */}
                        <div className={`absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] font-mono uppercase tracking-wider ${GENDER_STYLE[gender]}`}>
                          {GENDER_ICON[gender]}
                          {gender}
                        </div>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="flex-1 space-y-4">
                      {/* Case name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                          Case / File Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Case 2024-001"
                          className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                        />
                      </div>

                      {/* Notes */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                          Notes / Description
                        </label>
                        <textarea
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Witness remarks or case details..."
                          className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gender selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                        Suspect Gender
                      </label>
                      {initialGender !== 'unknown' && (
                        <span className="text-[10px] font-mono text-cyan-600 tracking-wider">
                          ✓ Auto-detected from interview
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {GENDER_OPTIONS.map((g) => {
                        const isSelected = gender === g.value;
                        const baseStyle = GENDER_STYLE[g.value];
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => setGender(g.value)}
                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                              isSelected
                                ? `${baseStyle} ring-1 ring-offset-0 ${g.value === 'male' ? 'ring-blue-600/40' : g.value === 'female' ? 'ring-pink-600/40' : 'ring-slate-600/40'}`
                                : 'text-slate-600 border-slate-800/60 bg-slate-900/40 hover:border-slate-700/60 hover:text-slate-400'
                            }`}
                          >
                            {GENDER_ICON[g.value]}
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[10px] font-mono text-slate-700">
                      Stored with the record for gender-aware biometric matching.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2 border-t border-slate-800/50">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/50"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      type="submit"
                      disabled={isSubmitting || !sketchUrl}
                      className="px-5 py-2 rounded-lg text-sm font-bold bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white transition-all flex items-center gap-2 hover:shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                    >
                      {isSubmitting
                        ? <><Loader2 size={15} className="animate-spin" /><span>Saving...</span></>
                        : <><Save size={14} /><span>Save Record</span></>
                      }
                    </button>
                  </div>
                </form>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default SaveSketchDialog;
