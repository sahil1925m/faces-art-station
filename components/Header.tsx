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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-morphism p-3 md:p-4 flex justify-between items-center border-b border-border sticky top-0 z-50 gap-2 md:gap-4"
      >
        {/* Logo - Hidden on Refinement Page as requested */}

        {/* Case Number Input - Takes available space */}
        <div className="flex-grow flex justify-start md:justify-center items-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative w-full md:w-auto"
          >
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => onCaseNumberChange(e.target.value)}
              placeholder="Case #"
              className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none smooth-transition w-full md:w-56 placeholder:text-gray-400"
            />
            <div className="absolute inset-0 -z-10 bg-primary/5 blur-xl rounded-lg" />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          <motion.button
            onClick={onSearch}
            disabled={!isSearchEnabled}
            className="p-2 md:px-5 md:py-2.5 gradient-primary text-white font-semibold rounded-lg hover:shadow-glow smooth-transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none relative overflow-hidden group flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Search Database"
          >
            <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="relative z-10 hidden md:inline">Search Database</span>
          </motion.button>

          <motion.button
            onClick={onExport}
            disabled={!isSearchEnabled}
            className="p-2 md:px-5 md:py-2.5 bg-secondary border border-border text-white font-semibold rounded-lg hover:bg-secondary/80 hover:border-primary/50 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Export PDF"
          >
            <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden md:inline">Export PDF</span>
          </motion.button>

          <motion.button
            onClick={onReset}
            className="p-2 md:px-5 md:py-2.5 bg-accent text-white font-semibold rounded-lg hover:shadow-lg smooth-transition relative overflow-hidden group flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="New Case"
          >
            <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="relative z-10 hidden md:inline">New Case</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </div>
      </motion.header>
    );
  }

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 sticky top-0 z-10 glass-morphism"
    >
      <motion.div
        className="text-primary"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <svg
          height="32"
          viewBox="0 0 130 40"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="F.A.C.E.S. Logo"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="logoGradientSimple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(189 94% 43%)" />
              <stop offset="100%" stopColor="hsl(189 94% 55%)" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="2"
            width="126"
            height="36"
            rx="8"
            stroke="url(#logoGradientSimple)"
            strokeWidth="3"
            fill="none"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="url(#logoGradientSimple)"
            fontSize="20"
            fontFamily="system-ui, sans-serif"
            fontWeight="bold"
            letterSpacing="2.5"
          >
            F.A.C.E.S.
          </text>
        </svg>
      </motion.div>
    </motion.header>
  );
};

export default Header;