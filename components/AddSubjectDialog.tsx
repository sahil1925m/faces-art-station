import React, { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UploadCloud, X, Loader2, Venus, Mars, CircleDashed } from 'lucide-react';
import toast from 'react-hot-toast';
import { createSuspect, SuspectCategory } from '../services/supabaseService';

const CATEGORIES: { value: SuspectCategory; label: string }[] = [
  { value: 'known_offender',     label: 'Known Offender' },
  { value: 'missing_person',     label: 'Missing Person' },
  { value: 'person_of_interest', label: 'Person of Interest' },
];

type Gender = 'male' | 'female' | 'unknown';

const GENDER_OPTIONS: { value: Gender; label: string; icon: React.ReactNode; color: string }[] = [
  {
    value: 'male',
    label: 'Male',
    icon: <Mars size={14} />,
    color: 'text-blue-400 border-blue-700/60 bg-blue-950/40 hover:bg-blue-950/70',
  },
  {
    value: 'female',
    label: 'Female',
    icon: <Venus size={14} />,
    color: 'text-pink-400 border-pink-700/60 bg-pink-950/40 hover:bg-pink-950/70',
  },
  {
    value: 'unknown',
    label: 'Unknown',
    icon: <CircleDashed size={14} />,
    color: 'text-slate-400 border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/70',
  },
];

const ACTIVE_GENDER_COLOR: Record<Gender, string> = {
  male:    'text-blue-300 border-blue-500 bg-blue-950/60 shadow-[0_0_12px_rgba(59,130,246,0.2)]',
  female:  'text-pink-300 border-pink-500 bg-pink-950/60 shadow-[0_0_12px_rgba(236,72,153,0.2)]',
  unknown: 'text-slate-300 border-slate-500 bg-slate-800/70',
};

interface AddSubjectDialogProps {
  onSuccess?: () => void;
}

export const AddSubjectDialog: React.FC<AddSubjectDialogProps> = ({ onSuccess }) => {
  const [isOpen,       setIsOpen]       = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name,         setName]         = useState('');
  const [description,  setDescription]  = useState('');
  const [category,     setCategory]     = useState<SuspectCategory>('person_of_interest');
  const [gender,       setGender]       = useState<Gender>('unknown');
  const [file,         setFile]         = useState<File | null>(null);
  const [previewUrl,   setPreviewUrl]   = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setCategory('person_of_interest');
    setGender('unknown');
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setTimeout(clearForm, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Subject name is required.'); return; }
    if (!file)        { toast.error('A photograph is required.'); return; }

    setIsSubmitting(true);
    try {
      await createSuspect(name.trim(), description.trim(), file, category, gender);
      toast.success('Subject record saved to forensic database ✓');
      setIsOpen(false);
      clearForm();
      onSuccess?.();
    } catch (error: unknown) {
      console.error('Error saving subject record:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 px-4 py-2 rounded-lg font-medium border border-cyan-700/50 transition-all text-sm tracking-wide hover:shadow-[0_0_16px_rgba(34,211,238,0.1)]">
          <UserPlus size={15} />
          <span>Add New Subject</span>
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>

            {/* Modal */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: '-50%', y: 'calc(-50% + 20px)' }}
                animate={{ opacity: 1, scale: 1,    x: '-50%', y: '-50%' }}
                exit={{   opacity: 0, scale: 0.96,  x: '-50%', y: 'calc(-50% + 20px)' }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md focus:outline-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(10,14,24,0.97) 0%, rgba(7,10,18,0.98) 100%)',
                  border: '1px solid rgba(71,85,105,0.5)',
                  borderRadius: '16px',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,211,238,0.04)',
                  backdropFilter: 'blur(24px)',
                  maxHeight: 'calc(100vh - 2rem)',
                  overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <UserPlus size={16} className="text-cyan-400" />
                    </div>
                    <div>
                      <Dialog.Title className="text-sm font-bold tracking-widest text-slate-100 font-mono uppercase">
                        New Subject Record
                      </Dialog.Title>
                      <p className="text-[10px] text-slate-600 mt-0.5 font-mono tracking-wider">FORENSIC DATABASE ENTRY</p>
                    </div>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800/80 rounded-lg border border-transparent hover:border-slate-700/60 transition-all"
                      disabled={isSubmitting}
                    >
                      <X size={15} />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                        Classification
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as SuspectCategory)}
                        disabled={isSubmitting}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600/60 transition-all appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Gender — segmented pill buttons */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                        Perceived Gender
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {GENDER_OPTIONS.map((g) => {
                          const isSelected = gender === g.value;
                          return (
                            <button
                              key={g.value}
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => setGender(g.value)}
                              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 ${
                                isSelected
                                  ? ACTIVE_GENDER_COLOR[g.value]
                                  : g.color
                              }`}
                            >
                              {g.icon}
                              {g.label}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] font-mono text-slate-700">
                        Used for gender-aware biometric matching during database scans.
                      </p>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                        Subject Name / Alias
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe / Unknown Male #04"
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2.5 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600/60 transition-all"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                        Physical Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Distinguishing features, height, build, tattoos, scars..."
                        rows={3}
                        className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg px-3 py-2.5 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-600/60 transition-all resize-none"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
                        Photograph
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center transition-all ${
                          previewUrl
                            ? 'border-slate-600/60 bg-slate-900/40'
                            : 'border-slate-700/60 hover:border-cyan-700/50 bg-slate-900/40 cursor-pointer'
                        }`}
                      >
                        {previewUrl ? (
                          <div className="relative w-full flex justify-center">
                            <img src={previewUrl} alt="Preview" className="h-36 object-contain rounded-lg border border-slate-800/80 shadow-lg" />
                            <button
                              type="button"
                              onClick={() => { setFile(null); setPreviewUrl(null); }}
                              className="absolute -top-2 -right-2 bg-slate-800 text-slate-300 hover:text-white rounded-full p-1 border border-slate-600 shadow-lg transition-colors"
                              disabled={isSubmitting}
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ) : (
                          <div className="py-4 flex flex-col items-center pointer-events-none gap-2">
                            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                              <UploadCloud size={22} className="text-slate-600" />
                            </div>
                            <p className="text-sm text-slate-500">Click to upload photograph</p>
                            <p className="text-xs text-slate-700">JPEG, PNG, WEBP (max 5MB)</p>
                          </div>
                        )}
                        {!previewUrl && (
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-1 flex justify-end gap-3 border-t border-slate-800/50">
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="mt-4 px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all text-sm font-medium border border-transparent hover:border-slate-700/50"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow-[0_0_16px_rgba(34,211,238,0.2)]"
                      >
                        {isSubmitting
                          ? <><Loader2 size={15} className="animate-spin" /><span>Saving...</span></>
                          : <span>Save Subject</span>
                        }
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default AddSubjectDialog;
