import * as React from 'react';
import { HistoryEntry } from '../types';

interface HistoryPanelProps {
  history: HistoryEntry[];
  onSelectHistory: (entry: HistoryEntry) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectHistory }) => {
  return (
    <div className="bg-slate-800 rounded-lg p-4 flex flex-col h-full">
      <h2 className="text-lg font-bold text-cyan-400 border-b border-slate-700 pb-2 mb-4">Version History</h2>
      <div className="overflow-y-auto flex-grow pr-2">
        <ul className="space-y-2">
          {history.map((entry) => (
            <li key={entry.id}>
              <button 
                onClick={() => onSelectHistory(entry)}
                className="flex items-start gap-3 w-full text-left p-2 rounded-md hover:bg-slate-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <div className="flex-shrink-0">
                  <img
                    src={entry.imageUrl}
                    alt={`History version`}
                    className="w-16 h-16 rounded-md object-cover border-2 border-slate-600"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-slate-200">{entry.change}</p>
                  <time className="text-xs text-slate-400">{entry.timestamp}</time>
                </div>
              </button>
            </li>
          ))}
        </ul>
        {history.length === 0 && (
            <div className="text-center text-slate-500 pt-10">
                <p>History of refinements will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;