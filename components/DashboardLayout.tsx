import React from 'react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
    leftSidebar: React.ReactNode;
    centerPanel: React.ReactNode;
    rightSidebar: React.ReactNode;
    _isLoading?: boolean;
}

export default function DashboardLayout({
    leftSidebar,
    centerPanel,
    rightSidebar,
    _isLoading
}: DashboardLayoutProps) {
    return (
        <div className="flex-1 h-full overflow-hidden relative z-10 w-full max-w-[1920px] mx-auto">
            {/* Desktop Grid Layout (lg+) */}
            <motion.div
                className="hidden lg:grid lg:grid-cols-[340px_1fr_300px] gap-6 h-full p-6 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Left Panel: Visual Library */}
                <section className="h-full overflow-hidden flex flex-col min-h-0">
                    {leftSidebar}
                </section>

                {/* Center Panel: Canvas & Chat */}
                <section className="h-full overflow-hidden flex flex-col min-h-0 relative">
                    <div className="flex-1 h-full flex flex-col gap-6">
                        {centerPanel}
                    </div>
                </section>

                {/* Right Panel: History */}
                <section className="h-full overflow-hidden flex flex-col min-h-0">
                    {rightSidebar}
                </section>
            </motion.div>

            {/* Mobile/Tablet Fallback (Use existing mobile logic in App.tsx or adapt here) */}
            <div className="lg:hidden h-full flex flex-col p-4">
                <div className="flex-1 overflow-hidden relative">
                    {centerPanel}
                </div>
                {/* Note: In a real implementation, we'd add a toggle or tab system here for mobile sidebars
              but for now we rely on the parent App.tsx mobile logic to render specific views 
           */}
            </div>
        </div>
    );
}
