import React, { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, UploadCloud, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { createSuspect } from '../services/supabaseService';

export const AddCriminalDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const clearForm = () => {
    setName('');
    setDescription('');
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Clear form on close after a tiny delay for animation
      setTimeout(clearForm, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Suspect name is required.');
      return;
    }
    if (!file) {
      toast.error('A photograph is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createSuspect(name.trim(), description.trim(), file);
      toast.success('Suspect record saved to forensic database ✓');
      setIsOpen(false);
      clearForm();
    } catch (error: unknown) {
      console.error('Error saving suspect record:', error);
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2 rounded-md font-medium border border-slate-600 transition-colors shadow-sm">
          <UserPlus size={18} />
          <span>Add Suspect Record</span>
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            {/* Overlay */}
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>

            {/* Full-screen click-outside + centering wrapper */}
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none"
              >
                {/* The actual modal panel — stops click propagation */}
                <div
                  className="relative w-full max-w-md bg-slate-900 border border-slate-700 shadow-2xl rounded-xl text-slate-200 flex flex-col"
                  style={{ maxHeight: 'calc(100vh - 2rem)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header — fixed, never scrolls */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800 flex-shrink-0">
                    <Dialog.Title className="text-xl font-semibold tracking-tight text-slate-100">
                      New Forensic Record
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-1.5 rounded-md transition-colors"
                        aria-label="Close"
                        disabled={isSubmitting}
                      >
                        <X size={20} />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Scrollable body */}
                  <div className="overflow-y-auto px-6 py-5 flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                          Suspect Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="description" className="block text-sm font-medium text-slate-300">
                          Physical Description
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Distinguishing features, height, build, tattoos..."
                          rows={3}
                          className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300">Photograph</label>
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 text-center transition-colors
                            ${previewUrl ? 'border-slate-600 bg-slate-900/50' : 'border-slate-700 hover:border-slate-500 bg-slate-950'}
                          `}
                        >
                          {previewUrl ? (
                            <div className="relative w-full flex justify-center">
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-36 object-contain rounded-md border border-slate-800 shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => { setFile(null); setPreviewUrl(null); }}
                                className="absolute -top-2 -right-2 bg-slate-800 text-slate-200 hover:text-white rounded-full p-1 border border-slate-600 shadow-lg"
                                disabled={isSubmitting}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="py-5 flex flex-col items-center pointer-events-none">
                              <UploadCloud size={32} className="text-slate-500 mb-2" />
                              <p className="text-sm text-slate-400">Click to upload photograph</p>
                              <p className="text-xs text-slate-600 mt-1">JPEG, PNG, WEBP (max 5MB)</p>
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

                      {/* Action buttons — inside scroll area so always reachable */}
                      <div className="pt-3 pb-1 flex justify-end gap-3">
                        <Dialog.Close asChild>
                          <button
                            type="button"
                            className="px-4 py-2 rounded-md text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors font-medium"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                        </Dialog.Close>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white px-5 py-2 rounded-md font-medium transition-all shadow-sm shadow-blue-900/50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <span>Save Record</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
