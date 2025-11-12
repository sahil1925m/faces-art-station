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
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label htmlFor={label} className="text-sm font-medium text-slate-300">{label}</label>
        <span className="text-sm font-semibold text-cyan-400 tabular-nums">
          {value}{units}
        </span>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-cyan-400 [&::-webkit-slider-thumb]:disabled:bg-slate-500"
      />
    </div>
  );
};

export default RefinementSlider;
