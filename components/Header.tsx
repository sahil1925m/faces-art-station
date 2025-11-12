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
          className="glass-morphism p-4 flex justify-between items-center border-b border-border sticky top-0 z-50 gap-4"
        >
        {/* Logo */}
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
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
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
                stroke="url(#logoGradient)"
                strokeWidth="3"
                fill="none"
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="url(#logoGradient)"
                fontSize="20"
                fontFamily="system-ui, sans-serif"
                fontWeight="bold"
                letterSpacing="2.5"
            >
                F.A.C.E.S.
            </text>
            </svg>
        </motion.div>
        
        {/* Case Number Input */}
        <div className="flex-grow flex justify-center items-center">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="relative"
            >
              <input
                  type="text"
                  value={caseNumber}
                  onChange={(e) => onCaseNumberChange(e.target.value)}
                  placeholder="Case Number..."
                  className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none smooth-transition w-56 placeholder:text-muted-foreground"
              />
              <div className="absolute inset-0 -z-10 bg-primary/5 blur-xl rounded-lg" />
            </motion.div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
            <motion.button
                onClick={onSearch}
                disabled={!isSearchEnabled}
                className="px-5 py-2.5 gradient-primary text-primary-foreground font-semibold rounded-lg hover:shadow-glow smooth-transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="relative z-10">Search Database</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </motion.button>
            
            <motion.button
                onClick={onExport}
                disabled={!isSearchEnabled}
                className="px-5 py-2.5 bg-secondary border border-border text-foreground font-semibold rounded-lg hover:bg-secondary/80 hover:border-primary/50 smooth-transition disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Export PDF
            </motion.button>
            
            <motion.button
                onClick={onReset}
                className="px-5 py-2.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:shadow-lg smooth-transition relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="relative z-10">New Case</span>
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