import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, ShieldAlert, AlertTriangle } from 'lucide-react';
import { DbMatch } from '../types';
import { BiometricMatch } from './BiometricMatch';

interface DatabaseMatchModalProps {
  matches: DbMatch[];
  onClose: () => void;
  isSearching: boolean;
  currentSketchUrl?: string;
}

const DatabaseMatchModal: React.FC<DatabaseMatchModalProps> = ({ matches, onClose, isSearching, currentSketchUrl }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-[#0D1117] border border-slate-700/80 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col"
          style={{ maxHeight: 'calc(100vh - 2rem)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60 rounded-t-xl">
            <div className="flex items-center gap-2.5">
              <Database size={16} className="text-cyan-500" />
              <h2 className="text-sm font-bold tracking-[0.15em] text-slate-100 uppercase font-mono">
                Database Search Results
              </h2>
              {!isSearching && matches.length > 0 && (
                <span className="text-[10px] font-mono text-slate-500 border border-slate-700 px-2 py-0.5 rounded ml-1">
                  {matches.length} candidate{matches.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white hover:bg-slate-800 p-1.5 rounded transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body — scrollable */}
          <div className="flex-1 overflow-y-auto p-5">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-slate-800" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-2 border-t-cyan-500 border-transparent"
                  />
                  <Database size={20} className="absolute inset-0 m-auto text-cyan-600" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-mono text-slate-300 uppercase tracking-widest">Scanning forensic database...</p>
                  <p className="text-xs font-mono text-slate-600">Comparing CLIP embeddings against all subjects</p>
                </div>
              </div>
            ) : matches.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3">
                <AlertTriangle size={32} className="text-slate-700" />
                <p className="text-sm font-mono text-slate-500">No candidates found above the similarity threshold.</p>
                <p className="text-xs font-mono text-slate-700">Try seeding the database with subjects first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matches.map((match, i) => {
                  const isHighMatch = match.score >= 78;
                  const isProbable = match.score >= 60 && match.score < 78;
                  return (
                    <motion.div
                      key={match.subjectId}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-slate-900/60 rounded-lg border overflow-hidden flex flex-col ${
                        isHighMatch ? 'border-teal-700/50' : isProbable ? 'border-amber-800/40' : 'border-slate-700/50'
                      }`}
                    >
                      {/* Photo */}
                      <div className="relative h-40 bg-slate-950 overflow-hidden">
                        <img
                          src={match.imageUrl}
                          alt={match.name ?? `Subject ${match.subjectId}`}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        {/* Score chip */}
                        <div className={`absolute top-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          isHighMatch
                            ? 'bg-teal-950/90 text-teal-400 border-teal-700/60'
                            : isProbable
                            ? 'bg-amber-950/90 text-amber-400 border-amber-700/60'
                            : 'bg-slate-900/90 text-slate-400 border-slate-700/60'
                        }`}>
                          {match.score}%
                        </div>
                        {isHighMatch && (
                          <div className="absolute top-2 left-2">
                            <ShieldAlert size={14} className="text-teal-400" />
                          </div>
                        )}
                      </div>

                      {/* Score bar */}
                      <div className="px-3 pt-2.5">
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${match.score}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.05 + 0.2 }}
                            className={`h-full ${isHighMatch ? 'bg-teal-500' : isProbable ? 'bg-amber-500' : 'bg-slate-600'}`}
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3 space-y-2 flex-1">
                        <div>
                          <p className="text-sm font-semibold text-slate-200 truncate">{match.name ?? 'Unknown Subject'}</p>
                          <p className="text-[10px] font-mono text-slate-600 mt-0.5">ID: {match.subjectId.slice(0, 8)}...</p>
                        </div>
                        {match.description && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{match.description}</p>
                        )}
                      </div>

                      {/* Biometric scan button */}
                      {currentSketchUrl && (
                        <div className="px-3 pb-3">
                          <BiometricMatch sketchUrl={currentSketchUrl} realImageUrl={match.imageUrl} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {!isSearching && matches.length > 0 && (
            <div className="flex-shrink-0 px-5 py-3 border-t border-slate-800 bg-slate-950/40 rounded-b-xl">
              <p className="text-[10px] font-mono text-slate-700 text-center">
                ⚠ CLIP-based semantic similarity. Cross-domain sketch→photo matching requires human expert verification.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DatabaseMatchModal;
