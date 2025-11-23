import * as React from 'react';

interface RefinementSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  units?: string;
  disabled?: boolean;
}

const RefinementSlider: React.FC<RefinementSliderProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  units = '',
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-white/80">{label}</label>
        <span className="text-xs font-mono text-white bg-white/10 px-2 py-1 rounded-md border border-white/20">
          {value}{units}
        </span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-white/10">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="absolute -top-2 h-6 w-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white rounded-full shadow-lg border-2 border-primary pointer-events-none transition-all duration-200"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-white/30 font-mono uppercase">
        <span>Min</span>
        <span>Max</span>
      </div>
    </div>
  );
};

export default RefinementSlider;
