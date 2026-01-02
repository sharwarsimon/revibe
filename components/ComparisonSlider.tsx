
import React, { useState, useRef } from 'react';

interface ComparisonSliderProps {
  before: string;
  after: string;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ before, after }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = ((x - rect.left) / rect.width) * 100;
    setPosition(Math.min(Math.max(pos, 0), 100));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-ew-resize select-none bg-slate-200 border border-slate-200 shadow-xl"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      {/* Restored Image (Background) */}
      <img src={after} alt="Restored" className="absolute top-0 left-0 w-full h-full object-cover" />
      
      {/* Original Image (Foreground, clipped) */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden border-r-2 border-white shadow-[2px_0_10px_rgba(0,0,0,0.1)] z-10"
        style={{ width: `${position}%` }}
      >
        <img 
          src={before} 
          alt="Original" 
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth }}
        />
      </div>

      {/* Slider Control Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white z-20"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-indigo-600/10">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-indigo-600 rounded-full"></div>
            <div className="w-1 h-3 bg-indigo-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] z-30">
        Original
      </div>
      <div className="absolute bottom-6 right-6 px-4 py-2 bg-indigo-600/80 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-[0.2em] z-30">
        Revived
      </div>
    </div>
  );
};

export default ComparisonSlider;
