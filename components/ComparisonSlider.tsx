
import React, { useState, useRef, useEffect } from 'react';

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
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none bg-slate-200"
      onMouseMove={handleMove}
      onTouchMove={handleMove}
    >
      <img src={after} alt="Restored" className="absolute top-0 left-0 w-full h-full object-cover" />
      <div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <img src={before} alt="Original" className="w-[100vw] max-w-none h-full object-cover" />
      </div>
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 9l-3 3m0 0l3 3m-3-3h14M16 9l3 3m0 0l-3 3" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-wider">
        Original
      </div>
      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-wider">
        Restored
      </div>
    </div>
  );
};

export default ComparisonSlider;
