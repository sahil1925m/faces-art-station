import * as React from 'react';
import { HistoryEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelectHistory: (entry: HistoryEntry) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectHistory }) => {
  return (
    <div className="h-full flex flex-col glass-morphism rounded-2xl border border-white/10 overflow-hidden shadow-lg bg-black/60">
      <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/10 shadow-inner">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white tracking-tight">History</h2>
            <p className="text-xs text-white/60 font-medium">Timeline of changes</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-40 text-white/30 text-center p-4"
            >
              <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-sm">No refinements yet</p>
            </motion.div>
          ) : (
            history.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectHistory(entry)}
                className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 transition-all duration-200 cursor-pointer flex gap-3 items-start"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black/50">
                  <img src={entry.imageUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/40 font-mono mb-1">{entry.timestamp}</p>
                  <p className="text-sm text-white/90 font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {entry.change}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryPanel;