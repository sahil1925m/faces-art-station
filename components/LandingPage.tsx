import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Mic, LayoutDashboard } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
    onDashboard: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onDashboard }) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div ref={targetRef} className="relative w-full h-full min-h-screen overflow-hidden bg-[#0B0D12] text-white selection:bg-[#22D3EE]/30 selection:text-white">

            {/* Parallax Background */}
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity grayscale"
                    style={{ backgroundImage: `url('/hero-collage.png')` }}
                />
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

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-4xl mx-auto text-center"
                >
                    {/* Hero Text */}
                    <div className="space-y-6 mb-14">
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

                    {/* Dual Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {/* Primary: Start New Case */}
                        <button
                            onClick={onStart}
                            className="group relative w-full sm:w-auto px-10 py-5 bg-[#22D3EE]/10 text-white rounded-[14px] border border-[#22D3EE]/40 shadow-xl transition-all duration-300 hover:bg-[#22D3EE]/20 hover:border-[#22D3EE] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#22D3EE]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex items-center justify-center gap-3 z-10">
                                <Mic size={20} className="text-[#22D3EE] group-hover:scale-110 transition-transform duration-200" />
                                <div className="text-left">
                                    <div className="text-[10px] text-[#22D3EE]/70 uppercase tracking-widest font-semibold mb-0.5">Initiate</div>
                                    <div className="text-base font-bold tracking-wider text-white">START NEW CASE</div>
                                </div>
                            </div>
                        </button>

                        {/* Secondary: Access Dashboard */}
                        <button
                            onClick={onDashboard}
                            className="group relative w-full sm:w-auto px-10 py-5 bg-[#161920] text-slate-400 rounded-[14px] border border-slate-700/60 shadow-lg transition-all duration-300 hover:border-slate-500 hover:text-slate-200 hover:bg-[#1e2230] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-700/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative flex items-center justify-center gap-3 z-10">
                                <LayoutDashboard size={20} className="text-slate-500 group-hover:text-slate-300 transition-colors duration-200" />
                                <div className="text-left">
                                    <div className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-0.5 group-hover:text-slate-500 transition-colors">Admin</div>
                                    <div className="text-base font-bold tracking-wider">ACCESS DASHBOARD</div>
                                </div>
                            </div>
                        </button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-sm text-[#5d6878] max-w-sm mx-auto mt-8"
                    >
                        By initializing, you agree to the forensic protocol and data processing standards.
                    </motion.p>
                </motion.div>

            </div>

            {/* Soft Ambient Glows */}
            <motion.div
                animate={{ opacity: [0.03, 0.08, 0.03] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#22D3EE] rounded-full blur-[200px] opacity-5 pointer-events-none"
            />
        </div>
    );
};

export default LandingPage;
