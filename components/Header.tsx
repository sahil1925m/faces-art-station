import * as React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
    onReset: () => void;
    showControls: boolean;
    onExport: () => void;
    caseNumber: string;
    onCaseNumberChange: (value: string) => void;
    onSearch: () => void;
    isSearchEnabled: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, showControls, onExport, caseNumber, onCaseNumberChange, onSearch, isSearchEnabled }) => {
  
  if (showControls) {
    return (
        <header className="bg-slate-800/50 backdrop-blur-sm p-4 flex justify-between items-center border-b border-slate-700 sticky top-0 z-10 gap-4">
        <div className="text-cyan-400">
            <svg
            height="28"
            viewBox="0 0 130 40"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="F.A.C.E.S. Logo"
            >
            <rect
                x="2"
                y="2"
                width="126"
                height="36"
                rx="6"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="currentColor"
                fontSize="20"
                fontFamily="system-ui, sans-serif"
                fontWeight="bold"
                letterSpacing="2.5"
            >
                F.A.C.E.S.
            </text>
            </svg>
        </div>
        <div className="flex-grow flex justify-center items-center">
            <input
                type="text"
                value={caseNumber}
                onChange={(e) => onCaseNumberChange(e.target.value)}
                placeholder="Case Number..."
                className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-shadow w-48"
            />
        </div>
        <div className="flex items-center gap-2">
            <motion.button
                onClick={onSearch}
                disabled={!isSearchEnabled}
                className="px-4 py-2 bg-cyan-700 text-cyan-100 font-semibold rounded-md hover:bg-cyan-600 transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                whileTap={{ scale: 0.95 }}
            >
                Search Database
            </motion.button>
            <motion.button
                onClick={onExport}
                disabled={!isSearchEnabled}
                className="px-4 py-2 bg-slate-600 text-slate-100 font-semibold rounded-md hover:bg-slate-500 transition-all duration-200 disabled:bg-slate-700 disabled:cursor-not-allowed"
                 whileTap={{ scale: 0.95 }}
            >
                Export PDF
            </motion.button>
            <motion.button
                onClick={onReset}
                className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-400 transition-all duration-200"
                whileTap={{ scale: 0.95 }}
            >
                New Case
            </motion.button>
        </div>
        </header>
    );
  }

  return (
    <header className="p-4 sticky top-0 z-10">
      <div className="text-cyan-400">
        <svg
          height="28"
          viewBox="0 0 130 40"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="F.A.C.E.S. Logo"
        >
          <rect
            x="2"
            y="2"
            width="126"
            height="36"
            rx="6"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="currentColor"
            fontSize="20"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            letterSpacing="2.5"
          >
            F.A.C.E.S.
          </text>
        </svg>
      </div>
      <div className="mt-4 border border-cyan-400/50 h-8 rounded-lg"></div>
    </header>
  );
};

export default Header;