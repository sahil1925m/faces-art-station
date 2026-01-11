import React, { useState, useRef } from 'react';

interface ResizableSplitPaneProps {
    top: React.ReactNode;
    bottom: React.ReactNode;
    initialTopHeight?: string; // Percentage (e.g., "70%") or px
}

const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
    top,
    bottom,
    initialTopHeight = '70%'
}) => {
    const [topHeight, setTopHeight] = useState(initialTopHeight);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    // Convert initial percentage to pixel value on mount if needed, or just rely on CSS
    // For simplicity, we'll store height as CSS string (usually percentage)

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        isDragging.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'row-resize';
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const relativeY = e.clientY - containerRect.top;

        // Clamp values (min 20%, max 80%)
        const percentage = (relativeY / containerRect.height) * 100;
        const clampedPercentage = Math.min(Math.max(percentage, 20), 80);

        setTopHeight(`${clampedPercentage}%`);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
    };

    return (
        <div ref={containerRef} className="flex flex-col h-full w-full overflow-hidden">
            <div style={{ height: topHeight }} className="w-full min-h-0 relative">
                {top}
            </div>

            {/* Resizer Handle */}
            <div
                className="h-2 w-full cursor-row-resize bg-transparent hover:bg-white/10 flex items-center justify-center -mt-1 -mb-1 z-50 transition-colors"
                onMouseDown={handleMouseDown}
            >
                <div className="w-16 h-1 rounded-full bg-white/20 hover:bg-white/40" />
            </div>

            <div style={{ height: `calc(100% - ${topHeight})` }} className="w-full min-h-0 relative">
                {bottom}
            </div>
        </div>
    );
};

export default ResizableSplitPane;
