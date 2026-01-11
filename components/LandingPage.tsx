import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Theme Colors (matched to tailwind config or arbitrary values if config not ready)
    // Background: #0B0D12 (Deep Void)
    // Surface: #161920 (Gunmetal)
    // Accent: #22D3EE (Electric Cyan)
    // Secondary: #94A3B8 (Muted Slate)

    return (
        <div ref={targetRef} className="relative w-full h-full min-h-screen overflow-hidden bg-[#0B0D12] text-white selection:bg-[#22D3EE]/30 selection:text-white">

            {/* Parallax Background */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                {/* Hero Image Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity grayscale"
                    style={{ backgroundImage: `url('/hero-collage.png')` }}
                />

                {/* Branding Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-[#0B0D12]/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D12] via-transparent to-[#0B0D12]" />
            </motion.div>

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-screen px-4 font-sans">

                {/* F.A.C.E.S. Badge */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="absolute top-8 left-8 hidden md:block"
                >
                    <div className="border border-[#22D3EE]/30 text-[#22D3EE] px-3 py-1 text-xs font-bold tracking-widest uppercase rounded flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse" />
                        F.A.C.E.S. Protocol
                    </div>
                </motion.div>

                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-4xl mx-auto text-center"
                >
                    {/* Hero Text */}
                    <div className="space-y-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#161920] border border-[#22D3EE]/20 mb-6"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                            <span className="text-xs font-medium text-[#94A3B8] tracking-wider uppercase">
                                System Online
                            </span>
                        </motion.div>

                        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white drop-shadow-2xl">
                            F.A.C.E.S.
                        </h1>

                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent mx-auto opacity-50 my-6" />

                        <p className="text-xl md:text-2xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-light">
                            Forensic Art Composition & Enhancement System
                        </p>
                    </div>

                    {/* Action Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <button
                            onClick={onStart}
                            className="group relative px-12 py-6 bg-[#161920] text-white rounded-[16px] border border-white/5 shadow-xl transition-all duration-300 hover:border-[#22D3EE] hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] overflow-hidden"
                        >
                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-[#22D3EE]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative flex items-center gap-4 z-10">
                                <div className="text-left">
                                    <div className="text-sm text-[#94A3B8] uppercase tracking-wider font-semibold group-hover:text-[#22D3EE] transition-colors">
                                        Initiate
                                    </div>
                                    <div className="text-xl font-bold tracking-wide group-hover:text-white transition-colors">
                                        START INTERVIEW
                                    </div>
                                </div>

                                <div className="w-10 h-10 rounded-full bg-[#0B0D12] border border-white/10 flex items-center justify-center group-hover:border-[#22D3EE] group-hover:text-[#22D3EE] transition-colors">
                                    <svg
                                        className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </button>

                        <p className="text-sm text-[#5d6878] max-w-sm mx-auto">
                            By initializing, you agree to the forensic protocol and data processing standards.
                        </p>
                    </motion.div>
                </motion.div>

            </div>

            {/* Soft Ambient Glows (Very subtle for noir feel) */}
            <motion.div
                animate={{ opacity: [0.03, 0.08, 0.03] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#22D3EE] rounded-full blur-[200px] opacity-5 pointer-events-none"
            />

        </div>
    );
};

export default LandingPage;
