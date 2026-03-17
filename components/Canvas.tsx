import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CanvasProps {
  currentImage: string;
  isLoading: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ currentImage, isLoading }) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });

  const toggleFullscreen = () => {
    if (!canvasRef.current) return;

    if (!document.fullscreenElement) {
      canvasRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const updateSize = () => {
      if (canvasRef.current) {
        setContainerSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', updateSize);

    // Initial size measure
    updateSize();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <motion.div
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-full bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex flex-col"
    >
      {/* Technical Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Radial Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-radial from-transparent via-black/20 to-black/80" />

      {/* Header / Toolbar Area */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-30 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-mono text-white/40 tracking-widest uppercase">Canvas Active</span>
        </div>

        {/* Fullscreen Button */}
        {currentImage && !isLoading && (
          <button
            onClick={toggleFullscreen}
            className="pointer-events-auto p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-white/60 hover:text-white"
            title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            )}
          </button>
        )}
      </div>

      {/* Scrollable Viewport */}
      <div
        className="flex-1 w-full h-full overflow-auto relative z-10 no-scrollbar flex items-center justify-center p-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <ResizableImage
          src={currentImage}
          alt="Current Composite"
          isLoading={isLoading}
          containerSize={containerSize}
        />
      </div>
    </motion.div>
  );
};

// Internal component for resizable functionality
const ResizableImage: React.FC<{
  src: string;
  alt: string;
  isLoading: boolean;
  containerSize: { width: number, height: number };
}> = ({ src, alt, isLoading, containerSize }) => {
  const [size, setSize] = React.useState({ width: 512, height: 512 });
  const [isResizing, setIsResizing] = React.useState(false);
  const [hasInitialized, setHasInitialized] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(!src?.startsWith('data:'));
  const [hasError, setHasError] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const [previousSrc, setPreviousSrc] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Track when src changes to show loading state
  React.useEffect(() => {
    if (src && src !== previousSrc) {
      // Base64 images load instantly, so we skip the loading state
      setIsImageLoading(!src.startsWith('data:'));
      setHasError(false);
      setPreviousSrc(src);
    }
  }, [src, previousSrc]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setHasError(false);
    setIsImageLoading(true);
  };

  // Build the image src with a cache-buster on retry
  const imageSrc = retryCount > 0 && src
    ? `${src}${src.includes('?') ? '&' : '?'}_retry=${retryCount}`
    : src;

  // Auto-fit logic
  React.useEffect(() => {
    if (!src || hasInitialized || containerSize.width === 0) return;

    // Calculate optimal initial size (85% of smallest dimension)
    const minDim = Math.min(containerSize.width, containerSize.height);
    const initialSize = Math.max(300, Math.min(minDim * 0.85, 800)); // Clamp between 300px and 800px

    setSize({ width: initialSize, height: initialSize });
    setHasInitialized(true);
  }, [src, containerSize, hasInitialized]);

  // Reset initialization when src changes significantly (optional, currently keeping size stable)
  // If you want to re-fit on every new image, uncomment:
  // React.useEffect(() => { setHasInitialized(false); }, [src]);

  const startResize = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const doDrag = (dragEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) {
        newWidth = startWidth + (dragEvent.clientX - startX);
      }
      if (direction.includes('left')) {
        newWidth = startWidth - (dragEvent.clientX - startX);
      }
      if (direction.includes('bottom')) {
        newHeight = startHeight + (dragEvent.clientY - startY);
      }
      if (direction.includes('top')) {
        newHeight = startHeight - (dragEvent.clientY - startY);
      }

      // Constrain size
      newWidth = Math.max(200, newWidth); // No max limit, just min
      newHeight = Math.max(200, newHeight);

      setSize({ width: newWidth, height: newHeight });
    };

    const stopDrag = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  if (!src) {
    return (
      <div className="flex flex-col items-center justify-center text-white/20 gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <p className="font-mono text-sm">Awaiting Composite Generation...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: size.width, height: size.height }}
      className="relative flex-shrink-0 transition-shadow duration-200 group select-none"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={src}
          initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl bg-black"
        >
          {!hasError ? (
            <img
              src={imageSrc}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
              draggable={false}
              onLoad={() => { setIsImageLoading(false); setHasError(false); }}
              onError={() => { setIsImageLoading(false); setHasError(true); }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/60 p-6">
              <svg className="w-16 h-16 text-red-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-white/80">Image Failed to Load</p>
                <p className="text-xs text-white/40 max-w-[250px]">
                  The image generation service (Pollinations AI) may be temporarily unavailable.
                </p>
              </div>
              <button
                onClick={handleRetry}
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry
              </button>
            </div>
          )}

          {/* Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

          {/* Border Glow */}
          <div className={`absolute inset-0 border border-primary/30 rounded-lg pointer-events-none transition-all duration-300 ${isResizing ? 'border-primary shadow-[0_0_30px_rgba(99,102,241,0.3)]' : 'group-hover:border-primary/60'}`} />
        </motion.div>
      </AnimatePresence>

      {/* Resize Handles */}
      <div className={`absolute -inset-4 pointer-events-none transition-opacity duration-200 ${isResizing || !hasInitialized ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>

        {/* Corner Handles */}
        <div className="absolute top-4 left-4 w-4 h-4 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize pointer-events-auto flex items-center justify-center" onMouseDown={(e) => startResize(e, 'top-left')}>
          <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform hover:scale-150" />
        </div>
        <div className="absolute top-4 right-4 w-4 h-4 translate-x-1/2 -translate-y-1/2 cursor-ne-resize pointer-events-auto flex items-center justify-center" onMouseDown={(e) => startResize(e, 'top-right')}>
          <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform hover:scale-150" />
        </div>
        <div className="absolute bottom-4 left-4 w-4 h-4 -translate-x-1/2 translate-y-1/2 cursor-sw-resize pointer-events-auto flex items-center justify-center" onMouseDown={(e) => startResize(e, 'bottom-left')}>
          <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform hover:scale-150" />
        </div>
        <div className="absolute bottom-4 right-4 w-4 h-4 translate-x-1/2 translate-y-1/2 cursor-se-resize pointer-events-auto flex items-center justify-center" onMouseDown={(e) => startResize(e, 'bottom-right')}>
          <div className="w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-transform hover:scale-150" />
        </div>

        {/* Edge Handles (Invisible but clickable areas) */}
        <div className="absolute top-2 left-4 right-4 h-4 cursor-n-resize pointer-events-auto" onMouseDown={(e) => startResize(e, 'top')} />
        <div className="absolute bottom-2 left-4 right-4 h-4 cursor-s-resize pointer-events-auto" onMouseDown={(e) => startResize(e, 'bottom')} />
        <div className="absolute left-2 top-4 bottom-4 w-4 cursor-w-resize pointer-events-auto" onMouseDown={(e) => startResize(e, 'left')} />
        <div className="absolute right-2 top-4 bottom-4 w-4 cursor-e-resize pointer-events-auto" onMouseDown={(e) => startResize(e, 'right')} />
      </div>

      {/* Loading Overlay - shows during API processing OR image URL loading */}
      {(isLoading || isImageLoading) && !hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center z-20"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-mono text-primary/80 animate-pulse">
              {isLoading ? 'PROCESSING...' : 'GENERATING SKETCH...'}
            </span>
            <span className="text-xs text-white/40">This may take 10-30 seconds</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Canvas;